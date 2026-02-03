import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

// More comprehensive keyword mappings for existing techniques
const techniqueKeywords: Record<string, string[]> = {
  // Judo throws
  "Sukui Nage": ["sukui nage", "sukui-nage", "scooping throw"],
  "Tsuri Goshi": ["tsuri goshi", "tsuri-goshi", "lifting hip"],
  "Sode Tsurikomi Goshi": ["sode tsuri", "sode tsurikomi", "sleeve lift", "sleeve pulling hip"],
  "Tsurikomi Goshi": ["tsurikomi goshi", "tsuri-komi goshi", "lift pull hip"],
  "Kata Guruma": ["kata guruma", "kata-guruma", "kataguruma", "fireman"],
  "Uchi Mata": ["uchi mata", "uchi-mata", "uchimata", "inner thigh"],
  "Osoto Gari": ["osoto gari", "o-soto gari", "o soto gari", "major outer reap", "outer reap"],
  "Ouchi Gari": ["ouchi gari", "o-uchi gari", "o uchi gari", "major inner reap", "inner reap"],
  "Seoi Nage": ["seoi nage", "seoi-nage", "seionage", "shoulder throw", "seio nage"],
  "Ippon Seoi Nage": ["ippon seoi", "ippon-seoi", "one arm shoulder"],
  "Drop Seoi Nage": ["drop seoi", "drop seio"],
  "Harai Goshi": ["harai goshi", "harai-goshi", "sweeping hip"],
  "Ogoshi": ["ogoshi", "o goshi", "o-goshi", "major hip throw", "hip throw"],
  "Koshi Guruma": ["koshi guruma", "koshi-guruma", "hip wheel"],
  "Hiza Guruma": ["hiza guruma", "hiza-guruma", "knee wheel"],
  "Tai Otoshi": ["tai otoshi", "tai-otoshi", "body drop"],
  "Tomoe Nage": ["tomoe nage", "tomoe-nage", "circle throw", "sacrifice throw"],
  "Sumi Gaeshi": ["sumi gaeshi", "sumi-gaeshi", "corner reversal"],
  "Uki Goshi": ["uki goshi", "uki-goshi", "floating hip"],
  "Uki Otoshi": ["uki otoshi", "uki-otoshi", "floating drop"],
  "Yoko Otoshi": ["yoko otoshi", "yoko-otoshi", "side drop"],
  "Tani Otoshi": ["tani otoshi", "tani-otoshi", "valley drop"],
  "Yoko Guruma": ["yoko guruma", "yoko-guruma", "side wheel"],
  "Ashi Guruma": ["ashi guruma", "ashi-guruma", "leg wheel"],
  "Kouchi Gari": ["kouchi gari", "ko-uchi gari", "ko uchi gari", "small inner reap"],
  "Kosoto Gari": ["kosoto gari", "ko-soto gari", "ko soto gari", "small outer reap"],
  "Kosoto Gake": ["kosoto gake", "ko-soto gake", "ko soto gake", "small outer hook"],
  "Ura Nage": ["ura nage", "ura-nage", "uranage", "rear throw"],
  "Makikomi": ["makikomi", "wrapping throw"],
  "Kibisu Gaeshi": ["kibisu gaeshi", "kibisu-gaeshi"],
  "Deashi Barai": ["deashi barai", "de-ashi barai", "advancing foot sweep"],
  "Okuri Ashi Barai": ["okuri ashi", "following foot sweep"],
  "Sasae Tsurikomi Ashi": ["sasae", "propping ankle throw"],
  "Hane Goshi": ["hane goshi", "hane-goshi", "spring hip"],
  
  // Leg hook takedowns
  "Inside Trip": ["inside trip", "leg hook takedown", "hook takedown"],
  "Outside Trip": ["outside trip"],
  "Lateral Drop": ["lateral drop"],
  
  // Scissors
  "Kani Basami": ["kani basami", "scissors", "scissor takedown", "leg scissor"],
  "Imanari Roll": ["imanari roll", "imanari"],
  
  // Chokes 
  "Bulldog Choke": ["bulldog choke", "bulldog"],
  "D'Arce Choke": ["darce", "d'arce", "d arce", "brabo"],
  "Anaconda Choke": ["anaconda"],
  "Guillotine": ["guillotine"],
  "Bow and Arrow Choke": ["bow and arrow", "bow & arrow"],
  "Clock Choke": ["clock choke"],
  "Lapel Choke": ["lapel choke"],
  "Ninja Choke": ["ninja choke", "ninja roll choke"],
  "Teepee Choke": ["teepee choke", "teepee"],
  "Front Naked Choke": ["front naked choke", "front choke"],
  "Pena Choke": ["pena choke"],
  "Step Over Choke": ["step over choke"],
  
  // Turtle attacks
  "Spiral Ride": ["spiral ride"],
  "Crucifix": ["crucifix"],
  
  // Escapes
  "Turtle Escape": ["turtle escape"],
  "Guard Retention": ["guard retention"],
  
  // Arm locks
  "Waki Gatame": ["waki gatame", "armpit lock", "armpit arm"],
  "Kesa Gatame": ["kesa gatame", "scarf hold"],
  "Ude Gatame": ["ude gatame", "arm armlock"],
  "Ashi Gatame": ["ashi gatame"],
  "Chicken Wing": ["chicken wing"],
  
  // Other
  "Forearm Slicer": ["forearm slicer"],
  "Tricep Slicer": ["tricep slicer"],
  "Wristlock": ["wristlock", "wrist lock", "kotegaeshi", "wrist turn"],
  "Spine Lock": ["spine lock", "spinal lock"],
  "Lapel Guard": ["lapel guard", "lapel lasso", "lasso guard"],
  "Spider Guard": ["spider guard"],
  "Octopus Guard": ["octopus guard"],
  "Gubber Guard": ["gubber guard"],
  "Bear Trap": ["bear trap"],
};

async function main() {
  // Get all existing techniques
  const existingTechniques = await prisma.technique.findMany();
  console.log("Total techniques:", existingTechniques.length);

  // Get mapped videos
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));

  // Get all videos
  const videos = JSON.parse(fs.readFileSync("data/submissionsearcher-videos.json", "utf-8"));
  const unmapped = videos.filter((v: any) => !mappedUrls.has(v.youtubeUrl));

  console.log("Unmapped videos:", unmapped.length);

  let videosMapped = 0;
  let techniquesCreated = 0;

  for (const [techName, keywords] of Object.entries(techniqueKeywords)) {
    // Find the technique
    let technique = existingTechniques.find(t => 
      t.name.toLowerCase() === techName.toLowerCase()
    );

    if (!technique) {
      // Create the technique
      console.log(`  Creating technique: ${techName}`);
      technique = await prisma.technique.create({
        data: {
          name: techName,
          type: "Submission",
          position: techName.includes("Gari") || techName.includes("Nage") || techName.includes("Goshi") || techName.includes("Otoshi") || techName.includes("Guruma") ? "Standing" : "Various",
          giType: "BOTH",
        }
      });
      techniquesCreated++;
    }

    // Find matching unmapped videos
    const matchingVideos = unmapped.filter((v: any) => {
      const title = v.title.toLowerCase();
      return keywords.some(kw => title.includes(kw));
    });

    if (matchingVideos.length > 0) {
      console.log(`  Mapping ${matchingVideos.length} videos to ${techName}`);

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
