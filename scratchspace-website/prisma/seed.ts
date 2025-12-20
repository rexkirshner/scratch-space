import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@scratchspace.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123456';

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
    return;
  }

  // Hash password with bcrypt (cost factor 12)
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);
  console.log(`   ID: ${admin.id}`);
  console.log(`   Role: ${admin.role}`);
  console.log('');
  console.log('⚠️  Make sure to change the password in production!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
