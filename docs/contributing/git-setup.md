# Git Setup — Comandos pós-refatoração

> ⚠️ Esta refatoração (Etapa 2 — v0.2.0-enterprise-foundation) ainda não
> foi commitada como release final. O histórico do Git é gerenciado fora
> desta sessão. Este documento lista os comandos que devem ser executados
> pelo mantenedor **uma vez** para consolidar a release.

## Pré-condições

- Git CLI instalado (`git --version` ≥ 2.40).
- Acesso ao remote (`origin`) com permissão de push e criação de branches.
- Working tree limpo.

## Procedimento

### 1. Renomear `master` para `main` (se aplicável)

```bash
# Garantir que está em master/main
git branch --show-current

# Se for "master":
git branch -m master main

# Push da nova main
git push -u origin main

# No GitHub: Settings → Branches → Default branch → "main"
# Depois:
git push origin --delete master
```

### 2. Criar `develop` a partir de `main`

```bash
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

No GitHub: **Settings → Branches → Branch protection rules → Add rule**
para `develop` (e `main`):

- `main`:
  - Require a pull request before merging
  - Require approvals: 1
  - Require status checks: `lint`, `typecheck`, `test`, `build`
  - Require linear history
  - Do not allow force pushes
  - Do not allow deletions
  - Include administrators

- `develop`:
  - Require a pull request before merging
  - Require approvals: 1
  - Require status checks: `lint`, `typecheck`, `test`
  - Do not allow force pushes
  - Do not allow deletions

### 3. Habilitar workflows do GitHub

1. Vá em **Actions → New workflow → set up a workflow yourself** (criar
   `.github/workflows/` se ainda não estiver).
2. Os workflows já estão versionados em
   [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) e
   [`.github/workflows/codeql.yml`](../../.github/workflows/codeql.yml).
3. Em **Settings → Code security and analysis**, ative:
   - Dependabot alerts
   - Dependabot security updates
   - Code scanning (CodeQL)

### 4. Tag a release v0.2.0

```bash
git checkout main
git pull origin main
git tag -a v0.2.0-enterprise-foundation -m "Release v0.2.0: Enterprise Foundation"
git push origin v0.2.0-enterprise-foundation
```

No GitHub: **Releases → Draft a new release → Choose tag → v0.2.0-…**,
título `v0.2.0 — Enterprise Foundation`, copie a seção `[Unreleased]`
do `CHANGELOG.md`.

### 5. Configurar Husky (primeira vez)

```bash
npm install
npm run prepare
# Isso cria .husky/_/ e garante que os hooks estão ativos
```

Verifique:

```bash
ls -la .husky/
# Deve mostrar: pre-commit, commit-msg, _/

git config core.hooksPath
# Deve mostrar: .husky
```

### 6. Inicializar MSW

```bash
npm run msw:init
# Isso cria public/mockServiceWorker.js
```

### 7. Configurar variáveis de ambiente (opcional)

```bash
cp .env.example .env.local
# Edite VITE_API_URL, VITE_ENABLE_MSW=true, etc.
```

### 8. Validar localmente

```bash
npm run validate
# Deve passar: typecheck, lint, format:check, test, build
```

## Pós-release

- Crie o **milestone** v0.3.0 (próximo release).
- Mova issues que serão endereçadas para o milestone.
- Anuncie no canal interno (Slack/Teams/email).

## Solução de problemas

### Husky não executa no Windows

```bash
git config core.hooksPath .husky
npx husky install
```

### `npm run validate` falha em `format:check`

```bash
npm run format  # formata tudo
git add -A
git commit --amend --no-edit
```

### `noUncheckedIndexedAccess` quebra código

Aplique `Array.from(...)`, `as const`, ou narrowing explícito.
Exemplos:

```ts
// Antes (agora unsafe):
const first = arr[0];

// Depois (safe):
const [first] = arr;
if (!first) throw new Error('empty');
```

## Referências

- [Conventional Commits](commits.md)
- [Branches (Git Flow)](branches.md)
- [Husky](https://typicode.github.io/husky/)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
