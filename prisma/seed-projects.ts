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
    ],
  });

  console.log(`✅ Created ${projects.count} sample projects`);
  console.log('   - 4 PUBLIC projects');
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
