import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// Re-export Prisma types for convenience
export type { User, Technique, UserRating } from '@prisma/client';

export interface TechniqueVideo {
  id: string;
  title: string;
  url: string;
  instructor: string | null;
  duration: string | null;
}

export interface TechniqueWithRating {
  id: string;
  name: string;
  position: string;
  type: string;
  description: string | null;
  giType: string;
  createdAt: Date;
  rating: number | null;
  notes: string | null;
  workingOn: boolean;
  videos: TechniqueVideo[];
}

// Position categories
export const POSITIONS = [
  'Mount Top',
  'Mount Bottom',
  'Side Control Top',
  'Side Control Bottom',
  'Back Control',
  'Back Defense',
  'Closed Guard Top',
  'Closed Guard Bottom',
  'Half Guard Top',
  'Half Guard Bottom',
  'Butterfly Guard',
  'De La Riva Guard',
  'Reverse De La Riva',
  'Spider Guard',
  'Lasso Guard',
  'X-Guard',
  'Single Leg X',
  '50/50',
  'Knee Shield',
  'Waiter Guard',
  'Z-Guard',
  'Rubber Guard',
  'Worm Guard',
  'Standing',
  'Turtle Top',
  'Turtle Bottom',
  'North-South Top',
  'North-South Bottom',
  'Knee on Belly',
  'Crucifix',
  'Leg Entanglement',
] as const;

// Technique types
export const TECHNIQUE_TYPES = [
  'Escape',
  'Sweep',
  'Reversal',
  'Takedown',
  'Submission',
  'Pass',
  'Transition',
  'Setup',
  'Defense',
] as const;

// Rating levels
export const RATING_LEVELS = [
  { value: 0, label: "Don't know it", description: "Haven't learned this technique" },
  { value: 1, label: "White belts", description: "Can execute on white belts" },
  { value: 2, label: "Blue belts", description: "Can execute on blue belts" },
  { value: 3, label: "Purple belts", description: "Can execute on purple belts" },
  { value: 4, label: "Brown belts", description: "Can execute on brown belts" },
  { value: 5, label: "Black belts", description: "Can execute on black belts" },
  { value: 6, label: "Competition black belts", description: "Can execute on competition black belts" },
  { value: 7, label: "World class", description: "Can execute on world class black belts" },
] as const;

export type Position = typeof POSITIONS[number];
export type TechniqueType = typeof TECHNIQUE_TYPES[number];
