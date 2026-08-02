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
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
