import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import type { LoginDto } from './dto/login.dto';

export interface SessionResponse {
  user: { id: string; name: string; email: string; role: string };
  token: string;
  expiresAt: string;
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8h — mesma duração usada no mock MSW
const SSO_STATE_TTL = '5m';

interface SsoStatePayload {
  purpose: 'sso_state';
  nonce: string;
}

/**
 * Cache do JWKS da Microsoft por tenant — `createRemoteJWKSet` já gerencia
 * cache/rotação de chaves internamente, então mantemos uma instância por
 * tenant em vez de recriar a cada requisição.
 */
const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getMicrosoftJwks(tenantId: string): ReturnType<typeof createRemoteJWKSet> {
  let jwks = jwksCache.get(tenantId);
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`),
    );
    jwksCache.set(tenantId, jwks);
  }
  return jwks;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto, ip?: string): Promise<SessionResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    const valid = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;

    if (!user || !valid || user.status !== 'active') {
      await this.audit.record({
        actorId: user?.id ?? null,
        actorName: user?.name ?? email,
        actorRole: user?.role ?? null,
        action: 'login_failed',
        entityType: 'auth',
        entityLabel: email,
        detail: user && user.status !== 'active' ? 'Usuário inativo' : 'Credenciais inválidas',
        ip,
      });
      throw new UnauthorizedException(
        user && user.status !== 'active' ? 'Usuário inativo' : 'Credenciais inválidas',
      );
    }

    await this.audit.record({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'login',
      entityType: 'auth',
      entityLabel: user.email,
      ip,
    });

    return this.issueSession(user);
  }

  async logout(userId: string, userName: string, userEmail: string): Promise<void> {
    await this.audit.record({
      actorId: userId,
      actorName: userName,
      action: 'logout',
      entityType: 'auth',
      entityLabel: userEmail,
    });
  }

  private getRequiredConfig(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} não configurado.`);
    return value;
  }

  /** Monta a URL de autorização da Microsoft e o `state` assinado (anti-CSRF, expira em 5 min). */
  getMicrosoftAuthorizeUrl(): string {
    const tenantId = this.getRequiredConfig('AZURE_AD_TENANT_ID');
    const clientId = this.getRequiredConfig('AZURE_AD_CLIENT_ID');
    const redirectUri = this.getRequiredConfig('AZURE_AD_REDIRECT_URI');

    const statePayload: SsoStatePayload = { purpose: 'sso_state', nonce: randomUUID() };
    const state = this.jwt.sign(statePayload, { expiresIn: SSO_STATE_TTL });

    const url = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_mode', 'query');
    url.searchParams.set('scope', 'openid profile email');
    url.searchParams.set('state', state);
    return url.toString();
  }

  /**
   * Troca o `code` da Microsoft por tokens, valida o `id_token` (assinatura,
   * emissor e audiência) e autentica o usuário já cadastrado com o e-mail
   * correspondente. Não cria contas novas — o login via Microsoft só
   * funciona para quem o RH/Admin já cadastrou em Usuários; preserva o
   * mesmo controle de acesso (RBAC) do login por senha.
   */
  async handleMicrosoftCallback(
    code: string,
    state: string,
    ip?: string,
  ): Promise<SessionResponse> {
    try {
      await this.jwt.verifyAsync<SsoStatePayload>(state);
    } catch {
      throw new UnauthorizedException('Sessão de login expirada, tente novamente.');
    }

    const tenantId = this.getRequiredConfig('AZURE_AD_TENANT_ID');
    const clientId = this.getRequiredConfig('AZURE_AD_CLIENT_ID');
    const clientSecret = this.getRequiredConfig('AZURE_AD_CLIENT_SECRET');
    const redirectUri = this.getRequiredConfig('AZURE_AD_REDIRECT_URI');

    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'openid profile email',
        }),
      },
    );

    if (!tokenResponse.ok) {
      throw new UnauthorizedException('Não foi possível validar o login com a Microsoft.');
    }

    const { id_token: idToken } = (await tokenResponse.json()) as { id_token?: string };
    if (!idToken) {
      throw new UnauthorizedException('Resposta inválida da Microsoft.');
    }

    const { payload } = await jwtVerify(idToken, getMicrosoftJwks(tenantId), {
      issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      audience: clientId,
    });

    const email = (payload.email ?? payload.preferred_username) as string | undefined;
    if (!email) {
      throw new UnauthorizedException('A conta Microsoft não possui um e-mail associado.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || user.status !== 'active') {
      await this.audit.record({
        actorId: user?.id ?? null,
        actorName: user?.name ?? normalizedEmail,
        actorRole: user?.role ?? null,
        action: 'login_failed',
        entityType: 'auth',
        entityLabel: normalizedEmail,
        detail: user
          ? 'Usuário inativo (login Microsoft)'
          : 'Conta não cadastrada (login Microsoft)',
        ip,
      });
      throw new UnauthorizedException(
        user
          ? 'Usuário inativo.'
          : 'Sua conta Microsoft não está cadastrada na plataforma. Peça ao RH/Admin para criar seu acesso em Usuários.',
      );
    }

    await this.audit.record({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'login',
      entityType: 'auth',
      entityLabel: user.email,
      detail: 'Login via Microsoft (SSO)',
      ip,
    });

    return this.issueSession(user);
  }

  private issueSession(user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }): SessionResponse {
    const token = this.jwt.sign({ sub: user.id, role: user.role });
    return {
      user,
      token,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    };
  }
}
