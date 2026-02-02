import Database from 'better-sqlite3';
import * as crypto from 'crypto';
import path from 'path';

const uuidv4 = () => crypto.randomUUID();

const dbPath = process.env.DATABASE_PATH || './arsjiujitsu.db';
const db = new Database(path.resolve(dbPath));

// Initialize database
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
    gi_type TEXT NOT NULL DEFAULT 'both',
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

interface Technique {
  name: string;
  position: string;
  type: string;
  description?: string;
  gi_type: 'gi' | 'nogi' | 'both';
}

const techniques: Technique[] = [
  // Mount Top
  { name: 'Americana', position: 'Mount Top', type: 'Submission', description: 'Keylock shoulder lock from mount', gi_type: 'both' },
  { name: 'Armbar', position: 'Mount Top', type: 'Submission', description: 'Arm hyperextension from mount', gi_type: 'both' },
  { name: 'Cross Collar Choke', position: 'Mount Top', type: 'Submission', description: 'Gi choke using cross grips', gi_type: 'gi' },
  { name: 'Ezekiel Choke', position: 'Mount Top', type: 'Submission', description: 'Sleeve-assisted choke', gi_type: 'gi' },
  { name: 'Mounted Triangle', position: 'Mount Top', type: 'Submission', description: 'Triangle choke from mount', gi_type: 'both' },
  { name: 'S-Mount Armbar', position: 'Mount Top', type: 'Submission', description: 'High mount armbar', gi_type: 'both' },
  { name: 'Arm Triangle', position: 'Mount Top', type: 'Submission', description: 'Head and arm choke from mount', gi_type: 'both' },
  { name: 'Wrist Lock', position: 'Mount Top', type: 'Submission', description: 'Wrist hyperextension', gi_type: 'both' },
  { name: 'Gift Wrap', position: 'Mount Top', type: 'Setup', description: 'Control position for back take or submissions', gi_type: 'both' },
  { name: 'Technical Mount', position: 'Mount Top', type: 'Transition', description: 'One knee up mount position', gi_type: 'both' },
  { name: 'Maintaining Mount', position: 'Mount Top', type: 'Defense', description: 'Base and weight distribution to keep mount', gi_type: 'both' },

  // Mount Bottom
  { name: 'Upa (Bridge and Roll)', position: 'Mount Bottom', type: 'Escape', description: 'Hip bridge escape to guard', gi_type: 'both' },
  { name: 'Elbow-Knee Escape', position: 'Mount Bottom', type: 'Escape', description: 'Shrimp to half guard escape', gi_type: 'both' },
  { name: 'Trap and Roll', position: 'Mount Bottom', type: 'Reversal', description: 'Trap arm and leg then bridge', gi_type: 'both' },
  { name: 'Heel Drag Escape', position: 'Mount Bottom', type: 'Escape', description: 'Use heel to create space', gi_type: 'both' },
  { name: 'Foot Lock Escape', position: 'Mount Bottom', type: 'Escape', description: 'Attacking foot to create scramble', gi_type: 'both' },
  { name: 'Kipping Escape', position: 'Mount Bottom', type: 'Escape', description: 'Dynamic hip movement escape', gi_type: 'both' },

  // Side Control Top
  { name: 'Americana', position: 'Side Control Top', type: 'Submission', description: 'Keylock from side control', gi_type: 'both' },
  { name: 'Kimura', position: 'Side Control Top', type: 'Submission', description: 'Double wrist lock', gi_type: 'both' },
  { name: 'Armbar', position: 'Side Control Top', type: 'Submission', description: 'Spinning armbar from side control', gi_type: 'both' },
  { name: 'North-South Choke', position: 'Side Control Top', type: 'Submission', description: 'Arm triangle variation', gi_type: 'both' },
  { name: 'Bread Cutter Choke', position: 'Side Control Top', type: 'Submission', description: 'Gi collar choke from side', gi_type: 'gi' },
  { name: 'Baseball Bat Choke', position: 'Side Control Top', type: 'Submission', description: 'Cross collar choke', gi_type: 'gi' },
  { name: 'Paper Cutter Choke', position: 'Side Control Top', type: 'Submission', description: 'Lapel choke from side', gi_type: 'gi' },
  { name: 'Arm Triangle', position: 'Side Control Top', type: 'Submission', description: 'Kata gatame', gi_type: 'both' },
  { name: 'Mount Transition', position: 'Side Control Top', type: 'Transition', description: 'Moving to mount from side control', gi_type: 'both' },
  { name: 'Knee on Belly', position: 'Side Control Top', type: 'Transition', description: 'Moving to knee on belly', gi_type: 'both' },
  { name: 'Back Take', position: 'Side Control Top', type: 'Transition', description: 'Taking the back from side control', gi_type: 'both' },
  { name: 'Maintaining Side Control', position: 'Side Control Top', type: 'Defense', description: 'Pressure and control to maintain position', gi_type: 'both' },

  // Side Control Bottom
  { name: 'Elbow-Knee Escape', position: 'Side Control Bottom', type: 'Escape', description: 'Shrimp to guard recovery', gi_type: 'both' },
  { name: 'Bridge and Roll', position: 'Side Control Bottom', type: 'Reversal', description: 'Bridge escape to top', gi_type: 'both' },
  { name: 'Ghost Escape', position: 'Side Control Bottom', type: 'Escape', description: 'Slip out the back door', gi_type: 'both' },
  { name: 'Running Escape', position: 'Side Control Bottom', type: 'Escape', description: 'Turn away and run to knees', gi_type: 'both' },
  { name: 'Frame and Hip Escape', position: 'Side Control Bottom', type: 'Escape', description: 'Create frames and shrimp', gi_type: 'both' },
  { name: 'Underhook Escape', position: 'Side Control Bottom', type: 'Escape', description: 'Get underhook and come to knees', gi_type: 'both' },
  { name: 'Guard Recovery', position: 'Side Control Bottom', type: 'Escape', description: 'Recover full guard or half guard', gi_type: 'both' },

  // Back Control
  { name: 'Rear Naked Choke', position: 'Back Control', type: 'Submission', description: 'Classic rear choke', gi_type: 'both' },
  { name: 'Bow and Arrow Choke', position: 'Back Control', type: 'Submission', description: 'Gi choke with leg control', gi_type: 'gi' },
  { name: 'Collar Choke', position: 'Back Control', type: 'Submission', description: 'Sliding collar choke', gi_type: 'gi' },
  { name: 'Armbar from Back', position: 'Back Control', type: 'Submission', description: 'Armbar while on the back', gi_type: 'both' },
  { name: 'Short Choke', position: 'Back Control', type: 'Submission', description: 'One arm in choke variation', gi_type: 'both' },
  { name: 'Body Triangle', position: 'Back Control', type: 'Setup', description: 'Leg triangle control position', gi_type: 'both' },
  { name: 'Seatbelt Control', position: 'Back Control', type: 'Setup', description: 'Over-under arm control', gi_type: 'both' },
  { name: 'Maintaining Back Control', position: 'Back Control', type: 'Defense', description: 'Hooks and hand fighting', gi_type: 'both' },
  { name: 'Arm Trap', position: 'Back Control', type: 'Setup', description: 'Trapping arm for choke', gi_type: 'both' },

  // Back Defense
  { name: 'Hand Fighting', position: 'Back Defense', type: 'Defense', description: 'Preventing choke grips', gi_type: 'both' },
  { name: 'Hip Escape to Guard', position: 'Back Defense', type: 'Escape', description: 'Sliding hips to recover guard', gi_type: 'both' },
  { name: 'Shoulder Walk Escape', position: 'Back Defense', type: 'Escape', description: 'Walk shoulders to clear hooks', gi_type: 'both' },
  { name: 'Heel Pry', position: 'Back Defense', type: 'Escape', description: 'Remove hooks by prying heel', gi_type: 'both' },
  { name: 'Back to Wall', position: 'Back Defense', type: 'Defense', description: 'Use wall/mat to prevent attacks', gi_type: 'both' },

  // Closed Guard Bottom
  { name: 'Armbar', position: 'Closed Guard Bottom', type: 'Submission', description: 'Classic closed guard armbar', gi_type: 'both' },
  { name: 'Triangle Choke', position: 'Closed Guard Bottom', type: 'Submission', description: 'Leg triangle from closed guard', gi_type: 'both' },
  { name: 'Omoplata', position: 'Closed Guard Bottom', type: 'Submission', description: 'Shoulder lock with legs', gi_type: 'both' },
  { name: 'Kimura', position: 'Closed Guard Bottom', type: 'Submission', description: 'Double wrist lock from guard', gi_type: 'both' },
  { name: 'Guillotine', position: 'Closed Guard Bottom', type: 'Submission', description: 'Front headlock choke', gi_type: 'both' },
  { name: 'Cross Collar Choke', position: 'Closed Guard Bottom', type: 'Submission', description: 'Gi choke from closed guard', gi_type: 'gi' },
  { name: 'Hip Bump Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Sit-up sweep', gi_type: 'both' },
  { name: 'Scissor Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Classic sweep with collar and sleeve', gi_type: 'gi' },
  { name: 'Flower Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Pendulum sweep', gi_type: 'both' },
  { name: 'Elevator Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Hook sweep variation', gi_type: 'both' },
  { name: 'Lumberjack Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Two-on-one sleeve control sweep', gi_type: 'gi' },
  { name: 'Back Take from Guard', position: 'Closed Guard Bottom', type: 'Transition', description: 'Taking back from closed guard', gi_type: 'both' },

  // Closed Guard Top
  { name: 'Guard Break - Standing', position: 'Closed Guard Top', type: 'Pass', description: 'Stand to break closed guard', gi_type: 'both' },
  { name: 'Guard Break - Kneeling', position: 'Closed Guard Top', type: 'Pass', description: 'Break guard from knees', gi_type: 'both' },
  { name: 'Can Opener', position: 'Closed Guard Top', type: 'Pass', description: 'Neck pressure guard break', gi_type: 'both' },
  { name: 'Double Underhook Pass', position: 'Closed Guard Top', type: 'Pass', description: 'Stack pass with double unders', gi_type: 'both' },
  { name: 'Log Splitter', position: 'Closed Guard Top', type: 'Pass', description: 'Wedge knee in center to pass', gi_type: 'both' },
  { name: 'Posture in Guard', position: 'Closed Guard Top', type: 'Defense', description: 'Maintaining posture to prevent sweeps', gi_type: 'both' },

  // Half Guard Top
  { name: 'Knee Slice Pass', position: 'Half Guard Top', type: 'Pass', description: 'Slice knee across to pass', gi_type: 'both' },
  { name: 'Smash Pass', position: 'Half Guard Top', type: 'Pass', description: 'Flatten and smash through', gi_type: 'both' },
  { name: 'Backstep Pass', position: 'Half Guard Top', type: 'Pass', description: 'Step over to pass', gi_type: 'both' },
  { name: 'Hip Switch Pass', position: 'Half Guard Top', type: 'Pass', description: 'Switch hips to free leg', gi_type: 'both' },
  { name: 'Crossface', position: 'Half Guard Top', type: 'Setup', description: 'Control head to flatten', gi_type: 'both' },
  { name: 'Underhook Control', position: 'Half Guard Top', type: 'Setup', description: 'Getting and maintaining underhook', gi_type: 'both' },
  { name: 'Mount from Half', position: 'Half Guard Top', type: 'Transition', description: 'Moving to mount from half guard', gi_type: 'both' },

  // Half Guard Bottom
  { name: 'Old School Sweep', position: 'Half Guard Bottom', type: 'Sweep', description: 'Classic underhook sweep', gi_type: 'both' },
  { name: 'Plan B Sweep', position: 'Half Guard Bottom', type: 'Sweep', description: 'Sweep when they base', gi_type: 'both' },
  { name: 'Electric Chair', position: 'Half Guard Bottom', type: 'Sweep', description: 'Lockdown to electric chair', gi_type: 'both' },
  { name: 'Dogfight', position: 'Half Guard Bottom', type: 'Transition', description: 'Come to knees with underhook', gi_type: 'both' },
  { name: 'Back Take', position: 'Half Guard Bottom', type: 'Transition', description: 'Taking back from half guard', gi_type: 'both' },
  { name: 'Deep Half Entry', position: 'Half Guard Bottom', type: 'Transition', description: 'Move to deep half guard', gi_type: 'both' },
  { name: 'Knee Shield', position: 'Half Guard Bottom', type: 'Defense', description: 'Frame with knee to create distance', gi_type: 'both' },
  { name: 'Lockdown', position: 'Half Guard Bottom', type: 'Setup', description: 'Figure four legs to control', gi_type: 'both' },
  { name: 'Underhook', position: 'Half Guard Bottom', type: 'Setup', description: 'Getting the underhook', gi_type: 'both' },
  { name: 'Kimura from Half', position: 'Half Guard Bottom', type: 'Submission', description: 'Kimura attack from half guard', gi_type: 'both' },

  // Butterfly Guard
  { name: 'Butterfly Sweep', position: 'Butterfly Guard', type: 'Sweep', description: 'Classic hook sweep', gi_type: 'both' },
  { name: 'Arm Drag', position: 'Butterfly Guard', type: 'Transition', description: 'Drag arm to back take', gi_type: 'both' },
  { name: 'Guillotine', position: 'Butterfly Guard', type: 'Submission', description: 'Front headlock from butterfly', gi_type: 'both' },
  { name: 'Sumi Gaeshi', position: 'Butterfly Guard', type: 'Sweep', description: 'Sacrifice throw sweep', gi_type: 'gi' },
  { name: 'X-Guard Entry', position: 'Butterfly Guard', type: 'Transition', description: 'Move to X-Guard', gi_type: 'both' },
  { name: 'Single Leg X Entry', position: 'Butterfly Guard', type: 'Transition', description: 'Move to Single Leg X', gi_type: 'both' },
  { name: 'Hook Sweep', position: 'Butterfly Guard', type: 'Sweep', description: 'One hook sweep', gi_type: 'both' },
  { name: 'Snap Down', position: 'Butterfly Guard', type: 'Setup', description: 'Snap opponent down for attack', gi_type: 'both' },

  // De La Riva Guard
  { name: 'Back Take', position: 'De La Riva Guard', type: 'Transition', description: 'Berimbolo or spin under', gi_type: 'gi' },
  { name: 'DLR Sweep', position: 'De La Riva Guard', type: 'Sweep', description: 'Classic DLR sweep', gi_type: 'gi' },
  { name: 'Ankle Pick Sweep', position: 'De La Riva Guard', type: 'Sweep', description: 'Pick ankle and sweep', gi_type: 'both' },
  { name: 'Berimbolo', position: 'De La Riva Guard', type: 'Transition', description: 'Invert to back take', gi_type: 'gi' },
  { name: 'Kiss of the Dragon', position: 'De La Riva Guard', type: 'Transition', description: 'Invert under to back', gi_type: 'both' },
  { name: 'X-Guard Entry', position: 'De La Riva Guard', type: 'Transition', description: 'Move from DLR to X-Guard', gi_type: 'both' },
  { name: 'Collar Drag', position: 'De La Riva Guard', type: 'Setup', description: 'Pull down with collar grip', gi_type: 'gi' },
  { name: 'Deep DLR', position: 'De La Riva Guard', type: 'Setup', description: 'Deep hook control', gi_type: 'both' },

  // Reverse De La Riva
  { name: 'RDLR Sweep', position: 'Reverse De La Riva', type: 'Sweep', description: 'Basic reverse DLR sweep', gi_type: 'both' },
  { name: 'Back Take', position: 'Reverse De La Riva', type: 'Transition', description: 'Spin to back from RDLR', gi_type: 'both' },
  { name: 'Kiss of Dragon', position: 'Reverse De La Riva', type: 'Transition', description: 'Invert to back take', gi_type: 'both' },
  { name: 'Deep Half Entry', position: 'Reverse De La Riva', type: 'Transition', description: 'Move to deep half', gi_type: 'both' },
  { name: 'Leg Drag Counter', position: 'Reverse De La Riva', type: 'Defense', description: 'Counter the leg drag', gi_type: 'both' },

  // Spider Guard
  { name: 'Triangle', position: 'Spider Guard', type: 'Submission', description: 'Triangle from spider guard', gi_type: 'gi' },
  { name: 'Omoplata', position: 'Spider Guard', type: 'Submission', description: 'Omoplata from spider', gi_type: 'gi' },
  { name: 'Spider Sweep', position: 'Spider Guard', type: 'Sweep', description: 'Bicep control sweep', gi_type: 'gi' },
  { name: 'Balloon Sweep', position: 'Spider Guard', type: 'Sweep', description: 'Overhead sweep', gi_type: 'gi' },
  { name: 'Armbar', position: 'Spider Guard', type: 'Submission', description: 'Armbar from spider guard', gi_type: 'gi' },
  { name: 'Lasso Transition', position: 'Spider Guard', type: 'Transition', description: 'Move to lasso guard', gi_type: 'gi' },
  { name: 'Technical Stand Up', position: 'Spider Guard', type: 'Sweep', description: 'Stand up sweep variation', gi_type: 'gi' },

  // Lasso Guard
  { name: 'Lasso Sweep', position: 'Lasso Guard', type: 'Sweep', description: 'Classic lasso sweep', gi_type: 'gi' },
  { name: 'Triangle', position: 'Lasso Guard', type: 'Submission', description: 'Triangle from lasso', gi_type: 'gi' },
  { name: 'Omoplata', position: 'Lasso Guard', type: 'Submission', description: 'Omoplata from lasso', gi_type: 'gi' },
  { name: 'Pendulum Sweep', position: 'Lasso Guard', type: 'Sweep', description: 'Pendulum from lasso', gi_type: 'gi' },
  { name: 'Back Take', position: 'Lasso Guard', type: 'Transition', description: 'Spin to back', gi_type: 'gi' },
  { name: 'Bicep Slicer', position: 'Lasso Guard', type: 'Submission', description: 'Bicep slicer from lasso', gi_type: 'gi' },

  // X-Guard
  { name: 'Technical Stand Up Sweep', position: 'X-Guard', type: 'Sweep', description: 'Stand up sweep', gi_type: 'both' },
  { name: 'Overhead Sweep', position: 'X-Guard', type: 'Sweep', description: 'Throw opponent overhead', gi_type: 'both' },
  { name: 'Single Leg Sweep', position: 'X-Guard', type: 'Sweep', description: 'Come up on single leg', gi_type: 'both' },
  { name: 'Back Take', position: 'X-Guard', type: 'Transition', description: 'Take the back from X-Guard', gi_type: 'both' },
  { name: 'Leg Lock Entry', position: 'X-Guard', type: 'Transition', description: 'Move to leg entanglement', gi_type: 'both' },
  { name: 'Waiter Sweep', position: 'X-Guard', type: 'Sweep', description: 'Waiter sweep variation', gi_type: 'both' },

  // Single Leg X
  { name: 'Straight Ankle Lock', position: 'Single Leg X', type: 'Submission', description: 'Basic ankle lock', gi_type: 'both' },
  { name: 'Heel Hook Entry', position: 'Single Leg X', type: 'Transition', description: 'Move to heel hook position', gi_type: 'both' },
  { name: 'Sweep to Top', position: 'Single Leg X', type: 'Sweep', description: 'Sweep and come on top', gi_type: 'both' },
  { name: 'Kneebar Entry', position: 'Single Leg X', type: 'Transition', description: 'Transition to kneebar', gi_type: 'both' },
  { name: 'X-Guard Transition', position: 'Single Leg X', type: 'Transition', description: 'Move to full X-Guard', gi_type: 'both' },
  { name: 'Back Take', position: 'Single Leg X', type: 'Transition', description: 'Spin to the back', gi_type: 'both' },

  // 50/50
  { name: 'Heel Hook', position: '50/50', type: 'Submission', description: 'Inside or outside heel hook', gi_type: 'both' },
  { name: 'Kneebar', position: '50/50', type: 'Submission', description: 'Kneebar from 50/50', gi_type: 'both' },
  { name: 'Toe Hold', position: '50/50', type: 'Submission', description: 'Toe hold attack', gi_type: 'both' },
  { name: 'Sweep', position: '50/50', type: 'Sweep', description: 'Coming up on top', gi_type: 'both' },
  { name: 'Back Step Escape', position: '50/50', type: 'Escape', description: 'Step back to escape', gi_type: 'both' },
  { name: 'Calf Slicer', position: '50/50', type: 'Submission', description: 'Calf crush from 50/50', gi_type: 'both' },

  // Knee Shield
  { name: 'Hip Bump Sweep', position: 'Knee Shield', type: 'Sweep', description: 'Sit up and sweep', gi_type: 'both' },
  { name: 'Underhook', position: 'Knee Shield', type: 'Transition', description: 'Get underhook to half guard', gi_type: 'both' },
  { name: 'Omoplata', position: 'Knee Shield', type: 'Submission', description: 'Omoplata from knee shield', gi_type: 'both' },
  { name: 'Triangle', position: 'Knee Shield', type: 'Submission', description: 'Triangle setup', gi_type: 'both' },
  { name: 'Frame Escape', position: 'Knee Shield', type: 'Escape', description: 'Use frames to create distance', gi_type: 'both' },
  { name: 'Collar Drag', position: 'Knee Shield', type: 'Transition', description: 'Drag to back take', gi_type: 'gi' },

  // Z-Guard
  { name: 'Knee Shield Sweep', position: 'Z-Guard', type: 'Sweep', description: 'Basic Z-Guard sweep', gi_type: 'both' },
  { name: 'Back Take', position: 'Z-Guard', type: 'Transition', description: 'Spin to back from Z-Guard', gi_type: 'both' },
  { name: 'Underhook', position: 'Z-Guard', type: 'Transition', description: 'Get underhook for dogfight', gi_type: 'both' },
  { name: 'Kimura', position: 'Z-Guard', type: 'Submission', description: 'Kimura from Z-Guard', gi_type: 'both' },
  { name: 'Triangle Entry', position: 'Z-Guard', type: 'Transition', description: 'Move to triangle', gi_type: 'both' },

  // Standing
  { name: 'Double Leg Takedown', position: 'Standing', type: 'Takedown', description: 'Classic double leg', gi_type: 'both' },
  { name: 'Single Leg Takedown', position: 'Standing', type: 'Takedown', description: 'Single leg attack', gi_type: 'both' },
  { name: 'Osoto Gari', position: 'Standing', type: 'Takedown', description: 'Major outer reap', gi_type: 'gi' },
  { name: 'Ouchi Gari', position: 'Standing', type: 'Takedown', description: 'Major inner reap', gi_type: 'gi' },
  { name: 'Seoi Nage', position: 'Standing', type: 'Takedown', description: 'Shoulder throw', gi_type: 'gi' },
  { name: 'Arm Drag to Back', position: 'Standing', type: 'Takedown', description: 'Arm drag takedown', gi_type: 'both' },
  { name: 'Snap Down', position: 'Standing', type: 'Takedown', description: 'Snap head down to front headlock', gi_type: 'both' },
  { name: 'Ankle Pick', position: 'Standing', type: 'Takedown', description: 'Ankle pick takedown', gi_type: 'both' },
  { name: 'Body Lock Takedown', position: 'Standing', type: 'Takedown', description: 'Body lock trip', gi_type: 'both' },
  { name: 'Foot Sweep', position: 'Standing', type: 'Takedown', description: 'De ashi barai or ko uchi gari', gi_type: 'both' },
  { name: 'Collar Drag', position: 'Standing', type: 'Takedown', description: 'Pull down with collar', gi_type: 'gi' },
  { name: 'Duck Under', position: 'Standing', type: 'Takedown', description: 'Duck under to back', gi_type: 'both' },
  { name: 'Sprawl', position: 'Standing', type: 'Defense', description: 'Defend takedown attempts', gi_type: 'both' },
  { name: 'Guard Pull', position: 'Standing', type: 'Transition', description: 'Pull guard safely', gi_type: 'both' },

  // Turtle Top
  { name: 'Clock Choke', position: 'Turtle Top', type: 'Submission', description: 'Gi choke from turtle', gi_type: 'gi' },
  { name: 'Crucifix Entry', position: 'Turtle Top', type: 'Transition', description: 'Move to crucifix', gi_type: 'both' },
  { name: 'Back Take', position: 'Turtle Top', type: 'Transition', description: 'Get hooks in', gi_type: 'both' },
  { name: 'Front Headlock', position: 'Turtle Top', type: 'Transition', description: 'Snap to front headlock', gi_type: 'both' },
  { name: 'Guillotine', position: 'Turtle Top', type: 'Submission', description: 'Guillotine from turtle', gi_type: 'both' },
  { name: 'Anaconda Choke', position: 'Turtle Top', type: 'Submission', description: 'Arm triangle variation', gi_type: 'both' },
  { name: 'Darce Choke', position: 'Turtle Top', type: 'Submission', description: "D'arce from turtle", gi_type: 'both' },
  { name: 'Turnover', position: 'Turtle Top', type: 'Transition', description: 'Turn them over to side control', gi_type: 'both' },

  // Turtle Bottom
  { name: 'Granby Roll', position: 'Turtle Bottom', type: 'Escape', description: 'Roll to recover guard', gi_type: 'both' },
  { name: 'Sit Out', position: 'Turtle Bottom', type: 'Escape', description: 'Sit out to escape', gi_type: 'both' },
  { name: 'Stand Up', position: 'Turtle Bottom', type: 'Escape', description: 'Base and stand up', gi_type: 'both' },
  { name: 'Guard Recovery', position: 'Turtle Bottom', type: 'Escape', description: 'Recover to guard position', gi_type: 'both' },
  { name: 'Switch', position: 'Turtle Bottom', type: 'Reversal', description: 'Wrestling switch', gi_type: 'both' },
  { name: 'Single Leg Counter', position: 'Turtle Bottom', type: 'Transition', description: 'Attack single leg', gi_type: 'both' },

  // North-South Top
  { name: 'North-South Choke', position: 'North-South Top', type: 'Submission', description: 'Arm triangle from north-south', gi_type: 'both' },
  { name: 'Kimura', position: 'North-South Top', type: 'Submission', description: 'Kimura from north-south', gi_type: 'both' },
  { name: 'Armbar', position: 'North-South Top', type: 'Submission', description: 'Spin to armbar', gi_type: 'both' },
  { name: 'Side Control Transition', position: 'North-South Top', type: 'Transition', description: 'Move to side control', gi_type: 'both' },
  { name: 'Mount Transition', position: 'North-South Top', type: 'Transition', description: 'Transition to mount', gi_type: 'both' },
  { name: 'Paper Cutter', position: 'North-South Top', type: 'Submission', description: 'Paper cutter from north-south', gi_type: 'gi' },

  // North-South Bottom
  { name: 'Bridge Escape', position: 'North-South Bottom', type: 'Escape', description: 'Bridge and turn', gi_type: 'both' },
  { name: 'Granby Roll', position: 'North-South Bottom', type: 'Escape', description: 'Roll to recover guard', gi_type: 'both' },
  { name: 'Ghost Escape', position: 'North-South Bottom', type: 'Escape', description: 'Slip out to turtle', gi_type: 'both' },
  { name: 'Frame and Hip Escape', position: 'North-South Bottom', type: 'Escape', description: 'Create space with frames', gi_type: 'both' },

  // Knee on Belly
  { name: 'Armbar', position: 'Knee on Belly', type: 'Submission', description: 'Spin to armbar', gi_type: 'both' },
  { name: 'Baseball Bat Choke', position: 'Knee on Belly', type: 'Submission', description: 'Cross collar choke', gi_type: 'gi' },
  { name: 'Collar Choke', position: 'Knee on Belly', type: 'Submission', description: 'Loop choke variation', gi_type: 'gi' },
  { name: 'Mount Transition', position: 'Knee on Belly', type: 'Transition', description: 'Step over to mount', gi_type: 'both' },
  { name: 'Back Take', position: 'Knee on Belly', type: 'Transition', description: 'Spin to the back', gi_type: 'both' },
  { name: 'Far Side Armbar', position: 'Knee on Belly', type: 'Submission', description: 'Armbar the far arm', gi_type: 'both' },
  { name: 'Escape KOB', position: 'Knee on Belly', type: 'Escape', description: 'Escape from knee on belly', gi_type: 'both' },

  // Crucifix
  { name: 'Armbar', position: 'Crucifix', type: 'Submission', description: 'Armbar from crucifix', gi_type: 'both' },
  { name: 'Neck Crank', position: 'Crucifix', type: 'Submission', description: 'Can opener', gi_type: 'both' },
  { name: 'Rear Naked Choke', position: 'Crucifix', type: 'Submission', description: 'RNC from crucifix', gi_type: 'both' },
  { name: 'Collar Choke', position: 'Crucifix', type: 'Submission', description: 'Gi choke from crucifix', gi_type: 'gi' },
  { name: 'Maintaining Crucifix', position: 'Crucifix', type: 'Defense', description: 'Control and trap arms', gi_type: 'both' },

  // Leg Entanglement
  { name: 'Inside Heel Hook', position: 'Leg Entanglement', type: 'Submission', description: 'Inside heel hook attack', gi_type: 'both' },
  { name: 'Outside Heel Hook', position: 'Leg Entanglement', type: 'Submission', description: 'Outside heel hook attack', gi_type: 'both' },
  { name: 'Kneebar', position: 'Leg Entanglement', type: 'Submission', description: 'Kneebar from ashi garami', gi_type: 'both' },
  { name: 'Toe Hold', position: 'Leg Entanglement', type: 'Submission', description: 'Figure four toe hold', gi_type: 'both' },
  { name: 'Calf Slicer', position: 'Leg Entanglement', type: 'Submission', description: 'Calf crush', gi_type: 'both' },
  { name: 'Straight Ankle Lock', position: 'Leg Entanglement', type: 'Submission', description: 'Basic ankle lock', gi_type: 'both' },
  { name: 'Saddle Entry', position: 'Leg Entanglement', type: 'Transition', description: 'Entry to inside position', gi_type: 'both' },
  { name: '50/50 Entry', position: 'Leg Entanglement', type: 'Transition', description: 'Move to 50/50', gi_type: 'both' },
  { name: 'Outside Ashi', position: 'Leg Entanglement', type: 'Setup', description: 'Outside leg control', gi_type: 'both' },
  { name: 'Inside Ashi', position: 'Leg Entanglement', type: 'Setup', description: 'Inside leg control', gi_type: 'both' },
  { name: 'Honeyhole/Saddle', position: 'Leg Entanglement', type: 'Setup', description: '411/Inside sankaku', gi_type: 'both' },
  { name: 'Leg Defense', position: 'Leg Entanglement', type: 'Defense', description: 'Defending leg attacks', gi_type: 'both' },
  { name: 'Boot Escape', position: 'Leg Entanglement', type: 'Escape', description: 'Clear the knee line', gi_type: 'both' },

  // Rubber Guard
  { name: 'Mission Control', position: 'Rubber Guard', type: 'Setup', description: 'Overhook head control', gi_type: 'both' },
  { name: 'Gogoplata', position: 'Rubber Guard', type: 'Submission', description: 'Shin choke', gi_type: 'both' },
  { name: 'Omoplata', position: 'Rubber Guard', type: 'Submission', description: 'Omoplata from rubber guard', gi_type: 'both' },
  { name: 'Triangle', position: 'Rubber Guard', type: 'Submission', description: 'Triangle from rubber guard', gi_type: 'both' },
  { name: 'Armbar', position: 'Rubber Guard', type: 'Submission', description: 'Armbar from rubber guard', gi_type: 'both' },
  { name: 'Sweep', position: 'Rubber Guard', type: 'Sweep', description: 'Sweeps from rubber guard', gi_type: 'both' },

  // Worm Guard
  { name: 'Worm Guard Sweep', position: 'Worm Guard', type: 'Sweep', description: 'Lapel wrap sweep', gi_type: 'gi' },
  { name: 'Back Take', position: 'Worm Guard', type: 'Transition', description: 'Berimbolo from worm guard', gi_type: 'gi' },
  { name: 'Squid Guard Entry', position: 'Worm Guard', type: 'Transition', description: 'Move to squid guard', gi_type: 'gi' },
  { name: 'Worm Guard Entry', position: 'Worm Guard', type: 'Setup', description: 'Getting the lapel wrap', gi_type: 'gi' },
  { name: 'Omoplata', position: 'Worm Guard', type: 'Submission', description: 'Omoplata from worm guard', gi_type: 'gi' },
];

// Clear existing techniques
db.prepare('DELETE FROM techniques').run();

// Insert techniques
const insert = db.prepare(`
  INSERT INTO techniques (id, name, position, type, description, gi_type)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((techs: Technique[]) => {
  for (const tech of techs) {
    insert.run(uuidv4(), tech.name, tech.position, tech.type, tech.description || null, tech.gi_type);
  }
});

insertMany(techniques);

console.log(`✅ Seeded ${techniques.length} techniques`);

// Show technique count by position
const positionCounts = db.prepare(`
  SELECT position, COUNT(*) as count 
  FROM techniques 
  GROUP BY position 
  ORDER BY position
`).all() as { position: string; count: number }[];

console.log('\nTechniques by position:');
positionCounts.forEach((row) => {
  console.log(`  ${row.position}: ${row.count}`);
});

// Show technique count by type
const typeCounts = db.prepare(`
  SELECT type, COUNT(*) as count 
  FROM techniques 
  GROUP BY type 
  ORDER BY count DESC
`).all() as { type: string; count: number }[];

console.log('\nTechniques by type:');
typeCounts.forEach((row) => {
  console.log(`  ${row.type}: ${row.count}`);
});

db.close();
