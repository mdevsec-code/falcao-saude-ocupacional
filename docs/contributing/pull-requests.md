# Pull Requests

Pull Requests são o coração da colaboração neste projeto. Este guia cobre
o processo completo: da abertura até o merge.

## TL;DR

1. Branch a partir de `develop` (ou `main` para `hotfix/*`).
2. Commits em **Conventional Commits**.
3. Rode `npm run validate` localmente — **tudo verde**.
4. Abra o PR usando o **template** `.github/PULL_REQUEST_TEMPLATE.md`.
5. Garanta que o CI está verde.
6. Aguarde **1 aprovação** + resolução de comentários.
7. **Squash and merge** mantendo o título do PR.

## Antes de abrir o PR

### Checklist do autor

- [ ] A branch está atualizada com a base (`develop` ou `main`):
  ```bash
  git fetch origin
  git rebase origin/develop
  ```
- [ ] `npm run validate` retorna 0 em todos os jobs.
- [ ] Testes novos cobrem o que foi adicionado/corrigido.
- [ ] `CHANGELOG.md` foi atualizado em `Unreleased` (se aplicável).
- [ ] `docs/` foi atualizado (API, arquitetura, decisões).
- [ ] Não há `console.log`, código comentado, ou `any` desnecessário.
- [ ] Screenshots/GIFs anexados para mudanças visuais.

## Abrindo o PR

### Título

Use o **título do PR como mensagem de commit** (será o commit do squash
merge). Formato:

```
<tipo>(<escopo>): <descrição>
```

Exemplos:
- `feat(login): add remember-me checkbox`
- `fix(dashboard): correct kpi delta calculation`

### Descrição

Use o template (`.github/PULL_REQUEST_TEMPLATE.md`). Preencha **todos**
os campos relevantes.

### Labels

Aplique labels do [`labeler.yml`](../../.github/labeler.yml) (são sugeridas
automaticamente conforme os paths alterados) e adicione labels manuais
quando necessário:

- `kind:bug`, `kind:feature`, `kind:refactor`, `kind:chore`
- `area:ui`, `area:auth`, `area:dashboard`, `area:infra`, `area:docs`
- `priority:high`, `priority:medium`, `priority:low`
- `breaking-change` (se aplicável)

### Draft PR

Para trabalhos em andamento, abra como **Draft**. Ele não será revisado
até que você marque como "Ready for review".

```markdown
<!-- markdownlint-disable -->
## 🚧 Status: WIP
```

## Revisão

### Para o autor

- **Responda a todos os comentários** (resolve a thread ou justifica).
- **Não force-push** após a primeira revisão (use `git push --force-with-lease`
  apenas se necessário e avise o revisor).
- **Mantenha o PR pequeno**: < **400 linhas** de diff idealmente. PRs grandes
  devem ser quebrados.

### Para o revisor

- **Seja respeitoso e construtivo** (veja [Code of Conduct](../../CODE_OF_CONDUCT.md)).
- **Aprove explicitamente** com o botão "Approve" — comentários sem aprovação
  não contam.
- **Bloqueie** com "Request changes" se houver impedimentos reais (segurança,
  bug, quebra de contrato).
- **Foque em**:
  - Correção: faz o que se propõe?
  - Testes: cobre casos de borda?
  - Design: segue a arquitetura?
  - Acessibilidade: navegável por teclado, ARIA correto?
  - i18n: strings em PT-BR via `t(...)`, não hardcoded?
  - Performance: sem re-renders desnecessários, sem bundles inflados?

### SLA

- PRs de **bug** ou **hotfix**: revisão em **1 dia útil**.
- PRs de **feature**: revisão em **2 dias úteis**.
- PRs de **docs/chore**: revisão em **3 dias úteis**.

## Merge

### Quando pode mergear

- ✅ CI verde (lint, typecheck, test, build).
- ✅ 1+ aprovação.
- ✅ Todas as threads resolvidas.
- ✅ Branch atualizada com a base.
- ✅ (Opcional) screenshots de antes/depois anexados.

### Como mergear

**Sempre via Squash and merge** (mantém o histórico limpo e garante
1 commit por feature).

Depois do merge:

1. Confirme que o commit aparece em `develop` (ou `main`).
2. Delete a branch do remote (botão no GitHub).
3. Se for release, siga o fluxo de [`branches.md`](branches.md#release).

## Pós-merge

- **CHANGELOG** revisado antes do release.
- **Tag** criada em releases (v0.X.0).
- **Milestone** fechado.
- **Issue** relacionada fechada (com `Closes #N` ou `Fixes #N` no PR).
- **Comunicado** no canal interno (Slack/Teams) com screenshots.

## Anti-padrões

🚫 **Não faça**:

- Merge de PR próprio sem aprovação (em `main`/`develop`).
- Force-push após revisão sem aviso.
- Squash de PRs grandes — divida antes.
- Misturar `feat` com `fix` no mesmo PR.
- Ignorar comentários do revisor.
- Fazer merge com CI vermelho.
- Adicionar `WIP` ou `Draft` no título do PR (use o botão "Convert to draft").

## Templates

- **PR**: [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md)
- **Issue Bug**: [`.github/ISSUE_TEMPLATE/bug_report.md`](../../.github/ISSUE_TEMPLATE/bug_report.md)
- **Issue Feature**: [`.github/ISSUE_TEMPLATE/feature_request.md`](../../.github/ISSUE_TEMPLATE/feature_request.md)

## Referências

- [GitHub — About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
- [Conventional Commits](commits.md)
- [Branches](branches.md)
