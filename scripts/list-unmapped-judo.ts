import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const mappedVideos = await prisma.techniqueVideo.findMany({ select: { url: true } });
  const mappedUrls = new Set(mappedVideos.map(v => v.url));
  
  const videos = JSON.parse(fs.readFileSync("data/submissionsearcher-videos.json", "utf-8"));
  const unmapped = videos.filter((v: any) => !mappedUrls.has(v.youtubeUrl));
  
  // Find all standing/judo related unmapped
  const judoPatterns = ["gari", "nage", "otoshi", "guruma", "goshi", "gaeshi", "waza", "gake", "barai", "harai", "makikomi", "seoi", "tani", "sukui", "uchi mata", "morote", "kata", "osoto", "ouchi", "kouchi", "kosoto", "sasae", "tomoe", "hiza", "ashi", "sumi", "yoko", "ura", "hane", "sode", "ippon", "eri", "judo", "throw", "drop", "reap", "hook", "wheel"];
  
  const standing = unmapped.filter((v: any) => {
    const title = v.title.toLowerCase();
    return judoPatterns.some(kw => title.includes(kw));
  });
  
  console.log("=== UNMAPPED JUDO/THROW VIDEOS (" + standing.length + ") ===\n");
  standing.forEach((v: any, i: number) => {
    console.log((i+1) + ". " + v.title);
  });
  
  await prisma.$disconnect();
}

main();
