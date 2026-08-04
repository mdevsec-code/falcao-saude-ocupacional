# Deployment

Este documento cobre o **frontend** (SPA estático). Para o deploy da API
(`server/`) e do banco Postgres — incluindo a opção gratuita para testes
(Render + Neon) e a opção paga (Railway) — ver `server/README.md`.

A plataforma pode ser implantada de **4 formas oficiais**: Docker, Vercel,
Netlify e Azure Static Web Apps. Todas produzem um **SPA estático** servido
por CDN.

> O resultado de `npm run build` é uma pasta `dist/` com HTML, JS, CSS e
> assets — tudo versionável e imutável.

## 1. Docker (recomendado para on-premise)

### Build

```bash
docker build -t falcao-web:latest .
```

### Run local

```bash
docker run --rm -p 8080:80 \
  -e VITE_API_URL=https://api.falcao.com \
  falcao-web:latest
```

Acesse `http://localhost:8080`.

> O `Dockerfile` é **multi-stage**:
> 1. **build** — Node 20, instala deps, roda `npm run build`.
> 2. **runtime** — Nginx 1.27, serve `dist/` e faz SPA fallback.
>
> Imagem final: ~25 MB (Alpine).

### Docker Compose (opcional)

```bash
docker compose up -d
```

Inclui o serviço `web` (este build) e pode futuramente incluir `api`,
`db`, `redis`.

### Configuração Nginx

`docker/nginx.conf`:

- SPA fallback (`try_files` → `/index.html`).
- Cache de assets com `immutable` (1 ano).
- Compressão gzip/brotli.
- Headers de segurança: `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Strict-Transport-Security`.

## 2. Vercel

Já está configurado via [`vercel.json`](../vercel.json).

### Setup manual

1. Conecte o repositório no [Vercel](https://vercel.com/new).
2. Framework: **Vite**.
3. Build command: `npm run build`.
4. Output dir: `dist`.
5. Variáveis de ambiente (Project Settings → Environment Variables):
   - `VITE_API_URL`
   - `VITE_ENABLE_MSW=false`
   - `VITE_DEFAULT_LOCALE=pt-BR`
   - `VITE_ENABLE_MICROSOFT_SSO=true` (opcional — só depois de configurar o
     Azure AD, ver `server/README.md`)

### Deploy manual

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 3. Netlify

Já está configurado via [`netlify.toml`](../netlify.toml).

### Setup manual

1. Conecte o repositório no [Netlify](https://app.netlify.com/start).
2. Build command: `npm run build`.
3. Publish dir: `dist`.
4. Variáveis: `VITE_API_URL`, etc.

### Deploy manual

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## 4. Azure Static Web Apps

Já está configurado via
[`azure/staticwebapp.config.json`](../azure/staticwebapp.config.json).

### Setup manual

1. Crie um recurso **Static Web App** apontando para o repositório.
2. YAML do GitHub Actions sugerido:
   ```yaml
   - uses: Azure/static-web-apps-deploy@v1
     with:
       azure_static_web_apps_api_token: ${{ secrets.AZURE_TOKEN }}
       repo_token: ${{ secrets.GITHUB_TOKEN }}
       action: 'build'
       app_location: '/'
       output_location: 'dist'
   ```

## Variáveis de ambiente

Todas as variáveis são **inlined no build** (Vite) e precisam estar
disponíveis **no momento do build** (não no runtime).

| Var | Default | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5173/api` | URL base da API |
| `VITE_ENABLE_MSW` | `false` | Habilita mock em dev (não usar em prod) |
| `VITE_ENABLE_MICROSOFT_SSO` | `false` | Mostra o botão "Entrar com Microsoft" (requer Azure AD configurado no backend) |
| `VITE_DEFAULT_LOCALE` | `pt-BR` | Locale inicial |
| `VITE_APP_NAME` | `Falcão Saúde Ocupacional` | `<title>` e meta |
| `VITE_SENTRY_DSN` | — | DSN do Sentry (opcional) |
| `VITE_LOG_LEVEL` | `info` | Nível mínimo de log |

## Checklist de release

- [ ] `npm run validate` passa 100%.
- [ ] Tag criada (`vX.Y.Z`).
- [ ] CHANGELOG atualizado.
- [ ] Variáveis de ambiente configuradas no provedor.
- [ ] Smoke test em `/login` e `/`.
- [ ] Healthcheck da API real (Etapa 3+).
- [ ] Versão bumped no `package.json` e `package-lock.json`.
- [ ] **Azure only**: atualizar `Content-Security-Policy` em
  `azure/staticwebapp.config.json` — o `connect-src` hoje só libera
  `'self'` + Google Fonts. Quando o backend real (Etapa 3) estiver no ar,
  adicionar o domínio da API ali, senão todo `fetch()` para fora do
  domínio do front é bloqueado pelo browser. Vercel/Netlify não têm CSP
  configurado, então não têm esse problema.

## Rollback

- **Vercel/Netlify**: clicar em "Promote to production" no deploy anterior.
- **Docker**: `docker run` da tag anterior.
- **Azure**: re-deploy do commit anterior via portal.

## Observabilidade (Etapa 7)

- **Logs**: stdout/stderr → coletor de logs do provedor.
- **Métricas**: Web Vitals → analytics (Sentry, Datadog, etc.).
- **Errors**: Sentry (configurar `VITE_SENTRY_DSN`).
- **Traces**: OpenTelemetry (opcional).
