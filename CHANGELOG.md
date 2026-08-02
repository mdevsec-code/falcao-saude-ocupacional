# CHANGELOG

Todas as mudanças notáveis neste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [Unreleased]

### ✨ Adicionado

- **Backend real** (`server/`, NestJS + Prisma + PostgreSQL) — auth JWT +
  bcrypt + rate limit, RBAC por perfil, auditoria persistida; CRUD completo
  de usuários, pacientes, atendimentos (com `dutyFitness` aninhado), agenda
  (com checagem de conflito de horário), tipos de exame, férias, desvios de
  segurança, indicadores de acidentes (NBR 14280) e cadastro manual de CID;
  leitura de atestados. Ver [`server/README.md`](server/README.md)
- **Módulo Férias** (`features/ferias`, `/ferias`) — controle de períodos de
  férias por colaborador
- **Módulo Segurança do Trabalho** (`features/seguranca`, `/seguranca`) —
  log de desvios de segurança (9 classificações) + indicadores mensais de
  acidentes com Taxa de Frequência/Gravidade/Índice Relativo calculados
  conforme NBR 14280
- **CID — cadastro manual** — complementa o catálogo curado estático com
  códigos adicionados pela própria equipe, categorias coloridas,
  copiar-código-com-um-clique
- **Guard de permissão por rota** (`RequirePermission`) — antes, uma
  permissão insuficiente só escondia o link da Sidebar; navegação direta
  pela URL contornava o controle de acesso
- Internacionalização completa em **3 idiomas** (pt-BR, en-US, zh-CN) em
  todos os módulos, incluindo mensagens de validação de formulário
  (antes hardcoded em português nos schemas Zod, independente do idioma
  ativo)
- Indicador de navegação ativo animado na Sidebar (Framer Motion,
  `layoutId` compartilhado), transições de página, entrada escalonada de
  linhas em todas as tabelas
- Correção de contraste no modo escuro para os tons "chip" da cor da marca

### 🔄 Modificado

- Fallback de senha de desenvolvimento no login restrito a build `DEV` —
  antes rodava em produção também, sem backend real conectado
- Animações de abrir/fechar do `Select`/`Tooltip`/`DropdownMenu` corrigidas
  (referenciavam um plugin Tailwind que não está instalado — não tinham
  nenhuma animação de fato)
- Sidebar reorganizada em categorias mais claras (Segurança do Trabalho,
  RH, Relatórios e Administração, antes tudo dentro de "Gestão")
- Dados de demonstração (KPIs do dashboard, fixtures de relatórios)
  zerados — a plataforma começa vazia por padrão

### ❌ Removido

- `atestados.json` — dump de 29 mil linhas de dados de exemplo, órfão e sem
  nenhuma referência no código

## [0.2.0] — Refatoração Enterprise

### ✨ Adicionado (Em refatoração enterprise)

- **Infraestrutura de build e tooling**
  - Scripts `test`, `test:ui`, `coverage`, `validate` no `package.json`
  - `vitest.config.ts` com jsdom, MSW, coverage thresholds (80%)
  - `eslint.config` endurecido (`react`, `jsx-a11y`, `consistent-type-imports`)
  - `prettier-plugin-tailwindcss` para ordenação automática de classes
  - `commitlint` + `husky` + `lint-staged` para Conventional Commits e pre-commit
  - `engines` fixando Node 20.11+ e npm 10+
- **Documentação**
  - `README.md` corporativo
  - `CONTRIBUTING.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`
  - `docs/architecture.md`, `docs/api.md`, `docs/deployment.md`, `docs/roadmap.md`,
    `docs/database.md`, `docs/decisions/0001-stack.md`
  - `docs/contributing/{branches,commits,pull-requests}.md`
- **GitHub**
  - Workflows de CI (`ci.yml`) e CodeQL (`codeql.yml`)
  - Templates de issue (bug, feature) e PR
  - `CODEOWNERS`, `labeler.yml`
- **Deploy**
  - `Dockerfile` multi-stage (Node 20 + Nginx 1.27)
  - `docker-compose.yml`
  - `vercel.json`, `netlify.toml`, `azure/staticwebapp.config.json`
  - PWA manifest + favicon SVG + robots.txt
- **Camada de serviços**
  - `services/http/client.ts` (Axios com interceptors e normalização de erros)
  - `services/http/errors.ts` (`ApiError`)
  - `services/http/types.ts` (`Paginated`, `ApiResult`, etc.)
  - `services/msw/handlers/{auth,dashboard}.ts` (mock de API)
  - `services/msw/{browser,server}.ts` + fixtures
- **Camada de domínio (features)**
  - `features/auth` (LoginPage com **React Hook Form + Zod**, `useAuth`, `Can`,
    `RequireAuth`, `authApi`, `authStore` refatorado)
  - `features/dashboard` (`DashboardPage` consumindo KPIs via React Query)
- **Internacionalização**
  - `i18n/index.ts` com `i18next` + `react-i18next` + detector
  - 5 namespaces PT-BR (`common`, `auth`, `dashboard`, `validation`, `errors`)
- **Infraestrutura de UI**
  - Componentes Radix: `Dialog`, `Tabs`, `Checkbox`, `Switch`, `Spinner`,
    `Label`, `Textarea`
  - Feedback: `EmptyState`, `ErrorState`, `LoadingState`, `NotFoundPage`,
    `PlaceholderPage`
  - `cn()` agora usa `tailwind-merge + clsx`
  - `Sonner` toaster com tema `system`
- **Validação**
  - Schemas Zod em `src/validators/{common,auth,index}.ts`
  - Login com `mode: 'onTouched'`
- **Tipos e utilitários**
  - `utils/{cn,format,assert,delay,id,result}.ts` expandidos
  - `config/{env,features,brand}.ts`
  - `types/env.d.ts` para `ImportMetaEnv`
- **Testes**
  - `vitest` + `@testing-library/react` + `MSW`
  - `test/setup.ts`, `test/render.tsx`, `test/mocks/*`
  - Testes unitários para `utils/`, `validators/`, `hooks/`
  - Render helper com `Providers` (I18n, QueryClient, Router, Tooltip)

### 🔄 Modificado

- Estrutura `src/` reorganizada para Clean Architecture / feature-first
- `cn()` agora resolve conflitos Tailwind
- `Sidebar` lê `enabled` e `requires` (RBAC) e usa i18n
- `Topbar` consome `useAuth`; logout chama `POST /auth/logout`
- `App` reescrito com `Providers` incluindo `I18nextProvider`, `MotionConfig`,
  `ReactQueryDevtools`
- `Router` com lazy loading por feature, `Suspense` com `LoadingState`,
  `RequireAuth` em todo o `AppShell`
- `main.tsx` boota i18n + MSW condicional antes do `createRoot`
- `tsconfig.app.json` com `noUncheckedIndexedAccess`, `noImplicitOverride` e
  paths para `@/features`, `@/services`, `@/lib`, `@/i18n`, `@/test`
- `vite.config.ts` com chunks por vendor e `preview` configurado

### ❌ Removido

- `src/stores/` (movido para `src/store/`)
- `src/modules/` (movido para `src/features/` e `src/components/common/`)

## [0.1.0] — Fundação inicial

### Adicionado

- Tokens visuais (paleta dourada + verde-petróleo) e CSS reset
- Design System primitivo (Button, Input, Card, Badge, Skeleton, Tooltip,
  Separator, Avatar)
- AppShell (Sidebar + Topbar), ThemeToggle (light/dark)
- Dashboard de boas-vindas com KPIs placeholder
- Login mockado (`admin@falcao.com / admin123`) com AuthStore Zustand
- RBAC constants (`roles.ts`, `permissions.ts`)
- Status constants para domínio de atendimento
- Logo SVG (variantes `mark` e `wordmark`)

[Unreleased]: https://github.com/mdevsec-code/falcao-saude-ocupacional/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/mdevsec-code/falcao-saude-ocupacional/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mdevsec-code/falcao-saude-ocupacional/releases/tag/v0.1.0
