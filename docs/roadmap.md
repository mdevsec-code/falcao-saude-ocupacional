# Roadmap

Status atual e evolução planejada do projeto. Veja também o
[`CHANGELOG`](../CHANGELOG.md) para o histórico de releases.

---

## ✅ Etapa 1 — Fundação (v0.1.0)

> Concluída. Estabeleceu o design system e o shell da aplicação.

- [x] Tokens visuais (paleta dourada + verde-petróleo), reset CSS
- [x] Design System primitivo (Button, Input, Card, Badge, Skeleton,
  Tooltip, Separator, Avatar)
- [x] AppShell (Sidebar + Topbar), ThemeToggle (light/dark)
- [x] Dashboard de boas-vindas com KPIs placeholder
- [x] Login mockado (`admin@falcao.com / admin123`) com AuthStore Zustand
- [x] RBAC constants (`roles.ts`, `permissions.ts`)
- [x] Status constants para domínio de atendimento
- [x] Logo SVG (variantes `mark` e `wordmark`)

---

## ✅ Etapa 2 — Refatoração Enterprise (Unreleased)

> Em curso nesta release. Eleva a base de engenharia em uma década,
> mantendo o comportamento de produto.

### Infraestrutura
- [x] Vite 5 + manual chunks (vendor split)
- [x] TypeScript strict + `noUncheckedIndexedAccess`
- [x] ESLint endurecido (react, jsx-a11y, consistent-type-imports)
- [x] Prettier + `prettier-plugin-tailwindcss`
- [x] Husky + lint-staged + commitlint (Conventional Commits)
- [x] `engines` (Node 20.11+, npm 10+)
- [x] `.editorconfig`, `.nvmrc`, `.dockerignore`, `.env.example`

### Camadas
- [x] `config/{env,features,brand}.ts` com Zod
- [x] `types/env.d.ts` para `ImportMetaEnv`
- [x] `utils/{cn,format,assert,delay,id,result}.ts`
- [x] `validators/{common,auth,index}.ts` (Zod)
- [x] `constants/i18n.ts`

### HTTP / MSW
- [x] `services/http/{client,errors,types}.ts` (Axios + interceptors)
- [x] `services/msw/handlers/{auth,dashboard}.ts`
- [x] `services/msw/{browser,server}.ts` + fixtures

### Features
- [x] `features/auth` — `useAuth`, `<Can>`, `<RequireAuth>`, `authApi`,
      `LoginPage` com React Hook Form + Zod
- [x] `features/dashboard` — `useDashboardKpis` (React Query),
      `DashboardPage` com loading/error states

### i18n
- [x] i18next + react-i18next + detector
- [x] Namespaces: common, auth, dashboard, validation, errors (PT-BR)

### UI
- [x] Radix: Dialog, Tabs, Checkbox, Switch, Spinner, Label, Textarea
- [x] Feedback: EmptyState, ErrorState, LoadingState, NotFoundPage
- [x] `cn()` com tailwind-merge
- [x] Sonner toaster (theme="system")

### Testes
- [x] Vitest + RTL + MSW + jsdom
- [x] Testes unitários (utils, validators, hooks)
- [x] Render helper com `Providers`
- [x] Threshold de cobertura 80% em `lib/utils/validators/hooks`

### CI/CD
- [x] GitHub Actions (CI: install/lint/typecheck/test/build)
- [x] CodeQL scanning
- [x] Templates de issue e PR
- [x] CODEOWNERS, labeler

### Deploy
- [x] Dockerfile multi-stage (Node 20 + Nginx 1.27)
- [x] docker-compose.yml
- [x] vercel.json, netlify.toml, azure/staticwebapp.config.json
- [x] PWA manifest + favicon SVG + robots.txt

### Documentação
- [x] README, CONTRIBUTING, CHANGELOG, CODE_OF_CONDUCT, SECURITY, LICENSE
- [x] docs/architecture, api, deployment, roadmap, database, decisions
- [x] docs/contributing/{branches,commits,pull-requests}

---

## 🔜 Etapa 3 — API Real & Auth OAuth2 (v0.3.0)

> Substitui o MSW por backend real.

- [ ] Backend Node.js (NestJS) + PostgreSQL + Prisma
- [ ] OAuth2 / OIDC (Keycloak ou Auth0)
- [ ] Refresh tokens + rotation
- [ ] `services/http/client.ts` aponta para backend real
- [ ] MSW mantém-se apenas para testes de integração
- [ ] Documentação OpenAPI/Swagger
- [ ] Rate limiting (express-rate-limit) e CORS estrito
- [ ] Sentry SDK (front + back)
- [ ] Auditoria de acessos (LGPD)

## 🔜 Etapa 4 — Agenda (v0.4.0)

> Reforma completa do módulo de agenda.

- [ ] FullCalendar (React) integrado
- [ ] CRUD de agendamentos com RHF + Zod
- [ ] Visualizações: dia, semana, mês, lista
- [ ] Drag & drop, resize, recursão
- [ ] Conflito de horário em tempo real
- [ ] WebSocket para sincronização multiusuário
- [ ] Filtros: médico, status, tipo de exame
- [ ] Exportação iCal/CSV

## 🔜 Etapa 5 — Atendimentos & Pacientes (v0.5.0)

- [ ] CRUD de pacientes (com validação de CPF/CNPJ)
- [ ] Prontuário eletrônico (timeline)
- [ ] Histórico de exames
- [ ] Upload de anexos (S3 ou MinIO)
- [ ] Assinatura digital de documentos
- [ ] Exportação PDF

## 🔜 Etapa 6 — Exames, ASO, Relatórios (v0.6.0)

- [ ] Cadastro de tipos de exame
- [ ] Workflow de resultado (laudo → revisão → liberação)
- [ ] Emissão de ASO com template
- [ ] Relatórios gerenciais (Chart.js ou Recharts)
- [ ] BI / Analytics (Metabase ou similar)

## 🔜 Etapa 7 — Observabilidade, LGPD, Auditoria (v0.7.0)

- [ ] Sentry (front + back)
- [ ] OpenTelemetry / Jaeger
- [ ] Logs estruturados (pino)
- [ ] Auditoria de acessos e alterações
- [ ] Right-to-be-forgotten (LGPD art. 18)
- [ ] Data retention policy
- [ ] SLOs (99.5% disponibilidade, p95 < 500ms)
- [ ] Status page pública

## 🔜 Etapa 8 — Mobile (PWA → React Native) (v0.8.0)

- [ ] PWA instalável (já parcialmente configurado)
- [ ] App React Native (compartilhar `features/*` via monorepo)
- [ ] Push notifications (FCM)
- [ ] Offline-first (SQLite + sync)

---

## Como sugerir novas features

Abra uma issue com template `feature_request.md` ou entre em
[contato@falcao.com](mailto:contato@falcao.com).
