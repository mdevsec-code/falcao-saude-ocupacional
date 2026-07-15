# Conventional Commits

Todas as mensagens de commit devem seguir o padrão
**[Conventional Commits 1.0.0](https://www.conventionalcommits.org/pt-br/)**.

O formato é:

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé(s) opcional(is)]
```

## Tipos

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat` | Nova funcionalidade para o usuário | `feat(login): add remember-me checkbox` |
| `fix` | Correção de bug | `fix(dashboard): kpi tile flicker on first load` |
| `docs` | Apenas documentação | `docs(readme): add Docker section` |
| `style` | Formatação, sem mudança lógica (espaços, vírgulas) | `style(button): reorder Tailwind classes` |
| `refactor` | Mudança de código que não corrige bug nem adiciona feature | `refactor(auth): extract useSignIn hook` |
| `perf` | Mudança que melhora performance | `perf(dashboard): memoize kpi tiles` |
| `test` | Adiciona/corrige testes | `test(login): cover invalid email case` |
| `build` | Mudança em build, CI, dependências | `build(deps): bump axios to 1.7.7` |
| `ci` | Mudança em workflows/scripts de CI | `ci: add CodeQL weekly schedule` |
| `chore` | Tarefas não-funcionais (eslint, prettier) | `chore: enable consistent-type-imports` |
| `revert` | Reverte um commit anterior | `revert: feat(login): add remember-me` |

## Regras

1. **Descrição** em **minúsculas**, sem ponto final, ≤ 72 caracteres
   na primeira linha.
2. **Corpo** (opcional) separado por linha em branco, explica o **quê**
   e o **porquê**, max ~100 caracteres por linha.
3. **Rodapé** (opcional):
   - `BREAKING CHANGE: <descrição>` — para mudanças incompatíveis.
   - `Refs: #123` — referência a issue.
   - `Co-authored-by: Nome <email>` — para pair programming.
4. **Escopo** é a área afetada (`login`, `dashboard`, `deps`, `ci`, etc.).
   Use **plural** apenas se for convenção da área.

## Exemplos

### Simples

```
feat: add dark mode toggle
```

```
fix: prevent dashboard crash on empty kpis
```

### Com escopo

```
feat(login): add remember-me checkbox
```

```
fix(dashboard): kpi tile flicker on first load
```

### Com corpo

```
fix(login): validate email format on submit

Previously, the form submitted even with malformed emails, leading
to a 400 from the API. We now validate with Zod's email schema
and show a localized error.
```

### Com BREAKING CHANGE

```
feat(auth): switch from sessionStorage to httpOnly cookies

BREAKING CHANGE: API responses must set Set-Cookie; client no longer
reads from sessionStorage. Update authStore accordingly.
```

### Com referência a issue

```
fix(dashboard): correct trend delta calculation

Refs: #42
```

## Validação local

O `commitlint` é executado pelo hook `commit-msg` (Husky). Se a mensagem
não seguir o padrão, o commit é **abortado** com mensagem de erro.

Você também pode validar manualmente:

```bash
npx commitlint --from=HEAD~1 --to=HEAD --verbose
```

## Boas práticas

- **1 commit por mudança lógica** (não misture refactor com feature).
- **Commits pequenos e frequentes** são mais fáceis de revisar e reverter.
- **Não** coloque emojis ou co-author na primeira linha.
- **Não** use tempos verbais no imperativo (use "add", não "added").
- **Não** termine com ponto.

## Ferramentas úteis

- [commitlint.io](https://commitlint.io/) — validador online.
- [Conventional Commits Cheatsheet](https://cheatography.com/kevinchtsang/cheat-sheets/conventional-commits/).
- Extensão VSCode: **Conventional Commits** (vivaxy.vscode-conventional-commits).

## Referências

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/pt-br/)
- [Branches](branches.md)
- [Pull Requests](pull-requests.md)
