# Contribuindo

Obrigado por contribuir com a **Falcão Saúde Ocupacional**! 🎉
Este documento cobre o fluxo de contribuição, padrões de código e revisão
de Pull Request.

## Fluxo de contribuição

1. Faça um **fork** (ou trabalhe em uma branch, se tiver acesso ao repo).
2. Crie uma branch seguindo o padrão de **Git Flow** (ver
   [`docs/contributing/branches.md`](docs/contributing/branches.md)):
   ```bash
   git checkout -b feature/nome-curto-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```
3. Faça commits seguindo **Conventional Commits** (ver
   [`docs/contributing/commits.md`](docs/contributing/commits.md)).
4. Antes de abrir o PR, rode localmente:
   ```bash
   npm run validate
   ```
5. Abra um **Pull Request** para a branch `develop` (ver
   [`docs/contributing/pull-requests.md`](docs/contributing/pull-requests.md)).
6. Aguarde revisão: ao menos **1 aprovação** é necessária.
7. Faça **squash merge** mantendo o título do PR no formato
   `Conventional Commits`.

## Padrões de código

- **TypeScript strict** é obrigatório. Evite `any` — use `unknown` + narrowing.
- **Valide entradas** com Zod em qualquer formulário ou fronteira de API.
- **Componentes** devem ser pequenos (< 300 linhas), com responsabilidade
  única. Prefira composição a herança.
- **Hook customizado** quando a lógica for reutilizada em 2+ componentes.
- **Imports**: use `import type` para tipos, ordene alfabeticamente dentro de
  cada grupo (`type` → `react` → externos → `@/` → relativos).
- **Sem `console.log`** esquecido — use `console.info`/`warn`/`error`.
- **Sem código comentado** — apague. O git guarda a história.

### Lint e formatação

- **ESLint** com `react`, `jsx-a11y`, `@typescript-eslint`, `react-hooks`.
- **Prettier** com `prettier-plugin-tailwindcss` (ordena classes).
- **Husky** roda `lint-staged` em `pre-commit` e `commitlint` em `commit-msg`.

```bash
npm run lint          # verifica
npm run lint:fix      # corrige automaticamente o que for possível
npm run format        # formata com Prettier
npm run format:check  # verifica formatação
```

## Testes

- Todo PR deve manter a cobertura **mínima de 80%** em `lib/`, `utils/`,
  `validators/`, `hooks/` e `services/http/`.
- Componentes com lógica de UI: 1 teste de smoke + 1 por interação crítica.
- Rodando:
  ```bash
  npm run test         # uma vez
  npm run test:watch   # watch mode
  npm run coverage     # relatório
  ```
- Estrutura:
  ```
  src/feature/__tests__/Component.test.tsx
  src/feature/__tests__/Component.integration.test.tsx
  ```

## Documentação

- Toda feature nova deve atualizar:
  - JSDoc nos componentes públicos e hooks.
  - `docs/api.md` quando introduzir/alterar endpoints.
  - `docs/architecture.md` quando introduzir nova camada ou padrão.
  - `CHANGELOG.md` em `Unreleased`.

## Reportando bugs e sugerindo features

Use os **templates** em [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/):

- Bug → `bug_report.md`
- Feature → `feature_request.md`

## Código de conduta

Este projeto segue o [Contributor Covenant 2.1](CODE_OF_CONDUCT.md).
Ao participar, você concorda em seguir seus termos.

## Dúvidas?

Abra uma issue com label `kind:question` ou entre em contato pelo
e-mail [contato@falcao.com](mailto:contato@falcao.com).
