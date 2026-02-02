import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || './arsjiujitsu.db';
const db = new Database(path.resolve(dbPath));

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    belt TEXT DEFAULT 'white',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS techniques (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_ratings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    technique_id TEXT NOT NULL,
    rating INTEGER DEFAULT 0,
    notes TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technique_id) REFERENCES techniques(id) ON DELETE CASCADE,
    UNIQUE(user_id, technique_id)
  );

  CREATE INDEX IF NOT EXISTS idx_techniques_position ON techniques(position);
  CREATE INDEX IF NOT EXISTS idx_techniques_type ON techniques(type);
  CREATE INDEX IF NOT EXISTS idx_user_ratings_user ON user_ratings(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_ratings_technique ON user_ratings(technique_id);
`);

export default db;

// Types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  belt: string;
  created_at: string;
  updated_at: string;
}

export interface Technique {
  id: string;
  name: string;
  position: string;
  type: string;
  description: string | null;
  created_at: string;
}

export interface UserRating {
  id: string;
  user_id: string;
  technique_id: string;
  rating: number;
  notes: string | null;
  updated_at: string;
}

export interface TechniqueWithRating extends Technique {
  rating: number | null;
  notes: string | null;
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
