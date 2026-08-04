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

| Método | Rota                       | Auth                                     | Descrição                                                           |
| ------ | -------------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| POST   | `/auth/login`              | —                                        | Login (rate-limited: 5/min por IP)                                  |
| POST   | `/auth/logout`             | Bearer                                   | Logout (grava auditoria)                                            |
| GET    | `/auth/me`                 | Bearer                                   | Usuário autenticado                                                 |
| GET    | `/auth/microsoft`          | —                                        | Redireciona para o login da Microsoft (SSO, opcional)               |
| GET    | `/auth/microsoft/callback` | —                                        | Callback do SSO — troca `code` por sessão e redireciona ao frontend |
| GET    | `/users`                   | Bearer, ADMIN                            | Lista usuários                                                      |
| POST   | `/users`                   | Bearer, ADMIN                            | Cria usuário                                                        |
| PATCH  | `/users/:id`               | Bearer, ADMIN                            | Atualiza usuário                                                    |
| DELETE | `/users/:id`               | Bearer, ADMIN                            | Remove usuário                                                      |
| GET    | `/patients`                | Bearer                                   | Lista pacientes ativos (soft-deleted ocultos)                       |
| POST   | `/patients`                | Bearer, ADMIN/MEDICO/RECEPCAO            | Cria paciente (CPF único)                                           |
| PATCH  | `/patients/:id`            | Bearer, ADMIN/MEDICO/RECEPCAO            | Atualiza paciente                                                   |
| DELETE | `/patients/:id`            | Bearer, ADMIN/MEDICO/RECEPCAO            | Soft delete (LGPD — `deletedAt`)                                    |
| GET    | `/attendances`             | Bearer                                   | Lista atendimentos + `dutyFitness`                                  |
| POST   | `/attendances`             | Bearer, ADMIN/MEDICO/ENFERMEIRO          | Cria atendimento (com `dutyFitness` aninhado)                       |
| PATCH  | `/attendances/:id`         | Bearer, ADMIN/MEDICO/ENFERMEIRO          | Atualiza atendimento                                                |
| DELETE | `/attendances/:id`         | Bearer, ADMIN/MEDICO                     | Remove atendimento                                                  |
| GET    | `/agenda`                  | Bearer                                   | Lista agendamentos                                                  |
| POST   | `/agenda`                  | Bearer, ADMIN/MEDICO/ENFERMEIRO/RECEPCAO | Cria agendamento (bloqueia conflito de horário do mesmo médico)     |
| PATCH  | `/agenda/:id`              | Bearer, ADMIN/MEDICO/ENFERMEIRO/RECEPCAO | Atualiza agendamento (revalida conflito)                            |
| DELETE | `/agenda/:id`              | Bearer, ADMIN/MEDICO/ENFERMEIRO/RECEPCAO | Remove agendamento                                                  |
| GET    | `/exam-types`              | Bearer                                   | Lista catálogo de exames                                            |
| POST   | `/exam-types`              | Bearer, ADMIN/ENFERMEIRO                 | Cria tipo de exame                                                  |
| PATCH  | `/exam-types/:id`          | Bearer, ADMIN/ENFERMEIRO                 | Atualiza tipo de exame                                              |
| DELETE | `/exam-types/:id`          | Bearer, ADMIN                            | Remove tipo de exame                                                |
| GET    | `/atestados`               | Bearer                                   | Lista atestados                                                     |
| POST   | `/atestados`               | Bearer, ADMIN/RH/RECEPCAO                | Registra atestado                                                   |
| PATCH  | `/atestados/:id`           | Bearer, ADMIN/RH/RECEPCAO                | Atualiza atestado                                                   |
| DELETE | `/atestados/:id`           | Bearer, ADMIN/RH/RECEPCAO                | Remove atestado                                                     |
| GET    | `/audit`                   | Bearer, ADMIN                            | Trilha de auditoria (últimos 500 eventos)                           |
| GET    | `/health`                  | —                                        | Healthcheck (app + banco)                                           |
| GET    | `/ferias`                  | Bearer                                   | Lista períodos de férias                                            |
| POST   | `/ferias`                  | Bearer, ADMIN/RH                         | Cria período de férias                                              |
| PATCH  | `/ferias/:id`              | Bearer, ADMIN/RH                         | Atualiza período de férias                                          |
| DELETE | `/ferias/:id`              | Bearer, ADMIN/RH                         | Remove período de férias                                            |
| GET    | `/desvios`                 | Bearer                                   | Lista desvios de segurança                                          |
| POST   | `/desvios`                 | Bearer, ADMIN/TECNICO_SEGURANCA          | Cria desvio de segurança                                            |
| PATCH  | `/desvios/:id`             | Bearer, ADMIN/TECNICO_SEGURANCA          | Atualiza desvio de segurança                                        |
| DELETE | `/desvios/:id`             | Bearer, ADMIN/TECNICO_SEGURANCA          | Remove desvio de segurança                                          |
| GET    | `/indicadores`             | Bearer                                   | Lista indicadores mensais de acidentes                              |
| POST   | `/indicadores`             | Bearer, ADMIN/TECNICO_SEGURANCA          | Cria lançamento mensal (único por ano+mês)                          |
| PATCH  | `/indicadores/:id`         | Bearer, ADMIN/TECNICO_SEGURANCA          | Atualiza lançamento mensal                                          |
| DELETE | `/indicadores/:id`         | Bearer, ADMIN/TECNICO_SEGURANCA          | Remove lançamento mensal                                            |
| GET    | `/cid`                     | Bearer                                   | Lista códigos CID cadastrados manualmente                           |
| POST   | `/cid`                     | Bearer                                   | Cadastra código CID (complementa o catálogo curado do frontend)     |
| PATCH  | `/cid/:id`                 | Bearer                                   | Atualiza código CID cadastrado manualmente                          |
| DELETE | `/cid/:id`                 | Bearer                                   | Remove código CID cadastrado manualmente                            |
| GET    | `/dashboard/kpis`          | Bearer                                   | KPIs do início (consultas hoje, aguardando, atendimentos, pendências) |

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

### Opção gratuita (teste/demonstração antes da aprovação de pagamento): Render + Neon

Zero custo, sem cartão de crédito. Bom para validar com a diretoria antes de
migrar para uma opção paga (Railway ou Azure, abaixo). Duas contas
separadas: **Neon** para o Postgres, **Render** para a API.

1. **Banco (Neon)**: crie uma conta grátis em [neon.tech](https://neon.tech)
   → **New Project** (região mais próxima, ex.: `sa-east-1` se disponível).
   Neon já cria o banco `neondb` e mostra a **connection string** pronta na
   tela do projeto (formato
   `postgresql://usuario:senha@ep-algo.sa-east-1.aws.neon.tech/neondb?sslmode=require`).
   Copie essa string — diferente do Railway, ela é **pública** (funciona de
   qualquer lugar, sem distinção interna/externa), então não tem o problema
   de hostname `.internal` que tivemos com o Railway.
2. **API (Render)**: no [Render](https://render.com), **New** →
   **Blueprint** → conecte este repositório. O Render lê o `render.yaml` da
   raiz automaticamente e já propõe o serviço `falcao-api` (plano free,
   builda o `server/Dockerfile`).
3. Ao criar, o Render pede para preencher as variáveis marcadas como
   "secret" no blueprint:
   - `DATABASE_URL`: cole a connection string do Neon (passo 1).
   - `JWT_SECRET`: deixe em branco — o Render gera um valor aleatório
     sozinho (`generateValue: true` no blueprint).
   - `CORS_ORIGIN`: preencha depois de criar o projeto na Vercel (passo
     seguinte do fluxo de deploy do frontend), ex.:
     `https://falcao-saude.vercel.app`. Pode deixar em branco por enquanto
     e editar depois em Settings → Environment do serviço no Render.
   - `FRONTEND_URL`, `SEED_ADMIN_*`, `AZURE_AD_*`: opcionais, só necessários
     se for usar login com Microsoft — pode deixar em branco por ora.
4. O `CMD` do `Dockerfile` já roda `prisma db push` antes de subir o
   servidor, então o schema é sincronizado automaticamente no primeiro
   deploy — não precisa rodar migration manualmente.
5. Depois do primeiro deploy, rode o seed **local**, apontando para o Neon
   (não precisa de Shell remoto, já que a connection string do Neon
   funciona da sua máquina):
   ```
   set DATABASE_URL=postgresql://usuario:senha@ep-algo.sa-east-1.aws.neon.tech/neondb?sslmode=require
   set SEED_ADMIN_EMAIL=admin@falcao.com
   set SEED_ADMIN_PASSWORD=umaSenhaForteAqui123
   npm run seed
   ```

**Limitações do plano free do Render**: o serviço "dorme" após ~15 min sem
receber requisições e demora uns 30–50s para acordar na primeira chamada
seguinte — perceptível na demonstração se ninguém acessar por um tempo, mas
sem impacto nos dados. Sem esse problema no Neon (o Postgres free não
dorme). Quando o pagamento for aprovado, migrar para o Railway (opção
abaixo) é só trocar `DATABASE_URL` e reapontar o `VITE_API_URL` do
frontend — nenhuma mudança de código.

### Opção paga (após aprovação): Railway

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
   serviço no Railway, ou local apontando para a connection string
   **pública** do Postgres — Settings → Networking/TCP Proxy do serviço
   Postgres, ou variável `DATABASE_PUBLIC_URL` se existir):
   `SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npm run seed`.

Custo aproximado: US$5–20/mês para o volume desta aplicação. Bom para
depois que o lançamento for aprovado e precisar rodar sem o serviço
dormindo.

### Login único com Microsoft (SSO / Azure AD) — opcional

Permite que quem já tem conta na Microsoft/Entra ID da empresa entre pelo
botão "Entrar com Microsoft" na tela de login, sem senha separada. **Não
cria contas automaticamente** — só funciona para e-mails já cadastrados em
Usuários (o RH/Admin cadastra a pessoa primeiro, com o perfil certo; depois
disso ela pode entrar tanto por senha quanto pela Microsoft).

1. No [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** →
   **App registrations** → **New registration**.
   - Nome: `Falcão Saúde Ocupacional`.
   - Supported account types: **Single tenant** (só contas desta empresa).
   - Redirect URI: tipo **Web**, valor
     `https://<domínio da API no Railway>/api/auth/microsoft/callback`.
2. Anote o **Application (client) ID** e o **Directory (tenant) ID** da
   página "Overview" do app registrado.
3. **Certificates & secrets** → **New client secret** → anote o _valor_
   gerado (some da tela depois — se perder, precisa criar outro).
4. **API permissions** → confirme que `openid`, `profile` e `email`
   (Microsoft Graph, delegated) estão presentes — geralmente já vêm por
   padrão.
5. No Railway, preencha as variáveis do serviço backend:
   `AZURE_AD_TENANT_ID`, `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`,
   `AZURE_AD_REDIRECT_URI` (igual ao Redirect URI do passo 1) e
   `FRONTEND_URL` (a URL da Vercel).

Sem essas variáveis configuradas, o botão de login por senha continua
funcionando normalmente — o SSO é aditivo, não substitui nada.

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
