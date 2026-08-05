/**
 * Seed de produção: cria APENAS a conta administrativa inicial (bootstrap).
 * Nenhum paciente, atendimento, agendamento ou log de auditoria fake é
 * inserido — o sistema começa vazio, exatamente como um lançamento real.
 *
 * As credenciais vêm de variáveis de ambiente (nunca hardcoded) e o
 * administrador deve trocar a senha no primeiro acesso.
 *
 * Uso: `SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npm run seed`
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Catálogo padrão de tipos de exame — referência da área de saúde
 * ocupacional, não dado fictício de demonstração. Espelha
 * `src/services/msw/fixtures/exams.ts` do frontend.
 */
const DEFAULT_EXAM_TYPES = [
  {
    name: 'ASO Admissional',
    category: 'Admissional',
    defaultDurationMin: 30,
    periodicityMonths: null,
    active: true,
    description: 'Exame realizado antes do início das atividades do colaborador.',
  },
  {
    name: 'ASO Periódico',
    category: 'Periódico',
    defaultDurationMin: 30,
    periodicityMonths: 12,
    active: true,
    description: 'Reavaliação periódica de saúde ocupacional (NR-7).',
  },
  {
    name: 'ASO Demissional',
    category: 'Demissional',
    defaultDurationMin: 30,
    periodicityMonths: null,
    active: true,
    description: 'Exame realizado no desligamento do colaborador.',
  },
  {
    name: 'ASO Mudança de Função',
    category: 'Mudança de Função',
    defaultDurationMin: 30,
    periodicityMonths: null,
    active: true,
    description: 'Reavaliação por mudança de função ou de risco ocupacional.',
  },
  {
    name: 'Retorno ao Trabalho',
    category: 'Retorno ao Trabalho',
    defaultDurationMin: 30,
    periodicityMonths: null,
    active: true,
    description: 'Exame após afastamento por doença ou acidente.',
  },
  {
    name: 'Audiometria',
    category: 'Complementar',
    defaultDurationMin: 20,
    periodicityMonths: 12,
    active: true,
    description: 'Exame complementar para colaboradores expostos a ruído.',
  },
  {
    name: 'Acuidade Visual',
    category: 'Complementar',
    defaultDurationMin: 15,
    periodicityMonths: 12,
    active: true,
    description: 'Triagem visual complementar.',
  },
  {
    name: 'Espirometria',
    category: 'Complementar',
    defaultDurationMin: 20,
    periodicityMonths: 12,
    active: true,
    description: 'Exame complementar para colaboradores expostos a poeiras/agentes respiratórios.',
  },
];

async function seedExamTypes(): Promise<void> {
  for (const examType of DEFAULT_EXAM_TYPES) {
    const existing = await prisma.examType.findFirst({ where: { name: examType.name } });
    if (existing) continue;
    await prisma.examType.create({ data: examType });
  }
  // eslint-disable-next-line no-console
  console.log(`Catálogo de tipos de exame pronto (${DEFAULT_EXAM_TYPES.length} entradas).`);
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD antes de rodar o seed (ex.: no .env).',
    );
  }
  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD deve ter pelo menos 12 caracteres.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const normalizedEmail = email.trim().toLowerCase();

  const admin = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: {
      name: 'Administrador Falcão',
      email: normalizedEmail,
      passwordHash,
      role: 'ADMIN',
      status: 'active',
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Conta administrativa pronta: ${admin.email}`);

  await seedExamTypes();
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
