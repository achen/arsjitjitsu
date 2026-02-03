import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Video data with position, technique name, title, instructor, gi type, and URL
const videoData = [
  { position: '50/50', technique: 'Back Step Escape', title: 'How to Escape 50/50 in the Gi: Back Take & Armbar Combo', instructor: 'Bernardo Faria', giType: 'gi', url: 'https://www.youtube.com/watch?v=eaLsA0VSKw0' },
  { position: '50/50', technique: 'Back Step Escape', title: 'Easiest Way To Escape From 50/50 Guard No Gi', instructor: 'Giancarlo Bodoni', giType: 'nogi', url: 'https://www.youtube.com/watch?v=hfN0YGfyQz8' },
  { position: '50/50', technique: 'Calf Slicer', title: 'Calf Slice Attack From 50/50', instructor: 'André Galvão', giType: 'gi', url: 'https://www.youtube.com/watch?v=QGadZ0Wo2tk' },
  { position: '50/50', technique: 'Calf Slicer', title: 'Leg Lock Wednesday: Calf Slicer from 50/50 (No-Gi)', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=I4A3oh6zM2o' },
  { position: '50/50', technique: 'Calf Slicer', title: 'Calf Slicer from the 50/50 Guard', instructor: 'BJJ Fanatics', giType: 'both', url: 'https://www.youtube.com/watch?v=LR8jDCsuO5s' },
  { position: '50/50', technique: 'Heel Hook', title: 'Heel hook from 50/50', instructor: 'Lachlan Giles', giType: 'nogi', url: 'https://www.youtube.com/watch?v=aHQozQc-feU' },
  { position: '50/50', technique: 'Heel Hook', title: 'Heel Hooks from Standing 50/50 by Jason Rau', instructor: 'Jason Rau', giType: 'nogi', url: 'https://www.youtube.com/watch?v=w38-RTEXf7U' },
  { position: '50/50', technique: 'Heel Hook', title: 'Exposing The Heel From 50/50', instructor: 'Craig Jones', giType: 'nogi', url: 'https://www.youtube.com/watch?v=EHbqx2k7vxc' },
  { position: '50/50', technique: 'Kneebar', title: 'Outside Spin to Backside 50/50 Kneebar by Jason Rau', instructor: 'Jason Rau', giType: 'nogi', url: 'https://www.youtube.com/watch?v=3UeIW_aCpyY' },
  { position: '50/50', technique: 'Kneebar', title: 'No-Gi: Direct Knee Bar Attack off 50/50', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=C5k_-ZZmjYM' },
  { position: '50/50', technique: 'Kneebar', title: 'Felipe Pena Shows His Knee Bar From 50/50', instructor: 'Felipe "Preguiça" Pena', giType: 'both', url: 'https://www.youtube.com/watch?v=UK1CmF1FKg4' },
  { position: '50/50', technique: 'Sweep', title: '50/50 Sweep and Pass', instructor: 'BJJ Fanatics', giType: 'both', url: 'https://www.youtube.com/watch?v=RLrcQwNX0iU' },
  { position: '50/50', technique: 'Sweep', title: 'Get The 50/50 Position – Take The Sweep Into A Footlock!', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=mZQIwfcr-vU' },
  { position: '50/50', technique: 'Sweep', title: '50/50 Sweep to Inside Heel Hook', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=meWmGRWd_Ow' },
  { position: '50/50', technique: 'Toe Hold', title: 'Great Leg Attack Sequence From 50/50 (Toe Hold & Knee Bar)', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=MbQ5f8rQiTM' },
  { position: '50/50', technique: 'Toe Hold', title: 'Gable Grip Toe Hold From 50/50', instructor: 'BJJ Fanatics', giType: 'both', url: 'https://www.youtube.com/watch?v=IraJfVGL3g0' },
  { position: '50/50', technique: 'Toe Hold', title: 'Toe Hold From 50/50 Guard – Osvaldo "Queixinho" Moizinho', instructor: 'Osvaldo "Queixinho" Moizinho', giType: 'gi', url: 'https://www.youtube.com/watch?v=TeCAYQ-bB0E' },
  { position: 'Back Control', technique: 'Arm Trap', title: 'The Arm Trap – Advanced Back Attacks', instructor: 'John Danaher', giType: 'both', url: 'https://www.youtube.com/watch?v=Y0GJLYn8YUQ' },
  { position: 'Back Control', technique: 'Arm Trap', title: 'Arm Trap from the Back', instructor: 'Jean Jacques Machado', giType: 'both', url: 'https://www.youtube.com/watch?v=TACufy5oDKU' },
  { position: 'Back Control', technique: 'Arm Trap', title: 'Back Attacks 3: How to Trap the Arm', instructor: 'BJJ Fanatics', giType: 'both', url: 'https://www.youtube.com/watch?v=SxkWJI2DZ-o' },
  { position: 'Back Control', technique: 'Armbar from Back', title: 'BACK CONTROL: Principles, Arm Traps and Short Chokes!', instructor: 'John Danaher', giType: 'nogi', url: 'https://www.youtube.com/watch?v=JleGIo7t5QU' },
  { position: 'Back Control', technique: 'Body Triangle', title: 'How to Escape Back Body Triangle', instructor: 'Giancarlo Bodoni', giType: 'nogi', url: 'https://www.youtube.com/watch?v=i0x5QOmDp8A' },
  { position: 'Back Control', technique: 'Body Triangle', title: 'Advanced Back Control: Arm Traps, Body Triangles and Short Chokes', instructor: 'John Danaher', giType: 'both', url: 'https://www.youtube.com/watch?v=PNeuHQzMPXc' },
  { position: 'Back Control', technique: 'Bow and Arrow Choke', title: 'Bow & Arrow Choke from Back Control', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=X5JIZ_gscPI' },
  { position: 'Back Control', technique: 'Bow and Arrow Choke', title: 'How To Do The Bow And Arrow Choke', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=Q7R71XB3dig' },
];

async function seedVideos() {
  console.log('🎬 Seeding technique videos...\n');
  
  // Clear existing videos first
  const deleted = await prisma.techniqueVideo.deleteMany();
  console.log(`🗑️  Cleared ${deleted.count} existing videos\n`);
  
  let totalAdded = 0;
  const notFound: string[] = [];

  for (const video of videoData) {
    // Determine which technique(s) to link to based on video's giType
    const giTypes = video.giType === 'both' ? ['gi', 'nogi'] : [video.giType];
    
    for (const giType of giTypes) {
      // Find the technique in the database
      const technique = await prisma.technique.findFirst({
        where: {
          name: video.technique,
          position: video.position,
          giType: giType,
        }
      });

      if (!technique) {
        const key = `${video.position} - ${video.technique} (${giType})`;
        if (!notFound.includes(key)) {
          notFound.push(key);
        }
        continue;
      }

      // Add the video
      await prisma.techniqueVideo.create({
        data: {
          techniqueId: technique.id,
          title: video.title,
          url: video.url,
          instructor: video.instructor,
          duration: null,
        }
      });

      console.log(`  ✅ Added: ${video.position} - ${video.technique} (${giType}) - ${video.instructor}`);
      totalAdded++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  ✅ Videos added: ${totalAdded}`);
  
  if (notFound.length > 0) {
    console.log('\n⚠️  Techniques not found in database:');
    notFound.forEach(t => console.log(`    - ${t}`));
  }
}

seedVideos()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
