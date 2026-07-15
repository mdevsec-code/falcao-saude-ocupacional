# Git Flow — Branches

Adotamos o modelo **Git Flow** simplificado, focado em Continuous Delivery.

## Branches principais

| Branch | Vida útil | Proteção | Descrição |
|---|---|---|---|
| `main` | permanente | 🔒 protegida, 1+ aprovação, CI verde | Release de produção |
| `develop` | permanente | 🔒 protegida, 1+ aprovação, CI verde | Integração contínua |

## Branches de trabalho

| Prefixo | Origem | Destino | Descrição |
|---|---|---|---|
| `feature/*` | `develop` | `develop` | Nova funcionalidade |
| `bugfix/*` | `develop` | `develop` | Correção de bug não-crítico |
| `hotfix/*` | `main` | `main` e `develop` | Correção urgente em produção |
| `release/*` | `develop` | `main` e `develop` | Preparação de release (version bump, CHANGELOG) |
| `chore/*` | `develop` | `develop` | Tarefas não-funcionais (deps, CI, refactor) |
| `docs/*` | `develop` | `develop` | Apenas documentação |

## Convenções de nome

```
<prefixo>/<escopo-curto>-<descrição-curta-em-kebab-case>
```

Exemplos válidos:
- `feature/auth-oauth`
- `feature/agenda-fullcalendar`
- `bugfix/login-typo-email`
- `hotfix/security-cve-2024-1234`
- `release/v0.3.0`
- `chore/bump-deps`
- `docs/api-endpoints`

## Workflow

### Feature comum

```bash
# 1. Sincronize
git checkout develop
git pull origin develop

# 2. Crie a branch
git checkout -b feature/agenda-fullcalendar

# 3. Desenvolva + commits (Conventional Commits)
git commit -m "feat(agenda): integrate FullCalendar with view switcher"
git commit -m "test(agenda): add tests for AppointmentForm"

# 4. Push + PR
git push -u origin feature/agenda-fullcalendar
# Abrir PR contra develop
```

### Hotfix (produção)

```bash
# 1. Parta de main
git checkout main
git pull origin main
git checkout -b hotfix/security-cve-2024-1234

# 2. Corrija
git commit -m "fix(security): patch CVE-2024-1234 in axios"

# 3. PR contra main (e cherry-pick para develop)
# 4. Merge via "Squash and merge" no GitHub
# 5. Tag bumpada automaticamente (se configurado)
```

### Release

```bash
# 1. Parta de develop
git checkout develop
git pull origin develop
git checkout -b release/v0.3.0

# 2. Bump versão, CHANGELOG, etc.
npm version minor  # 0.2.0 -> 0.3.0
# atualiza CHANGELOG, fecha milestones

# 3. PR contra main
# 4. Após merge em main, tag + cherry-pick para develop
git checkout main
git pull
git tag v0.3.0
git push origin v0.3.0
```

## Proteções recomendadas no GitHub

Em **Settings → Branches → Branch protection rules**:

### `main`
- ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - `lint`, `typecheck`, `test`, `build`
- ✅ Require linear history
- ✅ Include administrators
- ❌ Allow force pushes
- ❌ Allow deletions

### `develop`
- ✅ Require a pull request before merging
- ✅ Require approvals: **1**
- ✅ Require status checks to pass before merging
  - `lint`, `typecheck`, `test`
- ❌ Allow force pushes
- ❌ Allow deletions

## Squash merge

Para manter o histórico de `main` e `develop` limpo, **todos os PRs são
merged via Squash and merge**. O título do commit segue o título do PR
(que deve estar em Conventional Commits).

## Referências

- [Conventional Commits](commits.md)
- [Pull Requests](pull-requests.md)
- [Vincent Driessen — Git Flow original](https://nvie.com/posts/a-successful-git-branching-model/)
- [Atlassian — Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
