/**
 * Seed sample projects for testing
 * Run with: npm run db:seed-projects
 */

import { prisma } from '../src/lib/db/prisma';

async function main() {
  console.log('🌱 Seeding sample projects...');

  // Delete existing projects
  await prisma.project.deleteMany();
  console.log('   Deleted existing projects');

  // Create sample projects
  const projects = await prisma.project.createMany({
    data: [
      {
        name: 'AI Context System',
        url: 'https://github.com/rexkirshner/ai-context-system',
        description:
          'A comprehensive documentation system for AI-assisted development with session continuity and context preservation.',
        githubUrl: 'https://github.com/rexkirshner/ai-context-system',
        visibility: 'PUBLIC',
        order: 0,
      },
      {
        name: 'Experimental Chat Interface',
        url: 'https://chat.scratchspace.dev',
        description:
          'Testing new conversation patterns and UI interactions for AI chat applications.',
        githubUrl: 'https://github.com/rexkirshner/experimental-chat',
        visibility: 'PUBLIC',
        order: 1,
      },
      {
        name: 'Next.js Playground',
        url: 'https://playground.scratchspace.dev',
        description:
          'Exploring Next.js 15 features including Server Actions, Parallel Routes, and the new App Router patterns.',
        visibility: 'PUBLIC',
        order: 2,
      },
      {
        name: 'Internal Tool Prototype',
        url: 'https://internal.scratchspace.dev',
        description:
          'Private testing ground for new workflow automation tools.',
        visibility: 'PRIVATE',
        order: 3,
      },
    ],
  });

  console.log(`✅ Created ${projects.count} sample projects`);
  console.log('   - 3 PUBLIC projects');
  console.log('   - 1 PRIVATE project');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding projects:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
