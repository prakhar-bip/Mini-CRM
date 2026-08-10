import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

const INITIAL_PASSWORD = 'Password@123';

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: Role.ADMIN,
  },
  {
    name: 'Sales User',
    email: 'sales@example.com',
    role: Role.SALES,
  },
  {
    name: 'Warehouse User',
    email: 'warehouse@example.com',
    role: Role.WAREHOUSE,
  },
  {
    name: 'Accounts User',
    email: 'accounts@example.com',
    role: Role.ACCOUNTS,
  },
];

async function main() {
  console.log('Seeding initial development users...');

  const passwordHash = await hashPassword(INITIAL_PASSWORD);

  for (const userData of seedUsers) {
    const normalizedEmail = userData.email.toLowerCase();

    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: userData.name,
        role: userData.role,
        passwordHash: passwordHash,
      },
      create: {
        name: userData.name,
        email: normalizedEmail,
        passwordHash: passwordHash,
        role: userData.role,
      },
    });

    console.log(`[Seed User]: ${user.name} (${user.email}) - Role: ${user.role}`);
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
