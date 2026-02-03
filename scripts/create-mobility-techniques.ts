import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Mobility/stretching technique patterns
const mobilityTechniques: { name: string; keywords: string[] }[] = [
  { name: 'Hip Mobility', keywords: ['hip mobility', 'hip stretch', 'hip opening', 'hip flexor', 'hip opener'] },
  { name: 'Shoulder Mobility', keywords: ['shoulder mobility', 'shoulder stretch', 'shoulder warm'] },
  { name: 'Spine Mobility', keywords: ['spine mobility', 'spinal mobility', 'back mobility', 'thoracic'] },
  { name: 'Neck Stretches', keywords: ['neck stretch', 'neck mobility', 'neck warm'] },
  { name: 'Hamstring Stretches', keywords: ['hamstring stretch', 'hamstring mobility', 'hamstring flexibility'] },
  { name: 'Groin Stretches', keywords: ['groin stretch', 'groin mobility', 'adductor stretch', 'inner thigh'] },
  { name: 'Quad Stretches', keywords: ['quad stretch', 'quadricep stretch', 'quad mobility'] },
  { name: 'Calf Stretches', keywords: ['calf stretch', 'calf mobility', 'ankle mobility', 'ankle stretch'] },
  { name: 'Wrist Mobility', keywords: ['wrist mobility', 'wrist stretch', 'wrist warm', 'forearm stretch'] },
  { name: 'Full Body Stretching', keywords: ['full body stretch', 'total body stretch', 'whole body stretch'] },
  { name: 'BJJ Warm-Up', keywords: ['bjj warm', 'jiu jitsu warm', 'grappling warm', 'warm up routine', 'warm-up routine'] },
  { name: 'BJJ Cool Down', keywords: ['cool down', 'cooldown', 'post training stretch', 'recovery stretch'] },
  { name: 'Flexibility Training', keywords: ['flexibility', 'flexible', 'splits', 'pancake stretch'] },
  { name: 'Foam Rolling', keywords: ['foam roll', 'foam roller', 'myofascial', 'self massage'] },
  { name: 'Dynamic Stretching', keywords: ['dynamic stretch', 'dynamic warm', 'movement prep'] },
  { name: 'Static Stretching', keywords: ['static stretch', 'hold stretch', 'passive stretch'] },
  { name: 'Yoga for BJJ', keywords: ['yoga for bjj', 'yoga for jiu', 'yoga grappl', 'jiu jitsu yoga'] },
  { name: 'Morning Mobility Routine', keywords: ['morning routine', 'morning stretch', 'morning mobility'] },
  { name: 'Pre-Training Mobility', keywords: ['pre-training', 'pre training', 'before training', 'before class'] },
  { name: 'Post-Training Recovery', keywords: ['post-training', 'post training', 'after training', 'after class', 'recovery'] },
  { name: 'Guard Mobility Drills', keywords: ['guard mobility', 'guard flexibility', 'hip escape drill', 'shrimp drill'] },
  { name: 'Knee Health', keywords: ['knee health', 'knee mobility', 'knee stretch', 'knee rehab', 'knee prehab'] },
  { name: 'Lower Back Care', keywords: ['lower back stretch', 'lower back mobility', 'lumbar stretch', 'back pain'] },
  { name: 'Pigeon Stretch', keywords: ['pigeon stretch', 'pigeon pose', '90/90 stretch', '90-90 stretch'] },
  { name: 'Couch Stretch', keywords: ['couch stretch', 'rectus femoris', 'hip flexor stretch'] },
  { name: 'Figure Four Stretch', keywords: ['figure four', 'figure 4 stretch', 'piriformis stretch'] },
  { name: 'Cat-Cow Stretch', keywords: ['cat cow', 'cat-cow', 'cat and cow'] },
  { name: 'Child\'s Pose', keywords: ['child\'s pose', 'childs pose', 'child pose'] },
  { name: 'Downward Dog', keywords: ['downward dog', 'down dog'] },
  { name: 'Mobility Flow', keywords: ['mobility flow', 'movement flow', 'flow routine'] },
];

// General keywords that indicate mobility/stretching content
const generalMobilityKeywords = [
  'stretch', 'mobility', 'flexibility', 'warm up', 'warm-up', 'warmup',
  'cool down', 'cooldown', 'recovery', 'yoga', 'foam roll', 'prehab', 'rehab'
];

async function main() {
  // Load videos
  const allVideos = JSON.parse(fs.readFileSync('data/submissionsearcher-videos.json', 'utf-8'));
  
  // Get all mapped video URLs
  const mappedVideos = await prisma.techniqueVideo.findMany({
    select: { url: true }
  });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));
  
  // Find unmapped videos
  const unmappedVideos = allVideos.filter((v: any) => !mappedUrls.has(v.youtubeUrl));
  
  console.log(`Total videos: ${allVideos.length}`);
  console.log(`Unmapped videos: ${unmappedVideos.length}`);
  
  // Find mobility/stretching videos
  const mobilityVideos = unmappedVideos.filter((v: any) => {
    const titleLower = v.title.toLowerCase();
    return generalMobilityKeywords.some(kw => titleLower.includes(kw));
  });
  
  console.log(`\nMobility/stretching videos found: ${mobilityVideos.length}`);
  
  // Track stats
  let techniquesCreated = 0;
  let videosMapped = 0;
  
  // Create techniques and map videos
  for (const tech of mobilityTechniques) {
    // Find matching videos
    const matchingVideos = mobilityVideos.filter((v: any) => {
      const titleLower = v.title.toLowerCase();
      return tech.keywords.some(kw => titleLower.includes(kw));
    });
    
    if (matchingVideos.length === 0) continue;
    
    // Create or find technique
    let technique = await prisma.technique.findFirst({
      where: { 
        name: tech.name,
        position: 'Mobility'
      }
    });
    
    if (!technique) {
      technique = await prisma.technique.create({
        data: {
          name: tech.name,
          position: 'Mobility',
          type: 'Mobility',
          giType: 'Both'
        }
      });
      techniquesCreated++;
      console.log(`Created: ${tech.name}`);
    }
    
    // Map videos
    for (const video of matchingVideos) {
      try {
        await prisma.techniqueVideo.create({
          data: {
            techniqueId: technique.id,
            url: video.youtubeUrl,
            title: video.title,
          }
        });
        videosMapped++;
      } catch (e) {
        // Already mapped
      }
    }
    
    console.log(`  ${tech.name}: ${matchingVideos.length} videos`);
  }
  
  // Handle remaining mobility videos that didn't match specific techniques
  // Map them to a general "General Mobility" technique
  const remainingMobilityVideos = mobilityVideos.filter((v: any) => {
    const titleLower = v.title.toLowerCase();
    return !mobilityTechniques.some(tech => 
      tech.keywords.some(kw => titleLower.includes(kw))
    );
  });
  
  if (remainingMobilityVideos.length > 0) {
    let generalTechnique = await prisma.technique.findFirst({
      where: { name: 'General Mobility', position: 'Mobility' }
    });
    
    if (!generalTechnique) {
      generalTechnique = await prisma.technique.create({
        data: {
          name: 'General Mobility',
          position: 'Mobility',
          type: 'Mobility',
          giType: 'Both'
        }
      });
      techniquesCreated++;
      console.log(`Created: General Mobility`);
    }
    
    for (const video of remainingMobilityVideos) {
      try {
        await prisma.techniqueVideo.create({
          data: {
            techniqueId: generalTechnique.id,
            url: video.youtubeUrl,
            title: video.title,
          }
        });
        videosMapped++;
      } catch (e) {
        // Already mapped
      }
    }
    
    console.log(`  General Mobility: ${remainingMobilityVideos.length} videos`);
  }
  
  // Final stats
  const totalTechniques = await prisma.technique.count();
  const totalMapped = await prisma.techniqueVideo.count();
  const finalUnmapped = allVideos.length - totalMapped;
  
  console.log(`\n--- Summary ---`);
  console.log(`Techniques created: ${techniquesCreated}`);
  console.log(`Videos mapped: ${videosMapped}`);
  console.log(`Total techniques: ${totalTechniques}`);
  console.log(`Remaining unmapped: ${finalUnmapped}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
