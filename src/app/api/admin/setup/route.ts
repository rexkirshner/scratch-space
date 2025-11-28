/**
 * Admin Setup Endpoint
 * One-time initialization for production database
 *
 * Usage: GET /api/admin/setup?secret=YOUR_NEXTAUTH_SECRET
 * Optional: &email=admin@example.com&password=yourpassword
 *
 * @module app/api/admin/setup
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';

export async function GET(request: NextRequest) {
  try {
    // 1. Verify secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (!secret || secret !== process.env.NEXTAUTH_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid secret' },
        { status: 401 }
      );
    }

    // 2. Check if already initialized
    try {
      const userCount = await prisma.user.count();
      if (userCount > 0) {
        return NextResponse.json({
          message: 'Database already initialized',
          users: userCount,
          projects: await prisma.project.count(),
        });
      }
    } catch (_error) {
      // Tables don't exist yet, continue with setup
    }

    // 3. Run migration SQL
    const migrationSQL = `
      -- CreateEnum
      CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

      -- CreateEnum
      CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

      -- CreateTable
      CREATE TABLE "users" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "passwordHash" TEXT NOT NULL,
          "name" TEXT,
          "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,

          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );

      -- CreateTable
      CREATE TABLE "projects" (
          "id" TEXT NOT NULL,
          "name" VARCHAR(100) NOT NULL,
          "url" TEXT NOT NULL,
          "description" VARCHAR(500) NOT NULL,
          "githubUrl" TEXT,
          "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
          "order" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,

          CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
      );

      -- CreateIndex
      CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

      -- CreateIndex
      CREATE INDEX "projects_visibility_order_idx" ON "projects"("visibility", "order");
    `;

    await prisma.$executeRawUnsafe(migrationSQL);

    // 4. Create admin user
    const adminEmail = searchParams.get('email') || 'admin@scratchspace.dev';
    const adminPassword = searchParams.get('password') || 'ChangeThisPassword123!';
    const passwordHash = await hashPassword(adminPassword);

    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    // 5. Seed projects
    await prisma.project.createMany({
      data: [
        {
          name: 'Input Atlas',
          url: 'https://www.inputatlas.com/',
          description:
            'A curated collection of high-quality AI prompts for the community, released under CC0 public domain licensing.',
          githubUrl: 'https://github.com/rexkirshner/input-atlas',
          visibility: 'PUBLIC',
          order: 0,
        },
        {
          name: 'AI Context System',
          url: 'https://acs.rexkirshner.com/',
          description:
            'Enables developers to externalize AI reasoning and maintain perfect session continuity across work sessions.',
          githubUrl: 'https://github.com/rexkirshner/ai-context-system',
          visibility: 'PUBLIC',
          order: 1,
        },
        {
          name: 'Podcast Framework',
          url: 'https://podcast-framework.rexkirshner.com/',
          description:
            'Open-source web framework combining Astro, TypeScript, Sanity CMS, and Tailwind CSS to help creators build production-ready podcast websites.',
          githubUrl: 'https://github.com/rexkirshner/podcast-framework',
          visibility: 'PUBLIC',
          order: 2,
        },
        {
          name: 'Inevitable Ethereum',
          url: 'https://inevitableeth.com/',
          description:
            'Educational platform dedicated to explaining Ethereum as the World Computer and exploring its role in decentralized systems.',
          githubUrl: 'https://github.com/rexkirshner/inevitable-ethereum',
          visibility: 'PUBLIC',
          order: 3,
        },
        {
          name: 'National Charity League, Los Angeles',
          url: 'https://ncl.scratchspace.dev/',
          description:
            'Fostering mother-daughter relationships through philanthropy and community service since 1925.',
          visibility: 'PRIVATE',
          order: 4,
        },
      ],
    });

    // 6. Create Prisma migration tracking table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "checksum" TEXT NOT NULL,
        "finished_at" TIMESTAMP(3),
        "migration_name" TEXT NOT NULL,
        "logs" TEXT,
        "rolled_back_at" TIMESTAMP(3),
        "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0
      );
    `);

    await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations"
        (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
      VALUES
        ('setup-via-api', '${Date.now()}', CURRENT_TIMESTAMP, '20251127_init', NULL, NULL, CURRENT_TIMESTAMP, 1);
    `);

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      admin: {
        email: adminEmail,
        password: adminPassword === 'ChangeThisPassword123!'
          ? 'ChangeThisPassword123! (CHANGE THIS IMMEDIATELY!)'
          : '****** (saved)',
      },
      projects: 5,
      nextSteps: [
        '1. Visit https://scratch-space.vercel.app to see your site',
        '2. Login at https://scratch-space.vercel.app/auth/signin',
        `3. Email: ${adminEmail}`,
        '4. IMPORTANT: Change your password immediately in the admin dashboard',
      ],
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        error: 'Setup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check that DATABASE_URL is configured correctly in Vercel',
      },
      { status: 500 }
    );
  }
}
