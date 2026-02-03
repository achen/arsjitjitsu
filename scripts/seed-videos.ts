import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Video data with position, technique name, and videos tagged by gi type
const videoData = [
  {
    position: '50/50',
    technique: 'Back Step Escape',
    videos: [
      { url: 'https://www.youtube.com/watch?v=eaLsA0VSKw0', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=hfN0YGfyQz8', giType: 'nogi' },
    ]
  },
  {
    position: '50/50',
    technique: 'Calf Slicer',
    videos: [
      { url: 'https://www.youtube.com/watch?v=QGadZ0Wo2tk', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=I4A3oh6zM2o', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=LR8jDCsuO5s', giType: 'both' },
    ]
  },
  {
    position: '50/50',
    technique: 'Heel Hook',
    videos: [
      { url: 'https://www.youtube.com/watch?v=aHQozQc-feU', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=w38-RTEXf7U', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=EHbqx2k7vxc', giType: 'nogi' },
    ]
  },
  {
    position: '50/50',
    technique: 'Kneebar',
    videos: [
      { url: 'https://www.youtube.com/watch?v=3UeIW_aCpyY', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=C5k_-ZZmjYM', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=UK1CmF1FKg4', giType: 'both' },
    ]
  },
  {
    position: '50/50',
    technique: 'Sweep',
    videos: [
      { url: 'https://www.youtube.com/watch?v=RLrcQwNX0iU', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=mZQIwfcr-vU', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=meWmGRWd_Ow', giType: 'nogi' },
    ]
  },
  {
    position: '50/50',
    technique: 'Toe Hold',
    videos: [
      { url: 'https://www.youtube.com/watch?v=MbQ5f8rQiTM', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=IraJfVGL3g0', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=TeCAYQ-bB0E', giType: 'gi' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Arm Trap',
    videos: [
      { url: 'https://www.youtube.com/watch?v=Y0GJLYn8YUQ', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=TACufy5oDKU', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=SxkWJI2DZ-o', giType: 'both' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Armbar from Back',
    videos: [
      { url: 'https://www.youtube.com/watch?v=eaLsA0VSKw0', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=JleGIo7t5QU', giType: 'nogi' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Body Triangle',
    videos: [
      { url: 'https://www.youtube.com/watch?v=i0x5QOmDp8A', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=PNeuHQzMPXc', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=RscLPT0F-DE', giType: 'nogi' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Bow and Arrow Choke',
    videos: [
      { url: 'https://www.youtube.com/watch?v=X5JIZ_gscPI', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=Q7R71XB3dig', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=_CAPhaAMm1U', giType: 'gi' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Collar Choke',
    videos: [
      { url: 'https://www.youtube.com/watch?v=okqrGs8VMpg', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=DhAona29x2M', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=VhOxuQqwkxo', giType: 'gi' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Maintaining Back Control',
    videos: [
      { url: 'https://www.youtube.com/watch?v=JleGIo7t5QU', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=nxg23NfAdC4', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=PNeuHQzMPXc', giType: 'both' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Rear Naked Choke',
    videos: [
      { url: 'https://www.youtube.com/watch?v=NJf5FmH6P1A', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=OiQiRNgA1y4', giType: 'nogi' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Seatbelt Control',
    videos: [
      { url: 'https://www.youtube.com/watch?v=baSqWCtLysU', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=KqcK1ZZGa5M', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=NJf5FmH6P1A', giType: 'both' },
    ]
  },
  {
    position: 'Back Control',
    technique: 'Short Choke',
    videos: [
      { url: 'https://www.youtube.com/watch?v=-CfNBxO8__Q', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=ld80o7n_DFU', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=AKF007D6xrQ', giType: 'both' },
    ]
  },
  {
    position: 'Back Defense',
    technique: 'Back to Wall',
    videos: [
      { url: 'https://www.youtube.com/watch?v=N6lKNqUOZoY', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=V_U1IHL2iGQ', giType: 'both' },
    ]
  },
  {
    position: 'Back Defense',
    technique: 'Hand Fighting',
    videos: [
      { url: 'https://www.youtube.com/watch?v=OiQiRNgA1y4', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=6s-F3U-NbaQ', giType: 'both' },
    ]
  },
  {
    position: 'Back Defense',
    technique: 'Heel Pry',
    videos: [
      { url: 'https://www.youtube.com/watch?v=3Fp_tjFSPwY', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=0ubZ65hvM2M', giType: 'both' },
    ]
  },
  {
    position: 'Back Defense',
    technique: 'Hip Escape to Guard',
    videos: [
      { url: 'https://www.youtube.com/watch?v=woCl1q2drWo', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=V_U1IHL2iGQ', giType: 'both' },
    ]
  },
  {
    position: 'Back Defense',
    technique: 'Shoulder Walk Escape',
    videos: [
      { url: 'https://www.youtube.com/watch?v=u9N6Bb155n0', giType: 'gi' },
      { url: 'https://www.youtube.com/watch?v=n3riQuUg8eI', giType: 'both' },
    ]
  },
  {
    position: 'Butterfly Guard',
    technique: 'Arm Drag',
    videos: [
      { url: 'https://www.youtube.com/watch?v=oTN0xEhm528', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=7LKwMOdFyVs', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=sgwt7hDci3g', giType: 'both' },
    ]
  },
  {
    position: 'Butterfly Guard',
    technique: 'Butterfly Sweep',
    videos: [
      { url: 'https://www.youtube.com/watch?v=9XULQjZeOEU', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=lgoHshT3crw', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=9M0XeJN9dX4', giType: 'nogi' },
    ]
  },
  {
    position: 'Butterfly Guard',
    technique: 'Guillotine',
    videos: [
      { url: 'https://www.youtube.com/watch?v=SAWvSovVk4A', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=dGt1fvfjosk', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=qLR66ZwIKEU', giType: 'both' },
    ]
  },
  {
    position: 'Butterfly Guard',
    technique: 'Hook Sweep',
    videos: [
      { url: 'https://www.youtube.com/watch?v=xYLRhiYJegg', giType: 'both' },
      { url: 'https://www.youtube.com/watch?v=0Vs_Yih_hg8', giType: 'nogi' },
      { url: 'https://www.youtube.com/watch?v=OB4IY8MGWHM', giType: 'both' },
    ]
  },
  {
    position: 'Butterfly Guard',
    technique: 'Single Leg X Entry',
    videos: [
      { url: 'https://www.youtube.com/watch?v=hRCQV_tATXA', giType: 'both' },
    ]
  },
];

// Extract video ID from YouTube URL for title
function getVideoId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : 'Unknown';
}

async function seedVideos() {
  console.log('🎬 Seeding technique videos...\n');
  
  let totalAdded = 0;
  let totalSkipped = 0;
  const notFound: string[] = [];

  for (const item of videoData) {
    for (const video of item.videos) {
      // Determine which technique(s) to link to based on video's giType
      const giTypes = video.giType === 'both' ? ['gi', 'nogi'] : [video.giType];
      
      for (const giType of giTypes) {
        // Find the technique in the database
        const technique = await prisma.technique.findFirst({
          where: {
            name: item.technique,
            position: item.position,
            giType: giType,
          }
        });

        if (!technique) {
          const key = `${item.position} - ${item.technique} (${giType})`;
          if (!notFound.includes(key)) {
            notFound.push(key);
          }
          totalSkipped++;
          continue;
        }

        // Check if video already exists for this technique
        const existingVideo = await prisma.techniqueVideo.findFirst({
          where: {
            techniqueId: technique.id,
            url: video.url,
          }
        });

        if (existingVideo) {
          console.log(`  ⏭️  Skipping duplicate: ${item.technique} (${giType}) - ${getVideoId(video.url)}`);
          totalSkipped++;
          continue;
        }

        // Add the video
        await prisma.techniqueVideo.create({
          data: {
            techniqueId: technique.id,
            title: `${item.technique} - ${giType.toUpperCase()}`,
            url: video.url,
            instructor: null,
            duration: null,
          }
        });

        console.log(`  ✅ Added: ${item.position} - ${item.technique} (${giType})`);
        totalAdded++;
      }
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  ✅ Videos added: ${totalAdded}`);
  console.log(`  ⏭️  Skipped: ${totalSkipped}`);
  
  if (notFound.length > 0) {
    console.log('\n⚠️  Techniques not found in database:');
    notFound.forEach(t => console.log(`    - ${t}`));
  }
}

seedVideos()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
