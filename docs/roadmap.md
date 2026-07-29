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
- [x] Login mockado com AuthStore Zustand — 8 contas ativas de demonstração cobrindo
  todos os perfis (admin, médico ×2, enfermeiro, técnico de segurança, RH,
  recepção ×2; há também 1 conta RH inativa para testar bloqueio de login),
  todas com senha `admin123`; seletor de "login rápido" na tela de login
  (`services/msw/fixtures/users.ts`, `services/msw/handlers/auth.ts`)
- [x] RBAC constants (`roles.ts`, `permissions.ts`) — hoje com UI própria:
  `features/users` (CRUD de contas, gate `PERMISSIONS.USERS_MANAGE`) e
  `features/permissions` (matriz de permissões por perfil, somente leitura)
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

## 🚧 Etapa 4 — Agenda (v0.4.0)

> Reforma do módulo de agenda em curso. Primeira fatia entregue como
> `features/agenda` (mock via MSW) — sem FullCalendar/WebSocket ainda.

- [x] CRUD de agendamentos com RHF + Zod (`AppointmentDialog`)
- [x] Visualizações: mês, semana, dia (grades construídas em Tailwind, sem lib externa)
- [x] Conflito de horário em tempo real (mesmo médico, mesmo dia, sobreposição de minutos)
- [x] Filtros: médico, status, tipo de exame
- [ ] FullCalendar (React) integrado — grades atuais são handmade; avaliar se compensa a dependência
- [ ] Drag & drop, resize, recursão
- [ ] WebSocket para sincronização multiusuário (depende de backend real — Etapa 3)
- [ ] Exportação iCal/CSV

## 🚧 Etapa 5 — Atendimentos & Pacientes (v0.5.0)

> Falcão é a única empresa atendida pela plataforma (não é multi-tenant) —
> não há módulo de "Empresas"/"Colaboradores" separado: um paciente já é,
> por definição, um colaborador da Falcão. Os itens de nav/rotas
> correspondentes foram removidos para não sugerir um modelo que não existe.

- [x] CRUD de pacientes (com validação de CPF) — `features/patients`
- [x] Registro de atendimentos (consulta realizada + conclusão clínica: apto/apto c/ restrição/inapto/encaminhado) — `features/attendances`, vinculado a `patientId` real (não texto solto)
- [x] Prontuário eletrônico (timeline consolidada por paciente) — `features/records`, acessível via `/prontuarios?patientId=` a partir do cadastro de pacientes
- [ ] Histórico de exames
- [ ] Upload de anexos (S3 ou MinIO)
- [ ] Assinatura digital de documentos
- [ ] Exportação PDF

## 🚧 Etapa 6 — Exames, ASO, Relatórios (v0.6.0)

> ASO aqui é modelado como aptidão **por atividade de risco** (não um
> apto/inapto genérico) — decisão explícita do usuário: Falcão é
> construtora/engenharia, então o que importa é saber se o colaborador
> está apto para trabalho em altura (NR-35), espaço confinado (NR-33),
> máquinas pesadas (NR-12), eletricidade (NR-10) etc. individualmente.
> Ver `constants/duties.ts`.

- [x] Cadastro de tipos de exame — `features/exams` (CRUD real, `/exames`). Antes era um array
  estático duplicado em `agenda`/`attendances`; agora é fonte única
  (`EXAM_TYPES_FIXTURE`) consumida ao vivo pelos dois, sem listas desconectadas
- [x] Referência de CID-10 — `features/cid`, `/cid`, recorte curado (não exaustivo) focado em
  osteomuscular/auditivo/respiratório/mental/dermatológico/traumatismos relevantes a canteiro de obras
- [ ] Workflow de resultado (laudo → revisão → liberação)
- [x] Emissão de ASO com template — `utils/exports/aso.ts` (PDF por atendimento, com aptidão por atividade)
- [x] Painel de aptidão por atividade de risco — `features/aso`, `/aso`, cruza `features/attendances` × `features/patients`
- [x] Relatórios gerenciais (Recharts) — `features/reports`, `features/atestados`
- [ ] BI / Analytics (Metabase ou similar)

## 🚧 Etapa 7 — Observabilidade, LGPD, Auditoria (v0.7.0)

- [ ] Sentry (front + back)
- [ ] OpenTelemetry / Jaeger
- [ ] Logs estruturados (pino)
- [x] Auditoria de acessos e alterações — `features/audit`, `/auditoria` (restrito a `PERMISSIONS.AUDIT_READ`,
  hoje só ADMIN). Login/logout/tentativas falhas e CRUD de pacientes, atendimentos, usuários e tipos de
  exame geram evento (`recordAuditEvent`, `services/msw/handlers/audit.ts`). Filtros por ação/área/busca,
  exportação PDF/Excel. **Nota:** roda sobre o mesmo MSW mock das demais telas — quando o backend real da
  Etapa 3 existir, os eventos devem ser gravados no banco (append-only, sem edição/exclusão) para valerem
  como prova de auditoria de fato.
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
