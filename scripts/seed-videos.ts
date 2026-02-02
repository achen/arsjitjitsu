import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VideoSeed {
  techniqueName: string;
  position: string;
  videos: {
    title: string;
    url: string;
    instructor: string;
    duration?: string;
  }[];
}

const videoSeeds: VideoSeed[] = [
  // Mount Top
  { techniqueName: 'Americana', position: 'Mount Top', videos: [
    { title: 'Americana from Mount - Complete Guide', url: 'https://www.youtube.com/watch?v=lDqtlfgeDfw', instructor: 'John Danaher', duration: '12:34' },
    { title: 'High Percentage Americana Details', url: 'https://www.youtube.com/watch?v=hDl_8W7EOYU', instructor: 'Lachlan Giles', duration: '8:21' },
  ]},
  { techniqueName: 'Armbar', position: 'Mount Top', videos: [
    { title: 'Armbar from Mount Masterclass', url: 'https://www.youtube.com/watch?v=BXHBIYdZVc4', instructor: 'Roger Gracie', duration: '15:42' },
    { title: 'Mount Armbar - Common Mistakes', url: 'https://www.youtube.com/watch?v=YAH5TXXQRVI', instructor: 'Andre Galvao', duration: '10:15' },
  ]},
  { techniqueName: 'Cross Collar Choke', position: 'Mount Top', videos: [
    { title: 'Cross Collar Choke from Mount', url: 'https://www.youtube.com/watch?v=PpvPIK5JBZw', instructor: 'Roger Gracie', duration: '8:30' },
  ]},
  { techniqueName: 'Mounted Triangle', position: 'Mount Top', videos: [
    { title: 'Mounted Triangle Setup', url: 'https://www.youtube.com/watch?v=lIJw6CGsSeQ', instructor: 'Danaher', duration: '14:20' },
  ]},

  // Mount Bottom
  { techniqueName: 'Upa (Bridge and Roll)', position: 'Mount Bottom', videos: [
    { title: 'Upa Escape - Fundamentals', url: 'https://www.youtube.com/watch?v=2KVQM7sYrMQ', instructor: 'Rener Gracie', duration: '6:45' },
    { title: 'Bridge and Roll Details', url: 'https://www.youtube.com/watch?v=MC9VJucrnYo', instructor: 'Bernardo Faria', duration: '9:12' },
  ]},
  { techniqueName: 'Elbow-Knee Escape', position: 'Mount Bottom', videos: [
    { title: 'Elbow Knee Escape from Mount', url: 'https://www.youtube.com/watch?v=EMEueexp9zU', instructor: 'John Danaher', duration: '11:30' },
  ]},

  // Side Control Top
  { techniqueName: 'Kimura', position: 'Side Control Top', videos: [
    { title: 'Kimura from Side Control', url: 'https://www.youtube.com/watch?v=V2EKHt4MEqk', instructor: 'Bernardo Faria', duration: '8:45' },
  ]},
  { techniqueName: 'Americana', position: 'Side Control Top', videos: [
    { title: 'Americana from Side Control', url: 'https://www.youtube.com/watch?v=IMasP9y5K8g', instructor: 'Stephan Kesting', duration: '7:20' },
  ]},
  { techniqueName: 'North-South Choke', position: 'Side Control Top', videos: [
    { title: 'North South Choke Details', url: 'https://www.youtube.com/watch?v=1EnlpM3HJEY', instructor: 'Marcelo Garcia', duration: '10:30' },
  ]},

  // Side Control Bottom
  { techniqueName: 'Elbow-Knee Escape', position: 'Side Control Bottom', videos: [
    { title: 'Side Control Escape - Elbow Knee', url: 'https://www.youtube.com/watch?v=V7vmzcc3ldA', instructor: 'Priit Mihkelson', duration: '15:00' },
  ]},
  { techniqueName: 'Ghost Escape', position: 'Side Control Bottom', videos: [
    { title: 'Ghost Escape from Side Control', url: 'https://www.youtube.com/watch?v=v3_PNXhqN10', instructor: 'Lachlan Giles', duration: '8:45' },
  ]},

  // Back Control
  { techniqueName: 'Rear Naked Choke', position: 'Back Control', videos: [
    { title: 'Rear Naked Choke - Complete System', url: 'https://www.youtube.com/watch?v=3T2HhOC5OvY', instructor: 'John Danaher', duration: '25:00' },
    { title: 'RNC Details You Need to Know', url: 'https://www.youtube.com/watch?v=G_UVUhqqcDI', instructor: 'Gordon Ryan', duration: '12:30' },
  ]},
  { techniqueName: 'Bow and Arrow Choke', position: 'Back Control', videos: [
    { title: 'Bow and Arrow Choke Tutorial', url: 'https://www.youtube.com/watch?v=n3Hv_5jJTjA', instructor: 'Roger Gracie', duration: '9:15' },
  ]},

  // Back Defense
  { techniqueName: 'Hand Fighting', position: 'Back Defense', videos: [
    { title: 'Back Defense Hand Fighting', url: 'https://www.youtube.com/watch?v=BWitv9AKoNU', instructor: 'Danaher', duration: '18:00' },
  ]},

  // Closed Guard Bottom
  { techniqueName: 'Armbar', position: 'Closed Guard Bottom', videos: [
    { title: 'Armbar from Closed Guard', url: 'https://www.youtube.com/watch?v=NLprOdJ42lE', instructor: 'Roger Gracie', duration: '10:45' },
  ]},
  { techniqueName: 'Triangle Choke', position: 'Closed Guard Bottom', videos: [
    { title: 'Triangle from Closed Guard', url: 'https://www.youtube.com/watch?v=ynp3yfPyZrA', instructor: 'Ryan Hall', duration: '20:00' },
    { title: 'High Percentage Triangle Setup', url: 'https://www.youtube.com/watch?v=n8dLIfBWsoo', instructor: 'Danaher', duration: '15:30' },
  ]},
  { techniqueName: 'Omoplata', position: 'Closed Guard Bottom', videos: [
    { title: 'Omoplata System', url: 'https://www.youtube.com/watch?v=y_XiVgDsLCk', instructor: 'Bernardo Faria', duration: '12:00' },
  ]},
  { techniqueName: 'Hip Bump Sweep', position: 'Closed Guard Bottom', videos: [
    { title: 'Hip Bump Sweep Tutorial', url: 'https://www.youtube.com/watch?v=mAkb_rHSTWw', instructor: 'Stephan Kesting', duration: '6:30' },
  ]},
  { techniqueName: 'Scissor Sweep', position: 'Closed Guard Bottom', videos: [
    { title: 'Scissor Sweep Fundamentals', url: 'https://www.youtube.com/watch?v=E9KG0-9FbKs', instructor: 'Rener Gracie', duration: '8:00' },
  ]},

  // Half Guard Bottom
  { techniqueName: 'Old School Sweep', position: 'Half Guard Bottom', videos: [
    { title: 'Old School Sweep - Half Guard', url: 'https://www.youtube.com/watch?v=tHxL-Sxg4YU', instructor: 'Bernardo Faria', duration: '10:00' },
  ]},
  { techniqueName: 'Lockdown', position: 'Half Guard Bottom', videos: [
    { title: 'Lockdown Half Guard System', url: 'https://www.youtube.com/watch?v=psduBl4oNgU', instructor: 'Eddie Bravo', duration: '15:00' },
  ]},
  { techniqueName: 'Deep Half Entry', position: 'Half Guard Bottom', videos: [
    { title: 'Deep Half Guard Entry', url: 'https://www.youtube.com/watch?v=K7zNY6U5118', instructor: 'Bernardo Faria', duration: '12:00' },
  ]},

  // Butterfly Guard
  { techniqueName: 'Butterfly Sweep', position: 'Butterfly Guard', videos: [
    { title: 'Butterfly Sweep Basics', url: 'https://www.youtube.com/watch?v=79wJPQb3y00', instructor: 'Marcelo Garcia', duration: '10:00' },
  ]},
  { techniqueName: 'Arm Drag', position: 'Butterfly Guard', videos: [
    { title: 'Arm Drag from Butterfly', url: 'https://www.youtube.com/watch?v=vQZVXgDk9WM', instructor: 'Marcelo Garcia', duration: '8:30' },
  ]},

  // De La Riva Guard
  { techniqueName: 'Berimbolo', position: 'De La Riva Guard', videos: [
    { title: 'Berimbolo Complete Guide', url: 'https://www.youtube.com/watch?v=JYw5WEyzCHI', instructor: 'Mikey Musumeci', duration: '20:00' },
  ]},
  { techniqueName: 'DLR Sweep', position: 'De La Riva Guard', videos: [
    { title: 'Basic DLR Sweep', url: 'https://www.youtube.com/watch?v=W6kRmPfhP1I', instructor: 'Andre Galvao', duration: '9:00' },
  ]},

  // X-Guard
  { techniqueName: 'Technical Stand Up Sweep', position: 'X-Guard', videos: [
    { title: 'X-Guard Technical Stand Up', url: 'https://www.youtube.com/watch?v=JQzHU9ECWEY', instructor: 'Marcelo Garcia', duration: '8:00' },
  ]},

  // Single Leg X
  { techniqueName: 'Straight Ankle Lock', position: 'Single Leg X', videos: [
    { title: 'Ankle Lock from SLX', url: 'https://www.youtube.com/watch?v=qPVMT5xPgBg', instructor: 'Lachlan Giles', duration: '12:00' },
  ]},
  { techniqueName: 'Heel Hook Entry', position: 'Single Leg X', videos: [
    { title: 'SLX to Heel Hook', url: 'https://www.youtube.com/watch?v=YxjAqL6PvJk', instructor: 'Craig Jones', duration: '15:00' },
  ]},

  // Leg Entanglement
  { techniqueName: 'Inside Heel Hook', position: 'Leg Entanglement', videos: [
    { title: 'Inside Heel Hook System', url: 'https://www.youtube.com/watch?v=rGGqWnTJtHI', instructor: 'John Danaher', duration: '25:00' },
    { title: 'Heel Hook Details', url: 'https://www.youtube.com/watch?v=JCMmMfnL5wo', instructor: 'Craig Jones', duration: '18:00' },
  ]},
  { techniqueName: 'Outside Heel Hook', position: 'Leg Entanglement', videos: [
    { title: 'Outside Heel Hook Attack', url: 'https://www.youtube.com/watch?v=bHl_4gTcTg0', instructor: 'Gordon Ryan', duration: '12:00' },
  ]},
  { techniqueName: 'Kneebar', position: 'Leg Entanglement', videos: [
    { title: 'Kneebar from Ashi Garami', url: 'https://www.youtube.com/watch?v=QYmSqeoxkzc', instructor: 'Lachlan Giles', duration: '10:00' },
  ]},

  // Standing
  { techniqueName: 'Double Leg Takedown', position: 'Standing', videos: [
    { title: 'Double Leg Takedown', url: 'https://www.youtube.com/watch?v=JUdsCFq8grQ', instructor: 'Jordan Burroughs', duration: '12:00' },
  ]},
  { techniqueName: 'Single Leg Takedown', position: 'Standing', videos: [
    { title: 'Single Leg for BJJ', url: 'https://www.youtube.com/watch?v=NQ5QvBLUXKc', instructor: 'John Smith', duration: '10:00' },
  ]},
  { techniqueName: 'Osoto Gari', position: 'Standing', videos: [
    { title: 'Osoto Gari for BJJ', url: 'https://www.youtube.com/watch?v=bvL7jLvcrzg', instructor: 'Travis Stevens', duration: '8:00' },
  ]},

  // Lockdown
  { techniqueName: 'Electric Chair Sweep', position: 'Lockdown', videos: [
    { title: 'Electric Chair from Lockdown', url: 'https://www.youtube.com/watch?v=cJJpHr2FthA', instructor: 'Eddie Bravo', duration: '12:00' },
  ]},
  { techniqueName: 'Vaporizer', position: 'Lockdown', videos: [
    { title: 'Vaporizer Submission', url: 'https://www.youtube.com/watch?v=9dHTzL1WFsQ', instructor: 'Eddie Bravo', duration: '8:00' },
  ]},

  // Rubber Guard
  { techniqueName: 'Mission Control', position: 'Rubber Guard', videos: [
    { title: 'Mission Control System', url: 'https://www.youtube.com/watch?v=JDLR3qxjbTw', instructor: 'Eddie Bravo', duration: '15:00' },
  ]},
  { techniqueName: 'Gogoplata', position: 'Rubber Guard', videos: [
    { title: 'Gogoplata from Rubber Guard', url: 'https://www.youtube.com/watch?v=x2dh-NjE4bA', instructor: 'Eddie Bravo', duration: '10:00' },
  ]},

  // Waiter Guard
  { techniqueName: 'Waiter Sweep', position: 'Waiter Guard', videos: [
    { title: 'Waiter Sweep Tutorial', url: 'https://www.youtube.com/watch?v=VG1y-N1hylk', instructor: 'Lachlan Giles', duration: '10:00' },
  ]},

  // High Ground
  { techniqueName: 'High Ground Entry', position: 'High Ground', videos: [
    { title: 'High Ground Position Introduction', url: 'https://www.youtube.com/watch?v=zfxjppqt44k', instructor: 'Officer Grimey', duration: '15:00' },
  ]},
  { techniqueName: 'High Ground Sweep', position: 'High Ground', videos: [
    { title: 'High Ground Sweep System', url: 'https://www.youtube.com/watch?v=5VhWfntPHbA', instructor: 'Officer Grimey', duration: '12:00' },
  ]},
];

async function seedVideos() {
  console.log('Seeding technique videos...\n');
  
  let addedCount = 0;
  let skippedCount = 0;

  for (const seed of videoSeeds) {
    // Find the technique
    const technique = await prisma.technique.findFirst({
      where: {
        name: seed.techniqueName,
        position: seed.position,
      },
    });

    if (!technique) {
      console.log(`⚠️  Technique not found: ${seed.techniqueName} (${seed.position})`);
      skippedCount++;
      continue;
    }

    // Add videos for this technique
    for (const video of seed.videos) {
      // Check if video already exists
      const existing = await prisma.techniqueVideo.findFirst({
        where: {
          techniqueId: technique.id,
          url: video.url,
        },
      });

      if (existing) {
        console.log(`  Skipping existing: ${video.title}`);
        continue;
      }

      await prisma.techniqueVideo.create({
        data: {
          techniqueId: technique.id,
          title: video.title,
          url: video.url,
          instructor: video.instructor,
          duration: video.duration,
        },
      });
      addedCount++;
    }
    console.log(`✅ ${seed.techniqueName} (${seed.position}): ${seed.videos.length} videos`);
  }

  console.log(`\n✅ Added ${addedCount} videos, skipped ${skippedCount} techniques`);
}

seedVideos()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
