/**
 * Password Reset Script
 * Resets a user's password in the database
 *
 * Usage: DATABASE_URL="..." npx tsx scripts/reset-password.ts <email> <new-password>
 */

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth/password';

const prisma = new PrismaClient();

async function resetPassword(email: string, newPassword: string) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    });

    console.log(`✅ Password reset successfully for: ${email}`);
    console.log('You can now sign in with your new password.');
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Usage: npx tsx scripts/reset-password.ts <email> <new-password>');
  console.error('Example: npx tsx scripts/reset-password.ts admin@scratchspace.dev "MyNewPassword123"');
  process.exit(1);
}

resetPassword(email, newPassword);
