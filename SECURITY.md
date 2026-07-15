# Segurança

A segurança da plataforma Falcão Saúde Ocupacional é levada a sério. Este
documento descreve como reportar vulnerabilidades e quais versões recebem
correções.

## Versões suportadas

| Versão | Suportada | Status                                         |
| ------ | --------- | ---------------------------------------------- |
| 0.2.x  | ✅ Sim    | Linha de release atual (Enterprise Foundation) |
| 0.1.x  | ⚠️ Não    | Fundação inicial — substituída por 0.2.x       |
| < 0.1  | ❌ Não    | Não há suporte                                 |

## Reportando uma vulnerabilidade

**Por favor, não reporte falhas de segurança via issue pública do GitHub.**

Envie um e-mail para [seguranca@falcao.com](mailto:seguranca@falcao.com) com:

1. Descrição técnica da vulnerabilidade
2. Passos para reproduzir (PoC)
3. Impacto potencial (LGPD, integridade, disponibilidade, confidencialidade)
4. Versão afetada e commit SHA, se conhecido
5. Suas informações de contato

Você receberá uma resposta de confirmação em até **3 dias úteis** e uma
análise inicial em até **10 dias úteis**.

## Política de divulgação coordenada

Seguimos o modelo de _coordinated disclosure_:

- Após a confirmação, trabalhamos em uma correção em conjunto.
- Solicitamos **90 dias** antes da divulgação pública para releases 0.x e
  **60 dias** para releases 1.0+.
- Forneceremos crédito ao pesquisador na release notes, salvo solicitação em
  contrário.

## Boas práticas de segurança aplicadas

- TypeScript strict + `noUncheckedIndexedAccess` ligados.
- Validação de todas as entradas via **Zod** (schemas em `src/validators/`).
- Cliente HTTP único (`src/services/http/`) com interceptors que normalizam
  erros e injetam token.
- Headers de segurança em todos os deploys (`X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`).
- LGPD: nenhuma PII é logada em produção.
- Auth via Bearer token (mock em dev; substituir por JWT/OAuth em prod).

## Lista de verificação para contribuidores

Antes de abrir um PR, confirme:

- [ ] Nenhum segredo (chave de API, senha) commitado.
- [ ] Inputs validados com Zod nos formulários.
- [ ] Logs de produção não expõem PII.
- [ ] `npm audit` revisado (nenhuma vulnerabilidade _high_ ou _critical_).
