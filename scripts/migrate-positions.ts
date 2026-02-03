import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migratePositions() {
  console.log('Migrating positions from techniques to Position table...\n');

  // Get all unique positions from techniques
  const techniques = await prisma.technique.findMany({
    select: { position: true },
    distinct: ['position'],
  });

  const positionNames = techniques.map(t => t.position).sort();
  console.log(`Found ${positionNames.length} unique positions:\n`);

  for (let i = 0; i < positionNames.length; i++) {
    const name = positionNames[i];
    
    // Check if position already exists
    const existing = await prisma.position.findUnique({
      where: { name },
    });

    if (existing) {
      console.log(`  ✓ ${name} (already exists)`);
    } else {
      await prisma.position.create({
        data: {
          name,
          sortOrder: i + 1,
        },
      });
      console.log(`  + ${name} (created)`);
    }
  }

  console.log('\n✅ Migration complete!');

  // Print summary
  const totalPositions = await prisma.position.count();
  console.log(`\nTotal positions in database: ${totalPositions}`);

  await prisma.$disconnect();
}

migratePositions().catch((error) => {
  console.error('Migration failed:', error);
  prisma.$disconnect();
  process.exit(1);
});
