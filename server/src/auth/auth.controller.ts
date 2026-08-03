import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService, type SessionResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedRequest } from './jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  private frontendUrl(path: string): string {
    const base = this.config.get<string>('FRONTEND_URL') ?? '';
    return `${base}${path}`;
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 tentativas/min por IP — trava força-bruta
  login(@Body() dto: LoginDto, @Req() req: Request): Promise<SessionResponse> {
    return this.authService.login(dto, req.ip);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: AuthenticatedRequest): Promise<{ success: true }> {
    await this.authService.logout(req.user.id, req.user.name, req.user.email);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get('microsoft')
  @Redirect()
  loginWithMicrosoft(): { url: string } {
    return { url: this.authService.getMicrosoftAuthorizeUrl() };
  }

  @Get('microsoft/callback')
  @Redirect()
  async microsoftCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Req() req: Request,
  ): Promise<{ url: string }> {
    if (errorDescription || !code || !state) {
      return { url: this.frontendUrl('/login?error=sso_failed') };
    }

    try {
      const session = await this.authService.handleMicrosoftCallback(code, state, req.ip);
      const params = new URLSearchParams({ token: session.token, expiresAt: session.expiresAt });
      return { url: this.frontendUrl(`/auth/callback#${params.toString()}`) };
    } catch {
      return { url: this.frontendUrl('/login?error=sso_failed') };
    }
  }
}
