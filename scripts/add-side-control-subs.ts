import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TECHNIQUES = [
  { name: 'Goth Lock', type: 'Submission', description: 'Shoulder lock from side control bottom' },
  { name: 'Armbar', type: 'Submission', description: 'Armbar from side control bottom' },
  { name: 'Triangle', type: 'Submission', description: 'Triangle choke from side control bottom' },
  { name: 'Ghost Escape to Darce', type: 'Submission', description: 'Ghost escape leading to darce choke' },
  { name: 'Americana', type: 'Submission', description: 'Americana from side control bottom' },
];

async function main() {
  console.log('Adding Side Control Bottom submissions...\n');

  let created = 0;
  for (const tech of TECHNIQUES) {
    const exists = await prisma.technique.findFirst({
      where: { name: tech.name, position: 'Side Control Bottom' },
    });

    if (!exists) {
      await prisma.technique.create({
        data: {
          name: tech.name,
          position: 'Side Control Bottom',
          type: tech.type,
          giType: 'nogi',
          description: tech.description,
        },
      });
      console.log(`  Created: ${tech.name}`);
      created++;
    } else {
      console.log(`  Exists: ${tech.name}`);
    }
  }

  console.log(`\nDone! Created ${created} techniques`);
  await prisma.$disconnect();
}

main().catch(console.error);
