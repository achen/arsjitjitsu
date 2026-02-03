import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Normalizing giType values...');
  
  // Normalize all giType values to lowercase 'gi' or 'nogi'
  // 'Both', 'BOTH' -> 'nogi' (since both means can be done without gi)
  
  const bothToNogi = await prisma.technique.updateMany({
    where: { giType: { in: ['Both', 'BOTH', 'both'] } },
    data: { giType: 'nogi' }
  });
  console.log('  Updated BOTH/Both to nogi:', bothToNogi.count);
  
  const nogiNormalize = await prisma.technique.updateMany({
    where: { giType: 'NOGI' },
    data: { giType: 'nogi' }
  });
  console.log('  Updated NOGI to nogi:', nogiNormalize.count);
  
  const giNormalize = await prisma.technique.updateMany({
    where: { giType: 'GI' },
    data: { giType: 'gi' }
  });
  console.log('  Updated GI to gi:', giNormalize.count);
  
  // Verify
  const counts = await prisma.technique.groupBy({
    by: ['giType'],
    _count: true
  });
  console.log('\nFinal giType counts:');
  counts.forEach(c => console.log('  ' + c.giType + ': ' + c._count));
  
  await prisma.$disconnect();
}

main();
