# Falcão Saúde Ocupacional — API

Backend real (NestJS + Prisma + PostgreSQL) que substitui o mock MSW do
frontend. Etapa 3 em andamento: **auth, usuários, pacientes, atendimentos,
agenda, tipos de exame, auditoria, férias, desvios de segurança, indicadores
de acidentes e cadastro manual de CID já têm controller + service + DTO
funcionando de ponta a ponta**, com build/typecheck passando (`npm run
build`). Falta ainda: ligar o frontend na API real (hoje ele continua
rodando no mock MSW até alguém trocar `VITE_ENABLE_MSW`/`VITE_API_URL`),
rodar a migration que cria as tabelas novas (`npm run prisma:migrate`),
escrever testes, e os itens de segurança listados no fim deste README.

## Por que este stack

- **NestJS**: TypeScript, estrutura modular com guards/decorators que mapeia
  bem para o RBAC que o frontend já define (`constants/roles.ts` e
  `constants/permissions.ts`).
- **PostgreSQL 16 + Prisma**: já era o plano documentado em
  `docs/database.md` do frontend; o `schema.prisma` aqui é a versão real
  dessa proposta, ajustado para bater exatamente com os tipos que o
  frontend já consome (`PatientRecord`, `AttendanceRecord`, etc.) — não
  precisa remodelar nenhuma tela para encaixar no backend.

## Rodando localmente

```bash
cp .env.example .env      # preencher DATABASE_URL, JWT_SECRET, etc.
docker compose up -d       # sobe um Postgres local (porta 5432)
npm install
npm run prisma:migrate     # cria as tabelas
SEED_ADMIN_EMAIL=admin@falcao.com SEED_ADMIN_PASSWORD="uma-senha-forte" npm run seed
npm run start:dev          # API em http://localhost:3000/api
```

Depois, no frontend, aponte `VITE_API_URL=http://localhost:3000/api` e
`VITE_ENABLE_MSW=false` no `.env.local` para conversar com a API real em
vez do mock.

## Endpoints disponíveis hoje

| Método | Rota               | Auth                                     | Descrição                                                       |
| ------ | ------------------ | ---------------------------------------- | --------------------------------------------------------------- |
| POST   | `/auth/login`      | —                                        | Login (rate-limited: 5/min por IP)                              |
| POST   | `/auth/logout`     | Bearer                                   | Logout (grava auditoria)                                        |
| GET    | `/auth/me`         | Bearer                                   | Usuário autenticado                                             |
| GET    | `/users`           | Bearer, ADMIN                            | Lista usuários                                                  |
| POST   | `/users`           | Bearer, ADMIN                            | Cria usuário                                                    |
| PATCH  | `/users/:id`       | Bearer, ADMIN                            | Atualiza usuário                                                |
| DELETE | `/users/:id`       | Bearer, ADMIN                            | Remove usuário                                                  |
| GET    | `/patients`        | Bearer                                   | Lista pacientes ativos (soft-deleted ocultos)                   |
| POST   | `/patients`        | Bearer, ADMIN/MEDICO/RECEPCAO            | Cria paciente (CPF único)                                       |
| PATCH  | `/patients/:id`    | Bearer, ADMIN/MEDICO/RECEPCAO            | Atualiza paciente                                               |
| DELETE | `/patients/:id`    | Bearer, ADMIN/MEDICO/RECEPCAO            | Soft delete (LGPD — `deletedAt`)                                |
| GET    | `/attendances`     | Bearer                                   | Lista atendimentos + `dutyFitness`                              |
| POST   | `/attendances`     | Bearer, ADMIN/MEDICO/ENFERMEIRO          | Cria atendimento (com `dutyFitness` aninhado)                   |
| PATCH  | `/attendances/:id` | Bearer, ADMIN/MEDICO/ENFERMEIRO          | Atualiza atendimento                                            |
| DELETE | `/attendances/:id` | Bearer, ADMIN/MEDICO                     | Remove atendimento                                              |
| GET    | `/agenda`          | Bearer                                   | Lista agendamentos                                              |
| POST   | `/agenda`          | Bearer, ADMIN/MEDICO/ENFERMEIRO/RECEPCAO | Cria agendamento (bloqueia conflito de horário do mesmo médico) |
| PATCH  | `/agenda/:id`      | Bearer, ADMIN/MEDICO/ENFERMEIRO/RECEPCAO | Atualiza agendamento (revalida conflito)                        |
| DELETE | `/agenda/:id`      | Bearer, ADMIN/MEDICO/ENFERMEIRO/RECEPCAO | Remove agendamento                                              |
| GET    | `/exam-types`      | Bearer                                   | Lista catálogo de exames                                        |
| POST   | `/exam-types`      | Bearer, ADMIN/ENFERMEIRO                 | Cria tipo de exame                                              |
| PATCH  | `/exam-types/:id`  | Bearer, ADMIN/ENFERMEIRO                 | Atualiza tipo de exame                                          |
| DELETE | `/exam-types/:id`  | Bearer, ADMIN                            | Remove tipo de exame                                            |
| GET    | `/atestados`       | Bearer                                   | Lista atestados                                                 |
| POST   | `/atestados`       | Bearer, ADMIN/RH/RECEPCAO                | Registra atestado                                               |
| PATCH  | `/atestados/:id`   | Bearer, ADMIN/RH/RECEPCAO                | Atualiza atestado                                               |
| DELETE | `/atestados/:id`   | Bearer, ADMIN/RH/RECEPCAO                | Remove atestado                                                 |
| GET    | `/audit`           | Bearer, ADMIN                            | Trilha de auditoria (últimos 500 eventos)                       |
| GET    | `/health`          | —                                        | Healthcheck (app + banco)                                       |
| GET    | `/ferias`          | Bearer                                   | Lista períodos de férias                                        |
| POST   | `/ferias`          | Bearer, ADMIN/RH                         | Cria período de férias                                          |
| PATCH  | `/ferias/:id`      | Bearer, ADMIN/RH                         | Atualiza período de férias                                      |
| DELETE | `/ferias/:id`      | Bearer, ADMIN/RH                         | Remove período de férias                                        |
| GET    | `/desvios`         | Bearer                                   | Lista desvios de segurança                                      |
| POST   | `/desvios`         | Bearer, ADMIN/TECNICO_SEGURANCA          | Cria desvio de segurança                                        |
| PATCH  | `/desvios/:id`     | Bearer, ADMIN/TECNICO_SEGURANCA          | Atualiza desvio de segurança                                    |
| DELETE | `/desvios/:id`     | Bearer, ADMIN/TECNICO_SEGURANCA          | Remove desvio de segurança                                      |
| GET    | `/indicadores`     | Bearer                                   | Lista indicadores mensais de acidentes                          |
| POST   | `/indicadores`     | Bearer, ADMIN/TECNICO_SEGURANCA          | Cria lançamento mensal (único por ano+mês)                      |
| PATCH  | `/indicadores/:id` | Bearer, ADMIN/TECNICO_SEGURANCA          | Atualiza lançamento mensal                                      |
| DELETE | `/indicadores/:id` | Bearer, ADMIN/TECNICO_SEGURANCA          | Remove lançamento mensal                                        |
| GET    | `/cid`             | Bearer                                   | Lista códigos CID cadastrados manualmente                       |
| POST   | `/cid`             | Bearer                                   | Cadastra código CID (complementa o catálogo curado do frontend) |
| PATCH  | `/cid/:id`         | Bearer                                   | Atualiza código CID cadastrado manualmente                      |
| DELETE | `/cid/:id`         | Bearer                                   | Remove código CID cadastrado manualmente                        |

Todas as mutações (`patients`, `attendances`, `agenda`, `exam-types`,
`users`) gravam um evento em `AuditLog` via `AuditService.record()` — mesmo
formato de evento que o `recordAuditEvent` do mock do frontend usa, só que
persistido de verdade e consultável em `/audit`.

**Simplificação assumida**: os guards de `@Roles(...)` usam uma lista
enxuta de perfis por endpoint, não a matriz completa e granular de
`constants/permissions.ts` do frontend (que tem permissões mais finas como
`PATIENT_WRITE` vs `EMPLOYEE_WRITE` para o mesmo registro). Se essa
granularidade for necessária, o próximo passo é portar `PERMISSIONS`/
`ROLE_PERMISSIONS` para cá e trocar `@Roles(role...)` por um
`@RequirePermission(permission)` equivalente.

## Deploy

### Opção rápida (lançamento inicial): Railway

1. Crie um projeto no [Railway](https://railway.app), adicione um serviço
   Postgres (um clique) e um serviço "Deploy from GitHub repo" a partir
   deste repositório, com **Root Directory = `server`** (Settings do
   serviço). Railway detecta o `Dockerfile` deste diretório automaticamente
   — não precisa configurar build/start command manualmente.
2. Configure as variáveis de ambiente do serviço: `DATABASE_URL` (referencie
   a variável do serviço Postgres via `${{Postgres.DATABASE_URL}}`),
   `JWT_SECRET` (gere com `openssl rand -base64 48`), `CORS_ORIGIN` (domínio
   do frontend na Vercel, ex.: `https://falcao-saude.vercel.app`).
3. O próprio `CMD` do `Dockerfile` roda `prisma db push` antes de subir o
   servidor — sincroniza o schema no banco automaticamente a cada deploy
   (ainda não há histórico de migrations neste projeto; `db push` é o
   caminho recomendado pela Prisma até a primeira migration ser gerada).
4. Depois do primeiro deploy, rode o seed uma única vez (aba "Shell" do
   serviço no Railway, ou local apontando para o `DATABASE_URL` de
   produção): `SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npm run seed`.

Custo aproximado: US$5–20/mês para o volume desta aplicação. Bom para
validar o lançamento rápido.

### Opção com residência de dados no Brasil: Azure

Como o frontend já usa Azure Static Web Apps (`azure/staticwebapp.config.json`),
dá para consolidar tudo num único provedor/conta, na região **Brazil South**:

1. **Azure Database for PostgreSQL – Flexible Server** (região Brazil South).
2. **Azure Container Apps** (ou App Service para containers) rodando a
   imagem gerada pelo `Dockerfile` deste diretório.
3. Depois de configurar o backend real, atualizar o `Content-Security-Policy`
   em `azure/staticwebapp.config.json` (`connect-src`) para liberar o
   domínio da API — isso já está anotado em `docs/deployment.md` do
   frontend como pendência.

Recomendação: comece pelo Railway para validar o lançamento; migre para
Azure Brazil South quando o volume/exigência de residência de dados
justificar o custo/operação adicional.

## Segurança — o que já está aqui vs. o que falta

Feito: senhas com bcrypt (custo 12), JWT com expiração de 8h, rate limit
no login, `helmet`, CORS restrito por env var, validação de entrada
(`class-validator` com `whitelist`/`forbidNonWhitelisted`), auditoria de
login/logout/CRUD de usuários.

Ainda falta (antes de ir para produção com dados reais de saúde):
refresh tokens, bloqueio de conta após N tentativas falhas, fluxo de
redefinição de senha, 2FA para ADMIN, backup automatizado do Postgres,
TLS entre API e banco, e os testes de carga mencionados em
`docs/database.md`.
