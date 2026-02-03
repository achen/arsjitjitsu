import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const techniques = await prisma.technique.findMany({
    orderBy: [{ position: 'asc' }, { type: 'asc' }, { name: 'asc' }]
  });
  
  let output = 'BJJ Techniques List\n';
  output += '='.repeat(50) + '\n\n';
  output += `Total: ${techniques.length} techniques\n\n`;
  
  let currentPosition = '';
  for (const t of techniques) {
    if (t.position !== currentPosition) {
      currentPosition = t.position;
      output += '\n' + '='.repeat(50) + '\n';
      output += currentPosition.toUpperCase() + '\n';
      output += '='.repeat(50) + '\n';
    }
    output += `- ${t.name} (${t.type}) [${t.giType}]\n`;
    if (t.description) output += `  ${t.description}\n`;
  }
  
  fs.writeFileSync('techniques.txt', output);
  console.log(`Saved ${techniques.length} techniques to techniques.txt`);
  await prisma.$disconnect();
}

main();
