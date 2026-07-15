# ADR-0001: Stack tecnológico

| | |
|---|---|
| **Status** | Aceito |
| **Data** | 2026-01-15 |
| **Decisor(es)** | Tech Lead |
| **Contexto** | Etapa 2 — Refatoração Enterprise |

## Contexto

O projeto iniciou (v0.1.0) com uma base funcional — login mockado, dashboard
e design system primitivo — porém sem padronização de stack. A Etapa 2 visa
elevar o patamar de engenharia para um nível enterprise, mantendo o
comportamento de produto.

A escolha do stack impacta diretamente:

- Produtividade do time
- Onboarding de novos contribuidores
- Custo de manutenção a longo prazo
- Performance percebida
- Acessibilidade

## Decisão

Adotamos a stack abaixo, baseada em **padrões da indústria** e em nosso
princípio de **menor surpresa**.

### Build & Linguagem

- **TypeScript 5.6** em modo **strict** + `noUncheckedIndexedAccess`.
  - **Por quê?** Segurança de tipo em tempo de compilação, autocomplete
    rico, refatoração segura.
  - **Alternativas**: JavaScript (rejeitada), Flow (rejeitada — descontinuada).
- **Vite 5** como bundler.
  - **Por quê?** Dev server rápido, ESM nativo, build otimizado com Rollup.
  - **Alternativas**: Webpack (rejeitada — mais lento), Next.js (rejeitada —
    escopo de SSR não justificado).

### UI

- **React 18**.
  - **Por quê?** Ecossistema maduro, Concurrent Rendering, ampla comunidade.
  - **Alternativas**: Vue (rejeitada), Svelte (rejeitada — curva de
    contratação).
- **Tailwind CSS 3** com **CSS Variables** para tokens.
  - **Por quê?** Produtividade, consistência visual, sem CSS-in-JS runtime.
  - **Alternativas**: CSS Modules (rejeitada — boilerplate), styled-components
    (rejeitada — runtime cost), Emotion (rejeitada).
- **Radix UI Primitives** + **lucide-react**.
  - **Por quê?** Acessibilidade AA de fábrica, estilo 100% nosso via
    Tailwind.
  - **Alternativas**: Material UI (rejeitada — opinião visual), Chakra
    (rejeitada — bundle size), Ant Design (rejeitada — opinião).
- **Framer Motion**.
  - **Por quê?** Animações performáticas com `prefers-reduced-motion`.
  - **Alternativas**: React Spring (rejeitada — API menos ergonômica).

### Roteamento

- **React Router v6** com `createBrowserRouter` + lazy routes.
  - **Por quê?** Padrão da indústria, data router, code splitting trivial.
  - **Alternativas**: TanStack Router (rejeitada — ainda em beta), Next.js
    (rejeitada).

### Estado

- **TanStack Query 5** para estado servidor.
  - **Por quê?** Cache, retry, devtools, padrão da indústria.
  - **Alternativas**: SWR (rejeitada — menos features), Apollo (rejeitada
    — escopo GraphQL não justificado).
- **Zustand 4** com `persist` para estado cliente.
  - **Por quê?** API mínima, sem boilerplate, persist trivial.
  - **Alternativas**: Redux Toolkit (rejeitada — verbosa), Jotai (rejeitada
    — modelo atômico não necessário), Context (rejeitada — re-renders).

### Formulários e validação

- **React Hook Form 7** + **Zod 3** + `@hookform/resolvers`.
  - **Por quê?** Performance (sem re-render), validação compartilhável
    cliente/servidor, tipagem derivada.
  - **Alternativas**: Formik (rejeitada — performance), Yup (rejeitada —
    Zod é mais TS-friendly).

### HTTP e Mock

- **Axios 1** com interceptors.
  - **Por quê?** Interceptors poderosos, normalização de erros, ampla
    compatibilidade.
  - **Alternativas**: `fetch` (rejeitada — sem interceptors), `ky` (rejeitada
    — menos popular).
- **MSW 2** para dev e testes.
  - **Por quê?** Mock realista a nível de rede, sem mockar o módulo HTTP.
  - **Alternativas**: json-server (rejeitada — limitado), Mirage (rejeitada
    — descontinuada).

### i18n

- **i18next 23** + **react-i18next 15** + detector.
  - **Por quê?** Padrão da indústria, namespaces, detecção automática.
  - **Alternativas**: react-intl (rejeitada — API mais complexa),
    FormatJS (rejeitada).

### Testes

- **Vitest 2** + **@testing-library/react 16** + **jsdom** + **MSW Node**.
  - **Por quê?** Velocidade (esbuild), compatibilidade com Vite, API Jest-like.
  - **Alternativas**: Jest (rejeitada — config mais lenta), Playwright
    (complementar, para E2E — Etapa 4+).

### Lint / Format / Commits

- **ESLint 8** (flat config futuro) com plugins `react`, `react-hooks`,
  `jsx-a11y`, `consistent-type-imports`.
- **Prettier 3** + `prettier-plugin-tailwindcss`.
- **Husky 9** + **lint-staged 15** + **commitlint 19**.

### CI / CD

- **GitHub Actions** (CI + CodeQL).

### Deploy

- **Vercel** (preferencial), **Netlify**, **Azure Static Web Apps**,
  **Docker + Nginx**.

## Consequências

### Positivas

- Stack **bem documentada** e amplamente adotada (onboarding rápido).
- **Acessibilidade AA** garantida por Radix + jsx-a11y.
- **Bundle otimizado** via manual chunks (vendor splitting).
- **Cobertura ≥ 80%** garantida por thresholds do Vitest.
- **Tipagem forte** ponta a ponta (DTOs do backend em Zod no front).

### Negativas

- **Vendor lock-in leve** com Radix (mitigado: primitives, não design system
  completo).
- **MSW** adiciona complexidade no boot (mitigado: opcional em prod).
- **Múltiplos caminhos para a mesma coisa** (Zustand store vs Context) —
  exigimos convenção (stores globais em `src/store/`, stores de feature em
  `src/features/<x>/stores/`).

## Considerações LGPD / Segurança

- Nenhuma PII em logs de produção.
- Token em `localStorage` (chave `falcao-auth`) com TTL explícito.
- Interceptor Axios limpa sessão em 401.
- Headers de segurança em todos os deploys.
- Validação Zod em **toda** entrada de formulário.

## Referências

- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TanStack Query](https://tanstack.com/query)
- [MSW](https://mswjs.io/)
- [Zod](https://zod.dev/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)

## Revisões

- **2026-01-15** — Aceito para a Etapa 2.
