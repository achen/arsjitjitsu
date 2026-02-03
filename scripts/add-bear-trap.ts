import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BEAR_TRAP_TECHNIQUES = [
  { name: 'Inside Heel Hook', type: 'Submission', description: 'Inside heel hook from bear trap' },
  { name: 'Outside Heel Hook', type: 'Submission', description: 'Outside heel hook from bear trap' },
  { name: 'Toe Hold', type: 'Submission', description: 'Toe hold from bear trap position' },
  { name: 'Kneebar', type: 'Submission', description: 'Kneebar from bear trap' },
  { name: 'Calf Slicer', type: 'Submission', description: 'Calf slicer from bear trap' },
  { name: 'Aoki Lock', type: 'Submission', description: 'Aoki lock calf crush from bear trap' },
  { name: 'Bear Trap Sweep', type: 'Sweep', description: 'Sweep from bear trap to top position' },
  { name: 'Back Take', type: 'Transition', description: 'Transition to back control from bear trap' },
];

async function main() {
  console.log('Creating Bear Trap position...\n');

  let created = 0;

  for (const tech of BEAR_TRAP_TECHNIQUES) {
    const exists = await prisma.technique.findFirst({
      where: { name: tech.name, position: 'Bear Trap' },
    });

    if (!exists) {
      await prisma.technique.create({
        data: {
          name: tech.name,
          position: 'Bear Trap',
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

  // Add transition from 50/50 to Bear Trap
  const trans = await prisma.technique.findFirst({
    where: { name: 'Bear Trap Entry', position: '50/50' },
  });

  if (!trans) {
    await prisma.technique.create({
      data: {
        name: 'Bear Trap Entry',
        position: '50/50',
        type: 'Transition',
        giType: 'nogi',
        description: 'Transition from 50/50 to bear trap position',
      },
    });
    console.log('  Created: Bear Trap Entry (in 50/50 position)');
    created++;
  } else {
    console.log('  Exists: Bear Trap Entry (in 50/50 position)');
  }

  console.log(`\nDone! Created ${created} techniques`);

  // Show all Bear Trap techniques
  const all = await prisma.technique.findMany({
    where: { position: 'Bear Trap' },
    orderBy: { name: 'asc' },
  });
  console.log(`\nBear Trap techniques (${all.length}):`);
  all.forEach((t) => console.log(`  - ${t.name} (${t.type})`));

  await prisma.$disconnect();
}

main().catch(console.error);
