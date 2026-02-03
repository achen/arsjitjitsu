import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FRONT_HEADLOCK_SUBMISSIONS = [
  { name: 'Darce Choke', type: 'Submission', giType: 'nogi', description: 'Arm-in choke from front headlock position' },
  { name: 'Anaconda Choke', type: 'Submission', giType: 'nogi', description: 'Arm-in choke rolling to finish' },
  { name: 'Japanese Necktie', type: 'Submission', giType: 'nogi', description: 'Necktie choke from front headlock' },
  { name: 'Seated Kata Gatame', type: 'Submission', giType: 'nogi', description: 'Arm triangle from seated position' },
  { name: 'Power Guillotine', type: 'Submission', giType: 'nogi', description: 'High-pressure guillotine with clasped hands' },
  { name: 'High Wrist Guillotine', type: 'Submission', giType: 'nogi', description: 'Guillotine with high wrist grip on chin' },
  { name: '10 Finger Guillotine', type: 'Submission', giType: 'nogi', description: 'Guillotine with all fingers interlocked' },
];

async function main() {
  console.log('Adding Front Headlock submissions...\n');

  // Check if Front Headlock position exists
  const existing = await prisma.technique.findMany({
    where: { position: 'Front Headlock' },
  });
  
  console.log(`Found ${existing.length} existing Front Headlock techniques`);

  let created = 0;
  let skipped = 0;

  for (const sub of FRONT_HEADLOCK_SUBMISSIONS) {
    const exists = await prisma.technique.findFirst({
      where: {
        name: sub.name,
        position: 'Front Headlock',
      },
    });

    if (exists) {
      console.log(`  Skipped (exists): ${sub.name}`);
      skipped++;
    } else {
      await prisma.technique.create({
        data: {
          name: sub.name,
          position: 'Front Headlock',
          type: sub.type,
          giType: sub.giType,
          description: sub.description,
        },
      });
      console.log(`  Created: ${sub.name}`);
      created++;
    }
  }

  console.log(`\nDone! Created ${created}, skipped ${skipped}`);

  // Show all Front Headlock techniques now
  const all = await prisma.technique.findMany({
    where: { position: 'Front Headlock' },
    orderBy: { name: 'asc' },
  });
  console.log(`\nAll Front Headlock techniques (${all.length}):`);
  all.forEach(t => console.log(`  - ${t.name} (${t.type})`));

  await prisma.$disconnect();
}

main().catch(console.error);
