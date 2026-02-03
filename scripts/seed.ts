import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  { name: 'Scissor Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Classic sweep with collar and sleeve', gi_type: 'both' },
  { name: 'Flower Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Pendulum sweep', gi_type: 'both' },
  { name: 'Elevator Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Hook sweep variation', gi_type: 'both' },
  { name: 'Lumberjack Sweep', position: 'Closed Guard Bottom', type: 'Sweep', description: 'Two-on-one sleeve control sweep', gi_type: 'both' },
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

  // Waiter Guard
  { name: 'Waiter Sweep', position: 'Waiter Guard', type: 'Sweep', description: 'Classic waiter sweep lifting opponent overhead', gi_type: 'both' },
  { name: 'Back Take', position: 'Waiter Guard', type: 'Transition', description: 'Spin under to take the back', gi_type: 'both' },
  { name: 'Calf Slicer', position: 'Waiter Guard', type: 'Submission', description: 'Calf crush when opponent resists sweep', gi_type: 'both' },
  { name: 'Toe Hold', position: 'Waiter Guard', type: 'Submission', description: 'Toe hold attack from waiter position', gi_type: 'both' },
  { name: 'Kneebar', position: 'Waiter Guard', type: 'Submission', description: 'Kneebar from waiter guard', gi_type: 'both' },
  { name: 'Waiter to X-Guard', position: 'Waiter Guard', type: 'Transition', description: 'Transition to X-Guard', gi_type: 'both' },
  { name: 'Waiter to Single Leg X', position: 'Waiter Guard', type: 'Transition', description: 'Move to Single Leg X position', gi_type: 'both' },
  { name: 'Overhead Sweep', position: 'Waiter Guard', type: 'Sweep', description: 'Throw opponent over your head', gi_type: 'both' },
  { name: 'Waiter Entry from Half Guard', position: 'Waiter Guard', type: 'Setup', description: 'Enter waiter from half guard bottom', gi_type: 'both' },
  { name: 'Waiter Entry from X-Guard', position: 'Waiter Guard', type: 'Setup', description: 'Enter waiter from X-Guard', gi_type: 'both' },
  { name: 'Scissor Sweep', position: 'Waiter Guard', type: 'Sweep', description: 'Scissor motion sweep from waiter', gi_type: 'both' },
  { name: 'Leg Drag Counter', position: 'Waiter Guard', type: 'Defense', description: 'Counter opponent attempting to leg drag', gi_type: 'both' },
  { name: 'Heel Hook Entry', position: 'Waiter Guard', type: 'Transition', description: 'Transition to heel hook position', gi_type: 'both' },

  // Butterfly Half
  { name: 'Butterfly Half Sweep', position: 'Butterfly Half', type: 'Sweep', description: 'Hook sweep using butterfly hook in half guard', gi_type: 'both' },
  { name: 'Elevator Sweep', position: 'Butterfly Half', type: 'Sweep', description: 'Elevate with butterfly hook to sweep', gi_type: 'both' },
  { name: 'Back Take', position: 'Butterfly Half', type: 'Transition', description: 'Use underhook and hook to take back', gi_type: 'both' },
  { name: 'Single Leg X Entry', position: 'Butterfly Half', type: 'Transition', description: 'Transition to single leg X', gi_type: 'both' },
  { name: 'X-Guard Entry', position: 'Butterfly Half', type: 'Transition', description: 'Move to full X-Guard', gi_type: 'both' },
  { name: 'Underhook Sweep', position: 'Butterfly Half', type: 'Sweep', description: 'Combine underhook with hook for sweep', gi_type: 'both' },
  { name: 'Arm Drag', position: 'Butterfly Half', type: 'Transition', description: 'Arm drag to back take', gi_type: 'both' },
  { name: 'Guillotine', position: 'Butterfly Half', type: 'Submission', description: 'Guillotine when opponent drives in', gi_type: 'both' },
  { name: 'Kimura', position: 'Butterfly Half', type: 'Submission', description: 'Kimura attack from butterfly half', gi_type: 'both' },
  { name: 'Dogfight', position: 'Butterfly Half', type: 'Transition', description: 'Come up to dogfight position', gi_type: 'both' },

  // Lockdown
  { name: 'Electric Chair Sweep', position: 'Lockdown', type: 'Sweep', description: 'Classic Eddie Bravo electric chair', gi_type: 'both' },
  { name: 'Old School Sweep', position: 'Lockdown', type: 'Sweep', description: 'Whip up to sweep from lockdown', gi_type: 'both' },
  { name: 'Plan B', position: 'Lockdown', type: 'Sweep', description: 'Sweep when they post', gi_type: 'both' },
  { name: 'Vaporizer', position: 'Lockdown', type: 'Submission', description: 'Calf crank submission', gi_type: 'both' },
  { name: 'Electric Chair Submission', position: 'Lockdown', type: 'Submission', description: 'Groin stretch submission', gi_type: 'both' },
  { name: 'Whip Up', position: 'Lockdown', type: 'Setup', description: 'Use lockdown to stretch opponent', gi_type: 'both' },
  { name: 'Dogfight Entry', position: 'Lockdown', type: 'Transition', description: 'Release lockdown to dogfight', gi_type: 'both' },
  { name: 'Back Take', position: 'Lockdown', type: 'Transition', description: 'Take back from lockdown', gi_type: 'both' },
  { name: 'Lockdown Entry', position: 'Lockdown', type: 'Setup', description: 'Securing the lockdown from half guard', gi_type: 'both' },
  { name: 'Banana Split', position: 'Lockdown', type: 'Submission', description: 'Groin split from electric chair', gi_type: 'both' },

  // Octopus Guard
  { name: 'Octopus Sweep', position: 'Octopus Guard', type: 'Sweep', description: 'Classic octopus guard sweep', gi_type: 'both' },
  { name: 'Back Take', position: 'Octopus Guard', type: 'Transition', description: 'Spin to back from octopus', gi_type: 'both' },
  { name: 'Guillotine', position: 'Octopus Guard', type: 'Submission', description: 'Arm-in guillotine from octopus', gi_type: 'both' },
  { name: 'Omoplata', position: 'Octopus Guard', type: 'Submission', description: 'Omoplata transition from octopus', gi_type: 'both' },
  { name: 'Triangle', position: 'Octopus Guard', type: 'Submission', description: 'Triangle setup from octopus', gi_type: 'both' },
  { name: 'Armbar', position: 'Octopus Guard', type: 'Submission', description: 'Armbar from octopus control', gi_type: 'both' },
  { name: 'Octopus Entry from Half Guard', position: 'Octopus Guard', type: 'Setup', description: 'Enter octopus from half guard', gi_type: 'both' },
  { name: 'Octopus Entry from Side Control', position: 'Octopus Guard', type: 'Setup', description: 'Recover to octopus from bottom side control', gi_type: 'both' },
  { name: 'Hip Bump Sweep', position: 'Octopus Guard', type: 'Sweep', description: 'Hip bump to sweep from octopus', gi_type: 'both' },
  { name: 'Underhook Control', position: 'Octopus Guard', type: 'Setup', description: 'Deep underhook control in octopus', gi_type: 'both' },

  // High Ground (Officer Grimey)
  { name: 'High Ground Entry', position: 'High Ground', type: 'Setup', description: 'Entering the high ground position', gi_type: 'both' },
  { name: 'High Ground Sweep', position: 'High Ground', type: 'Sweep', description: 'Classic sweep from high ground', gi_type: 'both' },
  { name: 'Back Take', position: 'High Ground', type: 'Transition', description: 'Take the back from high ground', gi_type: 'both' },
  { name: 'Armbar', position: 'High Ground', type: 'Submission', description: 'Armbar attack from high ground', gi_type: 'both' },
  { name: 'Triangle', position: 'High Ground', type: 'Submission', description: 'Triangle from high ground control', gi_type: 'both' },
  { name: 'Omoplata', position: 'High Ground', type: 'Submission', description: 'Omoplata from high ground', gi_type: 'both' },
  { name: 'Leg Entanglement Entry', position: 'High Ground', type: 'Transition', description: 'Transition to leg attacks', gi_type: 'both' },
  { name: 'Mount Transition', position: 'High Ground', type: 'Transition', description: 'Come up to mount from high ground', gi_type: 'both' },
  { name: 'Kimura', position: 'High Ground', type: 'Submission', description: 'Kimura grip attack from high ground', gi_type: 'both' },
  { name: 'High Ground Retention', position: 'High Ground', type: 'Defense', description: 'Maintaining the high ground position', gi_type: 'both' },

  // K Guard (Lachlan Giles)
  { name: 'K Guard Entry from Half Guard', position: 'K Guard', type: 'Setup', description: 'Enter K Guard from half guard bottom', gi_type: 'both' },
  { name: 'K Guard Entry from Butterfly', position: 'K Guard', type: 'Setup', description: 'Transition to K Guard from butterfly guard', gi_type: 'both' },
  { name: 'K Guard Entry from Open Guard', position: 'K Guard', type: 'Setup', description: 'Pull into K Guard from open guard', gi_type: 'both' },
  { name: 'Inside Heel Hook', position: 'K Guard', type: 'Submission', description: 'Inside heel hook from K Guard', gi_type: 'both' },
  { name: 'Outside Heel Hook', position: 'K Guard', type: 'Submission', description: 'Outside heel hook attack from K Guard', gi_type: 'both' },
  { name: 'Backside 50/50 Entry', position: 'K Guard', type: 'Transition', description: 'Transition to backside 50/50 for heel hook', gi_type: 'both' },
  { name: 'Inside Sankaku Entry', position: 'K Guard', type: 'Transition', description: 'Enter inside sankaku/saddle from K Guard', gi_type: 'both' },
  { name: 'Outside Ashi Entry', position: 'K Guard', type: 'Transition', description: 'Transition to outside ashi garami', gi_type: 'both' },
  { name: 'Straight Ankle Lock', position: 'K Guard', type: 'Submission', description: 'Ankle lock from K Guard position', gi_type: 'both' },
  { name: 'Kneebar', position: 'K Guard', type: 'Submission', description: 'Kneebar attack from K Guard', gi_type: 'both' },
  { name: 'K Guard Sweep', position: 'K Guard', type: 'Sweep', description: 'Off-balance and sweep from K Guard', gi_type: 'both' },
  { name: 'Back Take', position: 'K Guard', type: 'Transition', description: 'Take the back from K Guard', gi_type: 'both' },
  { name: 'Cross Ashi Entry', position: 'K Guard', type: 'Transition', description: 'Transition to cross ashi/honey hole', gi_type: 'both' },
  { name: 'K Guard Retention', position: 'K Guard', type: 'Defense', description: 'Maintaining K Guard against passes', gi_type: 'both' },
  { name: 'Calf Slicer', position: 'K Guard', type: 'Submission', description: 'Calf slicer from K Guard transitions', gi_type: 'both' },

  // Collar Sleeve Guard
  { name: 'Triangle Choke', position: 'Collar Sleeve Guard', type: 'Submission', description: 'Triangle setup using collar and sleeve control', gi_type: 'gi' },
  { name: 'Omoplata', position: 'Collar Sleeve Guard', type: 'Submission', description: 'Omoplata using sleeve control to off-balance', gi_type: 'gi' },
  { name: 'Armbar', position: 'Collar Sleeve Guard', type: 'Submission', description: 'Armbar attack from collar sleeve grips', gi_type: 'gi' },
  { name: 'Collar Drag', position: 'Collar Sleeve Guard', type: 'Sweep', description: 'Pull opponent forward with collar grip', gi_type: 'gi' },
  { name: 'Scissor Sweep', position: 'Collar Sleeve Guard', type: 'Sweep', description: 'Classic sweep using collar sleeve control', gi_type: 'gi' },
  { name: 'Overhead Sweep', position: 'Collar Sleeve Guard', type: 'Sweep', description: 'Balloon sweep with collar sleeve grips', gi_type: 'gi' },
  { name: 'Tomoe Nage', position: 'Collar Sleeve Guard', type: 'Sweep', description: 'Sacrifice throw to sweep from collar sleeve', gi_type: 'gi' },
  { name: 'Back Take', position: 'Collar Sleeve Guard', type: 'Transition', description: 'Use collar drag to take the back', gi_type: 'gi' },
  { name: 'Lasso Transition', position: 'Collar Sleeve Guard', type: 'Transition', description: 'Transition to lasso guard from collar sleeve', gi_type: 'gi' },
  { name: 'Spider Transition', position: 'Collar Sleeve Guard', type: 'Transition', description: 'Move to spider guard from collar sleeve', gi_type: 'gi' },
  { name: 'De La Riva Transition', position: 'Collar Sleeve Guard', type: 'Transition', description: 'Transition to DLR from collar sleeve', gi_type: 'gi' },
  { name: 'Hip Bump Sweep', position: 'Collar Sleeve Guard', type: 'Sweep', description: 'Sit-up sweep with collar grip', gi_type: 'gi' },
  { name: 'Sickle Sweep', position: 'Collar Sleeve Guard', type: 'Sweep', description: 'Hook behind leg and sweep with collar control', gi_type: 'gi' },
  { name: 'Loop Choke', position: 'Collar Sleeve Guard', type: 'Submission', description: 'Collar choke when opponent postures', gi_type: 'gi' },
  { name: 'Collar Sleeve Retention', position: 'Collar Sleeve Guard', type: 'Defense', description: 'Maintaining grips and distance control', gi_type: 'gi' },
  { name: 'Foot on Hip Control', position: 'Collar Sleeve Guard', type: 'Setup', description: 'Using foot on hip to manage distance', gi_type: 'gi' },
  { name: 'Foot on Bicep Control', position: 'Collar Sleeve Guard', type: 'Setup', description: 'Bicep control with foot for attacks', gi_type: 'gi' },
];

async function seed() {
  // Clear existing techniques
  await prisma.technique.deleteMany();

  // Expand 'both' techniques into separate gi and nogi entries
  const expandedTechniques: { name: string; position: string; type: string; description: string | null; giType: string }[] = [];
  
  for (const tech of techniques) {
    if (tech.gi_type === 'both') {
      // Create two entries - one for gi and one for nogi
      expandedTechniques.push({
        name: tech.name,
        position: tech.position,
        type: tech.type,
        description: tech.description || null,
        giType: 'gi',
      });
      expandedTechniques.push({
        name: tech.name,
        position: tech.position,
        type: tech.type,
        description: tech.description || null,
        giType: 'nogi',
      });
    } else {
      // Keep gi-only or nogi-only techniques as is
      expandedTechniques.push({
        name: tech.name,
        position: tech.position,
        type: tech.type,
        description: tech.description || null,
        giType: tech.gi_type,
      });
    }
  }

  // Insert techniques
  await prisma.technique.createMany({
    data: expandedTechniques,
  });

  console.log(`✅ Seeded ${expandedTechniques.length} techniques (expanded from ${techniques.length} base techniques)`);

  // Show technique count by position
  const positionCounts = await prisma.technique.groupBy({
    by: ['position'],
    _count: true,
    orderBy: {
      position: 'asc',
    },
  });

  console.log('\nTechniques by position:');
  positionCounts.forEach((row) => {
    console.log(`  ${row.position}: ${row._count}`);
  });

  // Show technique count by type
  const typeCounts = await prisma.technique.groupBy({
    by: ['type'],
    _count: true,
    orderBy: {
      _count: {
        type: 'desc',
      },
    },
  });

  console.log('\nTechniques by type:');
  typeCounts.forEach((row) => {
    console.log(`  ${row.type}: ${row._count}`);
  });

  await prisma.$disconnect();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
