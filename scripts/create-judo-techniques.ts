import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

// More judo throws and standing techniques
const judoTechniques: Array<{
  name: string;
  keywords: string[];
  type: string;
  giType: "BOTH" | "GI" | "NOGI";
}> = [
  // Major judo throws not yet added
  { name: "Sode Tsurikomi Goshi", keywords: ["sode tsurikomi", "sode-tsurikomi"], type: "Takedown", giType: "GI" },
  { name: "Morote Gari", keywords: ["morote gari", "morote-gari"], type: "Takedown", giType: "BOTH" },
  { name: "Koshi Guruma", keywords: ["koshi guruma", "koshi-guruma"], type: "Takedown", giType: "BOTH" },
  { name: "Tsurikomi Goshi", keywords: ["tsurikomi goshi", "tsurikomi-goshi"], type: "Takedown", giType: "GI" },
  { name: "Ashi Guruma", keywords: ["ashi guruma", "ashi-guruma"], type: "Takedown", giType: "BOTH" },
  { name: "O Guruma", keywords: ["o guruma", "o-guruma"], type: "Takedown", giType: "BOTH" },
  { name: "Uki Goshi", keywords: ["uki goshi", "uki-goshi", "floating hip"], type: "Takedown", giType: "BOTH" },
  { name: "Ogoshi", keywords: ["ogoshi", "o goshi", "o-goshi", "major hip"], type: "Takedown", giType: "BOTH" },
  { name: "Tani Otoshi", keywords: ["tani otoshi", "tani-otoshi", "valley drop"], type: "Takedown", giType: "BOTH" },
  { name: "Yoko Wakare", keywords: ["yoko wakare", "yoko-wakare"], type: "Takedown", giType: "GI" },
  { name: "Hane Goshi", keywords: ["hane goshi", "hane-goshi", "spring hip"], type: "Takedown", giType: "GI" },
  { name: "Okuri Ashi Barai", keywords: ["okuri ashi", "okuri-ashi", "following foot"], type: "Takedown", giType: "BOTH" },
  { name: "Harai Tsurikomi Ashi", keywords: ["harai tsurikomi ashi", "harai-tsurikomi-ashi"], type: "Takedown", giType: "GI" },
  { name: "Okuriashi Harai", keywords: ["okuriashi harai"], type: "Takedown", giType: "BOTH" },
  { name: "Uchi Goshi", keywords: ["uchi goshi", "uchi-goshi"], type: "Takedown", giType: "GI" },
  { name: "Kuchiki Taoshi", keywords: ["kuchiki taoshi", "kuchiki-taoshi"], type: "Takedown", giType: "BOTH" },
  { name: "Kibisu Gaeshi", keywords: ["kibisu gaeshi", "kibisu-gaeshi"], type: "Takedown", giType: "BOTH" },
  { name: "Te Guruma", keywords: ["te guruma", "te-guruma"], type: "Takedown", giType: "BOTH" },
  { name: "Sukui Nage", keywords: ["sukui nage", "sukui-nage", "scooping throw"], type: "Takedown", giType: "BOTH" },
  { name: "Hiza Seoi", keywords: ["hiza seoi"], type: "Takedown", giType: "GI" },
  { name: "Morote Seoi Nage", keywords: ["morote seoi", "morote-seoi", "two hand"], type: "Takedown", giType: "GI" },
  { name: "Ippon Seoi Nage", keywords: ["ippon seoi", "ippon-seoi", "one arm shoulder"], type: "Takedown", giType: "GI" },
  { name: "Eri Seoi Nage", keywords: ["eri seoi", "eri-seoi", "collar shoulder"], type: "Takedown", giType: "GI" },
  { name: "Soto Makikomi", keywords: ["soto makikomi", "soto-makikomi"], type: "Takedown", giType: "GI" },
  { name: "Uchi Makikomi", keywords: ["uchi makikomi", "uchi-makikomi"], type: "Takedown", giType: "GI" },
  { name: "Harai Makikomi", keywords: ["harai makikomi", "harai-makikomi"], type: "Takedown", giType: "GI" },
  { name: "Hane Makikomi", keywords: ["hane makikomi", "hane-makikomi"], type: "Takedown", giType: "GI" },
  { name: "Osoto Makikomi", keywords: ["osoto makikomi", "o-soto makikomi"], type: "Takedown", giType: "GI" },
  { name: "Kouchi Makikomi", keywords: ["kouchi makikomi", "ko-uchi makikomi"], type: "Takedown", giType: "GI" },
  { name: "Uchi Mata Makikomi", keywords: ["uchi mata makikomi"], type: "Takedown", giType: "GI" },
  { name: "Osoto Otoshi", keywords: ["osoto otoshi", "o-soto otoshi"], type: "Takedown", giType: "BOTH" },
  { name: "Ouchi Gaeshi", keywords: ["ouchi gaeshi", "o-uchi gaeshi"], type: "Takedown", giType: "BOTH" },
  { name: "Osoto Gaeshi", keywords: ["osoto gaeshi", "o-soto gaeshi"], type: "Takedown", giType: "BOTH" },
  { name: "Uchi Mata Gaeshi", keywords: ["uchi mata gaeshi"], type: "Takedown", giType: "BOTH" },
  { name: "Harai Goshi Gaeshi", keywords: ["harai goshi gaeshi"], type: "Takedown", giType: "BOTH" },
  { name: "Hane Goshi Gaeshi", keywords: ["hane goshi gaeshi"], type: "Takedown", giType: "BOTH" },
  { name: "Seoi Otoshi", keywords: ["seoi otoshi", "seoi-otoshi"], type: "Takedown", giType: "GI" },
  { name: "Yoko Sumi Gaeshi", keywords: ["yoko sumi gaeshi"], type: "Takedown", giType: "GI" },
  { name: "Tawara Gaeshi", keywords: ["tawara gaeshi", "tawara-gaeshi", "rice bale"], type: "Takedown", giType: "BOTH" },
  { name: "Yoko Gake", keywords: ["yoko gake", "yoko-gake", "side hook"], type: "Takedown", giType: "BOTH" },
  { name: "Daki Age", keywords: ["daki age", "daki-age", "high lift"], type: "Takedown", giType: "BOTH" },
  { name: "Ura Goshi", keywords: ["ura goshi", "ura-goshi"], type: "Takedown", giType: "BOTH" },
  { name: "Utsuri Goshi", keywords: ["utsuri goshi", "utsuri-goshi", "changing hip"], type: "Takedown", giType: "BOTH" },
  { name: "Sumi Otoshi", keywords: ["sumi otoshi", "sumi-otoshi", "corner drop"], type: "Takedown", giType: "BOTH" },
  
  // Wrestling techniques
  { name: "Sweep Single", keywords: ["sweep single"], type: "Takedown", giType: "NOGI" },
  { name: "Slide By", keywords: ["slide by", "slide-by", "slideby"], type: "Takedown", giType: "BOTH" },
  { name: "Shuck", keywords: ["shuck"], type: "Takedown", giType: "BOTH" },
  { name: "Front Trip", keywords: ["front trip"], type: "Takedown", giType: "BOTH" },
  { name: "Ankle Pick", keywords: ["ankle pick"], type: "Takedown", giType: "BOTH" },
  { name: "Knee Tap", keywords: ["knee tap"], type: "Takedown", giType: "BOTH" },
  { name: "Hip Toss", keywords: ["hip toss"], type: "Takedown", giType: "BOTH" },
  { name: "Head and Arm Throw", keywords: ["head and arm throw"], type: "Takedown", giType: "BOTH" },
  { name: "Whizzer", keywords: ["whizzer"], type: "Defense", giType: "BOTH" },
  { name: "Cement Mixer", keywords: ["cement mixer", "cement mix"], type: "Takedown", giType: "BOTH" },
  { name: "Cow Catcher", keywords: ["cow catcher", "cowcatcher"], type: "Takedown", giType: "BOTH" },
  { name: "Lat Drop", keywords: ["lat drop"], type: "Takedown", giType: "BOTH" },
  { name: "Drag", keywords: ["arm drag", "collar drag", "2 on 1 drag"], type: "Takedown", giType: "BOTH" },
  { name: "Go Behind", keywords: ["go behind"], type: "Takedown", giType: "BOTH" },
  { name: "Level Change", keywords: ["level change"], type: "Setup", giType: "BOTH" },
  { name: "Penetration Step", keywords: ["penetration step"], type: "Setup", giType: "BOTH" },
  { name: "Knee Pick", keywords: ["knee pick"], type: "Takedown", giType: "BOTH" },
  { name: "Barrel Roll", keywords: ["barrel roll"], type: "Escape", giType: "BOTH" },
  
  // Clinch work
  { name: "Collar and Elbow Tie", keywords: ["collar and elbow", "collar elbow"], type: "Control", giType: "BOTH" },
  { name: "Pummel", keywords: ["pummel", "pummeling"], type: "Control", giType: "BOTH" },
  { name: "2 on 1", keywords: ["2 on 1", "two on one", "2-on-1"], type: "Control", giType: "BOTH" },
  { name: "Over-Under Clinch", keywords: ["over under clinch", "over-under clinch"], type: "Control", giType: "BOTH" },
  { name: "Double Underhooks", keywords: ["double underhook"], type: "Control", giType: "BOTH" },
  { name: "Bear Hug", keywords: ["bear hug", "bearhug"], type: "Control", giType: "BOTH" },
  { name: "Headlock", keywords: ["headlock"], type: "Control", giType: "BOTH" },
  
  // Throw defense/counters
  { name: "Throw Defense", keywords: ["throw defense", "throw defence", "counter throw"], type: "Defense", giType: "BOTH" },
  { name: "Hip Block", keywords: ["hip block"], type: "Defense", giType: "BOTH" },
  { name: "Drop Step", keywords: ["drop step"], type: "Defense", giType: "BOTH" },
];

async function main() {
  const positionName = "Standing";

  // Get existing techniques in Standing position
  const existingTechniques = await prisma.technique.findMany({
    where: { position: positionName }
  });
  const existingNames = new Set(existingTechniques.map(t => t.name.toLowerCase()));
  console.log("Existing Standing techniques:", existingTechniques.length);

  // Get mapped videos
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));

  // Get all videos
  const videos = JSON.parse(fs.readFileSync("data/submissionsearcher-videos.json", "utf-8"));
  const unmapped = videos.filter((v: any) => !mappedUrls.has(v.youtubeUrl));

  console.log("\nUnmapped videos:", unmapped.length);

  let techniquesCreated = 0;
  let videosMapped = 0;

  for (const tech of judoTechniques) {
    // Check if technique already exists
    if (existingNames.has(tech.name.toLowerCase())) {
      // Still try to map videos to existing technique
      const technique = existingTechniques.find(t => t.name.toLowerCase() === tech.name.toLowerCase());
      if (technique) {
        const matchingVideos = unmapped.filter((v: any) => {
          const title = v.title.toLowerCase();
          return tech.keywords.some(kw => title.includes(kw));
        });
        if (matchingVideos.length > 0) {
          console.log(`  "${tech.name}" exists, mapping ${matchingVideos.length} videos`);
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
            } catch (e: any) {
              // Likely duplicate
            }
          }
        }
      }
      continue;
    }

    // Create the technique
    const technique = await prisma.technique.create({
      data: {
        name: tech.name,
        type: tech.type,
        position: positionName,
        giType: tech.giType,
      }
    });
    console.log(`  Created technique: ${tech.name}`);
    techniquesCreated++;
    existingNames.add(tech.name.toLowerCase());

    // Find matching unmapped videos
    const matchingVideos = unmapped.filter((v: any) => {
      const title = v.title.toLowerCase();
      return tech.keywords.some(kw => title.includes(kw));
    });

    if (matchingVideos.length > 0) {
      console.log(`    Found ${matchingVideos.length} videos for ${tech.name}`);

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
        } catch (e: any) {
          // Likely duplicate
        }
      }
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`Techniques created: ${techniquesCreated}`);
  console.log(`Videos mapped: ${videosMapped}`);

  await prisma.$disconnect();
}

main();
