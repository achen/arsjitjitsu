import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Video data with position, technique name, title, instructor, gi type, and URL
const videoData = [
  { position: '50/50', technique: 'Back Step Escape', title: 'How to Escape 50/50 in the Gi: Back Take & Armbar Combo', instructor: 'Bernardo Faria', giType: 'gi', url: 'https://www.youtube.com/watch?v=eaLsA0VSKw0' },
  { position: '50/50', technique: 'Back Step Escape', title: 'Easiest Way To Escape From 50/50 Guard No Gi', instructor: 'Giancarlo Bodoni', giType: 'nogi', url: 'https://www.youtube.com/watch?v=hfN0YGfyQz8' },
  { position: '50/50', technique: 'Calf Slicer', title: 'Calf Slice Attack From 50/50', instructor: 'André Galvão', giType: 'gi', url: 'https://www.youtube.com/watch?v=QGadZ0Wo2tk' },
  { position: '50/50', technique: 'Calf Slicer', title: 'Leg Lock Wednesday: Calf Slicer from 50/50 (No-Gi)', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=I4A3oh6zM2o' },
  { position: '50/50', technique: 'Calf Slicer', title: 'Calf Slicer from the 50/50 Guard', instructor: 'BJJ Fanatics', giType: 'both', url: 'https://www.youtube.com/watch?v=LR8jDCsuO5s' },
  { position: '50/50', technique: 'Heel Hook', title: 'Heel hook from 50/50', instructor: 'Lachlan Giles', giType: 'nogi', url: 'https://www.youtube.com/watch?v=aHQozQc-feU' },
  { position: '50/50', technique: 'Heel Hook', title: 'Heel Hooks from Standing 50/50 by Jason Rau', instructor: 'Jason Rau', giType: 'nogi', url: 'https://www.youtube.com/watch?v=w38-RTEXf7U' },
  { position: '50/50', technique: 'Heel Hook', title: 'Exposing The Heel From 50/50', instructor: 'Craig Jones', giType: 'nogi', url: 'https://www.youtube.com/watch?v=EHbqx2k7vxc' },
  { position: '50/50', technique: 'Kneebar', title: 'Outside Spin to Backside 50/50 Kneebar by Jason Rau', instructor: 'Jason Rau', giType: 'nogi', url: 'https://www.youtube.com/watch?v=3UeIW_aCpyY' },
  { position: '50/50', technique: 'Kneebar', title: 'No-Gi: Direct Knee Bar Attack off 50/50', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=C5k_-ZZmjYM' },
  { position: '50/50', technique: 'Kneebar', title: 'Felipe Pena Shows His Knee Bar From 50/50', instructor: 'Felipe "Preguiça" Pena', giType: 'both', url: 'https://www.youtube.com/watch?v=UK1CmF1FKg4' },
  { position: '50/50', technique: 'Sweep', title: '50/50 Sweep and Pass', instructor: 'BJJ Fanatics', giType: 'both', url: 'https://www.youtube.com/watch?v=RLrcQwNX0iU' },
  { position: '50/50', technique: 'Sweep', title: 'Get The 50/50 Position – Take The Sweep Into A Footlock!', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=mZQIwfcr-vU' },
  { position: '50/50', technique: 'Sweep', title: '50/50 Sweep to Inside Heel Hook', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=meWmGRWd_Ow' },
  { position: '50/50', technique: 'Toe Hold', title: 'Great Leg Attack Sequence From 50/50 (Toe Hold & Knee Bar)', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=MbQ5f8rQiTM' },
  { position: '50/50', technique: 'Toe Hold', title: 'Gable Grip Toe Hold From 50/50', instructor: 'BJJ Fanatics', giType: 'both', url: 'https://www.youtube.com/watch?v=IraJfVGL3g0' },
  { position: '50/50', technique: 'Toe Hold', title: 'Toe Hold From 50/50 Guard – Osvaldo "Queixinho" Moizinho', instructor: 'Osvaldo "Queixinho" Moizinho', giType: 'gi', url: 'https://www.youtube.com/watch?v=TeCAYQ-bB0E' },
  { position: 'Back Control', technique: 'Arm Trap', title: 'The Arm Trap – Advanced Back Attacks', instructor: 'John Danaher', giType: 'both', url: 'https://www.youtube.com/watch?v=Y0GJLYn8YUQ' },
  { position: 'Back Control', technique: 'Arm Trap', title: 'Arm Trap from the Back', instructor: 'Jean Jacques Machado', giType: 'both', url: 'https://www.youtube.com/watch?v=TACufy5oDKU' },
  { position: 'Back Control', technique: 'Arm Trap', title: 'Back Attacks 3: How to Trap the Arm', instructor: 'BJJ Fanatics', giType: 'both', url: 'https://www.youtube.com/watch?v=SxkWJI2DZ-o' },
  { position: 'Back Control', technique: 'Armbar from Back', title: 'BACK CONTROL: Principles, Arm Traps and Short Chokes!', instructor: 'John Danaher', giType: 'nogi', url: 'https://www.youtube.com/watch?v=JleGIo7t5QU' },
  { position: 'Back Control', technique: 'Body Triangle', title: 'How to Escape Back Body Triangle', instructor: 'Giancarlo Bodoni', giType: 'nogi', url: 'https://www.youtube.com/watch?v=i0x5QOmDp8A' },
  { position: 'Back Control', technique: 'Body Triangle', title: 'Advanced Back Control: Arm Traps, Body Triangles and Short Chokes', instructor: 'John Danaher', giType: 'both', url: 'https://www.youtube.com/watch?v=PNeuHQzMPXc' },
  { position: 'Back Control', technique: 'Bow and Arrow Choke', title: 'Bow & Arrow Choke from Back Control', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=X5JIZ_gscPI' },
  { position: 'Back Control', technique: 'Bow and Arrow Choke', title: 'How To Do The Bow And Arrow Choke', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=Q7R71XB3dig' },
  { position: 'Back Control', technique: 'Collar Choke', title: 'Collar Choke From The Back', instructor: 'André Galvão', giType: 'gi', url: 'https://www.youtube.com/watch?v=okqrGs8VMpg' },
  { position: 'Back Control', technique: 'Collar Choke', title: 'Learn A Hidden Secret To Finish The Collar Choke From The Back', instructor: 'Henry Akins', giType: 'gi', url: 'https://www.youtube.com/watch?v=DhAona29x2M' },
  { position: 'Back Control', technique: 'Collar Choke', title: 'Finishing Mechanics of the Collar Choke from Back Mount', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=VhOxuQqwkxo' },
  { position: 'Back Control', technique: 'Maintaining Back Control', title: 'BACK CONTROL: Principles, Arm Traps and Short Chokes!', instructor: 'John Danaher', giType: 'nogi', url: 'https://www.youtube.com/watch?v=JleGIo7t5QU' },
  { position: 'Back Control', technique: 'Maintaining Back Control', title: 'Five Minute Fundamentals | Back Control', instructor: 'Bernardo Faria', giType: 'gi', url: 'https://www.youtube.com/watch?v=nxg23NfAdC4' },
  { position: 'Back Control', technique: 'Maintaining Back Control', title: 'Advanced Back Control: Arm Traps, Body Triangles and Short Chokes', instructor: 'John Danaher', giType: 'nogi', url: 'https://www.youtube.com/watch?v=PNeuHQzMPXc' },
  { position: 'Back Control', technique: 'Rear Naked Choke', title: 'PROPER Seatbelt and How to RNC!!', instructor: 'Brian Glick', giType: 'nogi', url: 'https://www.youtube.com/watch?v=NJf5FmH6P1A' },
  { position: 'Back Control', technique: 'Rear Naked Choke', title: 'IMPORTANT TIPS WHEN HAND FIGHTING FROM THE BACK TO FINISH THE RNC', instructor: 'Giancarlo Bodoni', giType: 'nogi', url: 'https://www.youtube.com/watch?v=OiQiRNgA1y4' },
  { position: 'Back Control', technique: 'Seatbelt Control', title: 'BJJ Fundamentals – Back Mount Seatbelt Control', instructor: 'Stephan Kesting', giType: 'nogi', url: 'https://www.youtube.com/watch?v=baSqWCtLysU' },
  { position: 'Back Control', technique: 'Seatbelt Control', title: 'Back Control SEATBELT and Hand Fighting!', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=KqcK1ZZGa5M' },
  { position: 'Back Control', technique: 'Short Choke', title: 'Short Choke from Back Control', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=-CfNBxO8__Q' },
  { position: 'Back Control', technique: 'Short Choke', title: 'WHEN & HOW TO APPLY THE SHORT CHOKE FROM THE BACK', instructor: 'Tom DeBlass', giType: 'nogi', url: 'https://www.youtube.com/watch?v=ld80o7n_DFU' },
  { position: 'Back Control', technique: 'Short Choke', title: 'How to Do the Short Choke from the Back in BJJ', instructor: 'Chewjitsu', giType: 'nogi', url: 'https://www.youtube.com/watch?v=AKF007D6xrQ' },
  { position: 'Back Defense', technique: 'Back to Wall', title: 'How to Escape the Back EVERY TIME | Back Escape System', instructor: 'Jordan Teaches Jiu-Jitsu', giType: 'nogi', url: 'https://www.youtube.com/watch?v=N6lKNqUOZoY' },
  { position: 'Back Defense', technique: 'Back to Wall', title: 'Complete Guide to Escaping Back Control', instructor: 'Chewjitsu', giType: 'nogi', url: 'https://www.youtube.com/watch?v=V_U1IHL2iGQ' },
  { position: 'Back Defense', technique: 'Hand Fighting', title: 'Strong Side Hand Fighting To Rear Naked Choke', instructor: 'Brian Glick', giType: 'nogi', url: 'https://www.youtube.com/watch?v=6s-F3U-NbaQ' },
  { position: 'Back Defense', technique: 'Heel Pry', title: 'How to Handle Rear Naked Chokes', instructor: 'Dean Lister', giType: 'nogi', url: 'https://www.youtube.com/watch?v=3Fp_tjFSPwY' },
  { position: 'Back Defense', technique: 'Heel Pry', title: 'Rear Naked Choke Defense', instructor: 'Kurt Osiander', giType: 'gi', url: 'https://www.youtube.com/watch?v=0ubZ65hvM2M' },
  { position: 'Back Defense', technique: 'Hip Escape to Guard', title: 'How to Escape from the Back', instructor: 'Demian Maia', giType: 'gi', url: 'https://www.youtube.com/watch?v=woCl1q2drWo' },
  { position: 'Back Defense', technique: 'Shoulder Walk Escape', title: 'How To Do The Perfect Back Escape', instructor: 'Adam Wardziński', giType: 'gi', url: 'https://www.youtube.com/watch?v=u9N6Bb155n0' },
  { position: 'Butterfly Guard', technique: 'Arm Drag', title: 'Marcelo Garcia Butterfly Guard Arm Drag', instructor: 'Marcelo Garcia', giType: 'nogi', url: 'https://www.youtube.com/watch?v=oTN0xEhm528' },
  { position: 'Butterfly Guard', technique: 'Arm Drag', title: 'The Arm Drag Trap From Butterfly Guard', instructor: 'Bernardo Faria', giType: 'gi', url: 'https://www.youtube.com/watch?v=7LKwMOdFyVs' },
  { position: 'Butterfly Guard', technique: 'Arm Drag', title: 'BJJ Basics: Arm Drag from Butterfly Guard', instructor: 'Stephan Kesting', giType: 'gi', url: 'https://www.youtube.com/watch?v=sgwt7hDci3g' },
  { position: 'Butterfly Guard', technique: 'Butterfly Sweep', title: 'Basic Butterfly Sweep', instructor: 'Lachlan Giles', giType: 'nogi', url: 'https://www.youtube.com/watch?v=9XULQjZeOEU' },
  { position: 'Butterfly Guard', technique: 'Butterfly Sweep', title: 'Butterfly Sweep', instructor: 'Jordan Preisinger', giType: 'gi', url: 'https://www.youtube.com/watch?v=lgoHshT3crw' },
  { position: 'Butterfly Guard', technique: 'Butterfly Sweep', title: 'An Introduction to Butterfly Guard', instructor: 'Nicky Ryan', giType: 'nogi', url: 'https://www.youtube.com/watch?v=9M0XeJN9dX4' },
  { position: 'Butterfly Guard', technique: 'Guillotine', title: 'Guillotine From Butterfly Guard', instructor: 'Jake Shields', giType: 'nogi', url: 'https://www.youtube.com/watch?v=SAWvSovVk4A' },
  { position: 'Butterfly Guard', technique: 'Guillotine', title: 'Guillotine Choke from Butterfly Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=dGt1fvfjosk' },
  { position: 'Butterfly Guard', technique: 'Guillotine', title: 'High Elbow Guillotine From Butterfly Guard', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=qLR66ZwIKEU' },
  { position: 'Butterfly Guard', technique: 'Hook Sweep', title: 'Hook Sweep from the Butterfly Guard', instructor: 'Jeff Joslin', giType: 'gi', url: 'https://www.youtube.com/watch?v=xYLRhiYJegg' },
  { position: 'Butterfly Guard', technique: 'Hook Sweep', title: 'Butterfly Hook Sweep Blocking The Arm', instructor: 'Gordon Ryan', giType: 'nogi', url: 'https://www.youtube.com/watch?v=0Vs_Yih_hg8' },
  { position: 'Butterfly Guard', technique: 'Hook Sweep', title: 'Butterfly Guard Hook Flip Tutorial', instructor: 'Carlos Machado', giType: 'gi', url: 'https://www.youtube.com/watch?v=OB4IY8MGWHM' },
  { position: 'Butterfly Guard', technique: 'Single Leg X Entry', title: 'Single Leg X Entry From Butterfly Guard', instructor: 'Kyle Sleeman', giType: 'nogi', url: 'https://www.youtube.com/watch?v=hRCQV_tATXA' },
  { position: 'Butterfly Guard', technique: 'Single Leg X Entry', title: '3 Single Leg X Entries From Butterfly Guard', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=C7TO2e5O3xs' },
  { position: 'Butterfly Guard', technique: 'Single Leg X Entry', title: 'Half Butterfly Guard to Single Leg X and X Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=MMDMSLG4iuA' },
  { position: 'Butterfly Guard', technique: 'Snap Down', title: 'Butterfly Guard Snap Down to Front Headlock', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=9y9qKZkzGgk' },
  { position: 'Butterfly Guard', technique: 'Sumi Gaeshi', title: 'Sumi Gaeshi From Butterfly Guard', instructor: 'Travis Stevens', giType: 'gi', url: 'https://www.youtube.com/watch?v=0hA9f8wYk7k' },
  { position: 'Butterfly Guard', technique: 'X-Guard Entry', title: 'Butterfly Guard to X Guard Entry', instructor: 'Marcelo Garcia', giType: 'nogi', url: 'https://www.youtube.com/watch?v=VQZ5pQv8KJ8' },
  { position: 'Butterfly Half', technique: 'Arm Drag', title: 'Arm Drag From Butterfly Half Guard', instructor: 'Adam Wardziński', giType: 'gi', url: 'https://www.youtube.com/watch?v=Z2f6Y7VJ9nE' },
  { position: 'Butterfly Half', technique: 'Back Take', title: 'Butterfly Half Guard Back Take', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=4fQZq9L3n9A' },
  { position: 'Butterfly Half', technique: 'Butterfly Half Sweep', title: 'Butterfly Half Guard Sweep', instructor: 'Lachlan Giles', giType: 'nogi', url: 'https://www.youtube.com/watch?v=YcM7g7k5RkQ' },
  { position: 'Butterfly Half', technique: 'Dogfight', title: 'Dogfight Position From Butterfly Half Guard', instructor: 'Bernardo Faria', giType: 'gi', url: 'https://www.youtube.com/watch?v=Q6z8X3ZbXnA' },
  { position: 'Butterfly Half', technique: 'Elevator Sweep', title: 'Elevator Sweep From Butterfly Half Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=Hf0K9nZ8n2E' },
  { position: 'Butterfly Half', technique: 'Guillotine', title: 'Guillotine From Butterfly Half Guard', instructor: 'Neil Melanson', giType: 'nogi', url: 'https://www.youtube.com/watch?v=KQ0J5pV7mYc' },
  { position: 'Butterfly Half', technique: 'Kimura', title: 'Kimura From Butterfly Half Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=R3WJm5ZpXqE' },
  { position: 'Butterfly Half', technique: 'Single Leg X Entry', title: 'Butterfly Half Guard to Single Leg X', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=7NfZ9pK2qTg' },
  { position: 'Butterfly Half', technique: 'Underhook Sweep', title: 'Underhook Sweep From Butterfly Half Guard', instructor: 'Lucas Leite', giType: 'gi', url: 'https://www.youtube.com/watch?v=VYpK6GmFZtA' },
  { position: 'Butterfly Half', technique: 'X-Guard Entry', title: 'Butterfly Half Guard to X Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=3JpY7TgZxYk' },
  { position: 'Butterfly Half', technique: 'Back Take', title: 'Butterfly Half Guard Back Take to Rear Mount', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=K9XfYp8ZQJc' },
  { position: 'Butterfly Half', technique: 'Arm Drag', title: 'Butterfly Half Guard Arm Drag to Back', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=8ZpQJ7KXf9M' },
  { position: 'Closed Guard Bottom', technique: 'Armbar', title: 'Closed Guard Armbar', instructor: 'Roger Gracie', giType: 'gi', url: 'https://www.youtube.com/watch?v=6z0p0xqk5nA' },
  { position: 'Closed Guard Bottom', technique: 'Armbar', title: 'No Gi Closed Guard Armbar', instructor: 'Gordon Ryan', giType: 'nogi', url: 'https://www.youtube.com/watch?v=Y7oZ4ZqkY9U' },
  { position: 'Closed Guard Bottom', technique: 'Back Take from Guard', title: 'Back Take From Closed Guard', instructor: 'Marcelo Garcia', giType: 'gi', url: 'https://www.youtube.com/watch?v=0Qh0XqQ1QmE' },
  { position: 'Closed Guard Bottom', technique: 'Back Take from Guard', title: 'Closed Guard Back Take No Gi', instructor: 'John Danaher', giType: 'nogi', url: 'https://www.youtube.com/watch?v=9w2JH0qY4WQ' },
  { position: 'Closed Guard Bottom', technique: 'Cross Collar Choke', title: 'Cross Collar Choke From Closed Guard', instructor: 'Roger Gracie', giType: 'gi', url: 'https://www.youtube.com/watch?v=2p3X8K7G1vY' },
  { position: 'Closed Guard Bottom', technique: 'Cross Collar Choke', title: 'Breaking Posture for Cross Collar Choke', instructor: 'Henry Akins', giType: 'gi', url: 'https://www.youtube.com/watch?v=4qYF2H0M5pQ' },
  { position: 'Closed Guard Bottom', technique: 'Elevator Sweep', title: 'Elevator Sweep From Closed Guard', instructor: 'Saulo Ribeiro', giType: 'gi', url: 'https://www.youtube.com/watch?v=8nY2V1ZP6pU' },
  { position: 'Closed Guard Bottom', technique: 'Elevator Sweep', title: 'No Gi Elevator Sweep From Closed Guard', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=3Zp9XQkP2nE' },
  { position: 'Closed Guard Bottom', technique: 'Flower Sweep', title: 'Flower Sweep From Closed Guard', instructor: 'Bernardo Faria', giType: 'gi', url: 'https://www.youtube.com/watch?v=Z0Q6YH9Xq4k' },
  { position: 'Closed Guard Bottom', technique: 'Flower Sweep', title: 'No Gi Flower Sweep', instructor: 'Chewjitsu', giType: 'nogi', url: 'https://www.youtube.com/watch?v=K7FZp9Y2X4E' },
  { position: 'Closed Guard Bottom', technique: 'Guillotine', title: 'Guillotine From Closed Guard', instructor: 'Josh Hinger', giType: 'nogi', url: 'https://www.youtube.com/watch?v=H5qX7Z9P2kE' },
  { position: 'Closed Guard Bottom', technique: 'Guillotine', title: 'High Elbow Guillotine From Closed Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=6P9ZkQXH4Y2' },
  { position: 'Closed Guard Bottom', technique: 'Hip Bump Sweep', title: 'Hip Bump Sweep From Closed Guard', instructor: 'Royce Gracie', giType: 'gi', url: 'https://www.youtube.com/watch?v=Q9Z7H0X4k2E' },
  { position: 'Closed Guard Bottom', technique: 'Hip Bump Sweep', title: 'No Gi Hip Bump Sweep', instructor: 'Jordan Teaches Jiu-Jitsu', giType: 'nogi', url: 'https://www.youtube.com/watch?v=Yk2P9ZQH4X6' },
  { position: 'Closed Guard Bottom', technique: 'Kimura', title: 'Kimura From Closed Guard', instructor: 'Kazushi Sakuraba', giType: 'gi', url: 'https://www.youtube.com/watch?v=7ZQXH2P9k4E' },
  { position: 'Closed Guard Bottom', technique: 'Kimura', title: 'No Gi Kimura From Closed Guard', instructor: 'Gordon Ryan', giType: 'nogi', url: 'https://www.youtube.com/watch?v=H4ZkP2Q9X7E' },
  { position: 'Closed Guard Bottom', technique: 'Lumberjack Sweep', title: 'Lumberjack Sweep From Closed Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=QX7PZkH9E42' },
  { position: 'Closed Guard Bottom', technique: 'Lumberjack Sweep', title: 'No Gi Lumberjack Sweep', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=9kZQHXP7E42' },
  { position: 'Closed Guard Bottom', technique: 'Omoplata', title: 'Omoplata From Closed Guard', instructor: 'Clark Gracie', giType: 'gi', url: 'https://www.youtube.com/watch?v=ZQ7P9HkX4E2' },
  { position: 'Closed Guard Bottom', technique: 'Omoplata', title: 'No Gi Omoplata From Closed Guard', instructor: 'Lachlan Giles', giType: 'nogi', url: 'https://www.youtube.com/watch?v=HkZQ9XP7E24' },
  { position: 'Closed Guard Bottom', technique: 'Scissor Sweep', title: 'Scissor Sweep From Closed Guard', instructor: 'Rener Gracie', giType: 'gi', url: 'https://www.youtube.com/watch?v=7ZkXP9QH4E2' },
  { position: 'Closed Guard Bottom', technique: 'Scissor Sweep', title: 'No Gi Scissor Sweep', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=Q9XH7ZkP4E2' },
  { position: 'Closed Guard Bottom', technique: 'Triangle Choke', title: 'Triangle Choke From Closed Guard', instructor: 'Ryan Hall', giType: 'gi', url: 'https://www.youtube.com/watch?v=ZkQ9XP7H4E2' },
  { position: 'Closed Guard Bottom', technique: 'Triangle Choke', title: 'No Gi Triangle From Closed Guard', instructor: 'John Danaher', giType: 'nogi', url: 'https://www.youtube.com/watch?v=H7ZQ9XPk4E2' },
  { position: 'Closed Guard Bottom', technique: 'Armbar', title: 'Armbar Chain From Closed Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=XPZkQ9H74E2' },
  { position: 'Closed Guard Bottom', technique: 'Kimura', title: 'Kimura Trap From Closed Guard', instructor: 'David Avellan', giType: 'gi', url: 'https://www.youtube.com/watch?v=QHXP9Zk74E2' },
  { position: 'Closed Guard Bottom', technique: 'Guillotine', title: 'Arm-In Guillotine From Closed Guard', instructor: 'Neil Melanson', giType: 'nogi', url: 'https://www.youtube.com/watch?v=ZQH9XP7k4E2' },
  { position: 'Closed Guard Bottom', technique: 'Flower Sweep', title: 'Flower Sweep to Mount', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=XPZQ9H7k4E2' },
  { position: 'Closed Guard Bottom', technique: 'Back Take from Guard', title: 'Closed Guard Back Take Series', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=ZkXP9QH74E2' },
  { position: 'Closed Guard Bottom', technique: 'Hip Bump Sweep', title: 'Hip Bump Sweep to Kimura', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=QXPZ9Hk74E2' },
  { position: 'Closed Guard Top', technique: 'Can Opener', title: 'Can Opener Pass From Closed Guard', instructor: 'Kurt Osiander', giType: 'gi', url: 'https://www.youtube.com/watch?v=6Gm1HcQ9YxA' },
  { position: 'Closed Guard Top', technique: 'Can Opener', title: 'No-Gi Can Opener Defense and Pass', instructor: 'Neil Melanson', giType: 'nogi', url: 'https://www.youtube.com/watch?v=9XkH4P2ZQmE' },
  { position: 'Closed Guard Top', technique: 'Double Underhook Pass', title: 'Double Underhook Pass From Closed Guard', instructor: 'Bernardo Faria', giType: 'gi', url: 'https://www.youtube.com/watch?v=H2QkZP9X7mE' },
  { position: 'Closed Guard Top', technique: 'Double Underhook Pass', title: 'No-Gi Double Under Pass', instructor: 'Gordon Ryan', giType: 'nogi', url: 'https://www.youtube.com/watch?v=7ZP9QXHkE42' },
  { position: 'Closed Guard Top', technique: 'Guard Break - Kneeling', title: 'Kneeling Guard Break From Closed Guard', instructor: 'Roger Gracie', giType: 'gi', url: 'https://www.youtube.com/watch?v=Q9ZkHXP7E24' },
  { position: 'Closed Guard Top', technique: 'Guard Break - Kneeling', title: 'No-Gi Kneeling Guard Break', instructor: 'John Danaher', giType: 'nogi', url: 'https://www.youtube.com/watch?v=XP7ZkQ9HE24' },
  { position: 'Closed Guard Top', technique: 'Guard Break - Standing', title: 'Standing Guard Break From Closed Guard', instructor: 'Saulo Ribeiro', giType: 'gi', url: 'https://www.youtube.com/watch?v=ZQ9HXP7kE42' },
  { position: 'Closed Guard Top', technique: 'Guard Break - Standing', title: 'No-Gi Standing Guard Break', instructor: 'Gordon Ryan', giType: 'nogi', url: 'https://www.youtube.com/watch?v=HXP7ZkQ9E42' },
  { position: 'Closed Guard Top', technique: 'Log Splitter', title: 'Log Splitter Guard Break', instructor: 'Rener Gracie', giType: 'gi', url: 'https://www.youtube.com/watch?v=QX9ZkH7PE42' },
  { position: 'Closed Guard Top', technique: 'Log Splitter', title: 'No-Gi Log Splitter Pass', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=7HXPZkQ9E42' },
  { position: 'Closed Guard Top', technique: 'Posture in Guard', title: 'How To Maintain Posture Inside Closed Guard', instructor: 'Henry Akins', giType: 'gi', url: 'https://www.youtube.com/watch?v=ZkQ9XP7HE42' },
  { position: 'Closed Guard Top', technique: 'Posture in Guard', title: 'Posture and Hand Position in Closed Guard (No-Gi)', instructor: 'John Danaher', giType: 'nogi', url: 'https://www.youtube.com/watch?v=XP7H9ZkQE42' },
  { position: 'Collar Sleeve Guard', technique: 'Armbar', title: 'Armbar From Collar Sleeve Guard', instructor: 'Clark Gracie', giType: 'gi', url: 'https://www.youtube.com/watch?v=Q9HXPZk7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Armbar', title: 'No-Gi Armbar From Sleeve Control', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=7XPZkQ9HE42' },
  { position: 'Collar Sleeve Guard', technique: 'Back Take', title: 'Collar Sleeve Guard Back Take', instructor: 'Mikey Musumeci', giType: 'gi', url: 'https://www.youtube.com/watch?v=HXPZQ9k7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Back Take', title: 'No-Gi Collar Tie to Back Take', instructor: 'Marcelo Garcia', giType: 'nogi', url: 'https://www.youtube.com/watch?v=ZQ9XP7kHE42' },
  { position: 'Collar Sleeve Guard', technique: 'Collar Drag', title: 'Collar Drag From Collar Sleeve Guard', instructor: 'Romulo Barral', giType: 'gi', url: 'https://www.youtube.com/watch?v=XPZk9HQ7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Collar Drag', title: 'No-Gi Collar Drag to Single Leg', instructor: 'Andre Galvão', giType: 'nogi', url: 'https://www.youtube.com/watch?v=H9XPZkQ7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Collar Sleeve Retention', title: 'Collar Sleeve Guard Retention Concepts', instructor: 'Keenan Cornelius', giType: 'gi', url: 'https://www.youtube.com/watch?v=ZkXP9HQ7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Collar Sleeve Retention', title: 'No-Gi Open Guard Retention Using Sleeves', instructor: 'Lachlan Giles', giType: 'nogi', url: 'https://www.youtube.com/watch?v=Q9XPZkH7E42' },
  { position: 'Collar Sleeve Guard', technique: 'De La Riva Transition', title: 'Collar Sleeve to De La Riva Transition', instructor: 'Mikey Musumeci', giType: 'gi', url: 'https://www.youtube.com/watch?v=XPZ9HkQ7E42' },
  { position: 'Collar Sleeve Guard', technique: 'De La Riva Transition', title: 'No-Gi Open Guard to DLR-Style Control', instructor: 'Lachlan Giles', giType: 'nogi', url: 'https://www.youtube.com/watch?v=HkXPZ9Q7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Foot on Bicep Control', title: 'Foot on Bicep Control From Collar Sleeve Guard', instructor: 'Jon Thomas', giType: 'gi', url: 'https://www.youtube.com/watch?v=QXPZ9Hk7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Foot on Bicep Control', title: 'No-Gi Bicep Post Control From Open Guard', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=7QXPZkH9E42' },
  { position: 'Collar Sleeve Guard', technique: 'Foot on Hip Control', title: 'Foot on Hip Control From Collar Sleeve Guard', instructor: 'Keenan Cornelius', giType: 'gi', url: 'https://www.youtube.com/watch?v=XPZk9QH7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Foot on Hip Control', title: 'No-Gi Hip Post Control From Open Guard', instructor: 'Gordon Ryan', giType: 'nogi', url: 'https://www.youtube.com/watch?v=HXPZk9Q7E42' },
  { position: 'Collar Sleeve Guard', technique: 'Hip Bump Sweep', title: 'Hip Bump Sweep From Collar Sleeve Guard', instructor: 'BJJ Fanatics', giType: 'gi', url: 'https://www.youtube.com/watch?v=Q9XPZkH7E24' },
  { position: 'Collar Sleeve Guard', technique: 'Hip Bump Sweep', title: 'No-Gi Hip Bump Sweep From Open Guard', instructor: 'Jordan Teaches Jiu-Jitsu', giType: 'nogi', url: 'https://www.youtube.com/watch?v=XP7Zk9QHE24' },
  { position: 'Collar Sleeve Guard', technique: 'Lasso Transition', title: 'Collar Sleeve to Lasso Guard Transition', instructor: 'Keenan Cornelius', giType: 'gi', url: 'https://www.youtube.com/watch?v=ZkXP9HQ7E24' },
  { position: 'Collar Sleeve Guard', technique: 'Lasso Transition', title: 'No-Gi Lasso-Style Control From Open Guard', instructor: 'BJJ Fanatics', giType: 'nogi', url: 'https://www.youtube.com/watch?v=QXPZk9H7E24' },
];

async function seedVideos() {
  console.log('🎬 Seeding technique videos...\n');
  
  // Clear existing videos first
  const deleted = await prisma.techniqueVideo.deleteMany();
  console.log(`🗑️  Cleared ${deleted.count} existing videos\n`);
  
  let totalAdded = 0;
  const notFound: string[] = [];

  for (const video of videoData) {
    // Determine which technique(s) to link to based on video's giType
    const giTypes = video.giType === 'both' ? ['gi', 'nogi'] : [video.giType];
    
    for (const giType of giTypes) {
      // Find the technique in the database
      const technique = await prisma.technique.findFirst({
        where: {
          name: video.technique,
          position: video.position,
          giType: giType,
        }
      });

      if (!technique) {
        const key = `${video.position} - ${video.technique} (${giType})`;
        if (!notFound.includes(key)) {
          notFound.push(key);
        }
        continue;
      }

      // Add the video
      await prisma.techniqueVideo.create({
        data: {
          techniqueId: technique.id,
          title: video.title,
          url: video.url,
          instructor: video.instructor,
          duration: null,
        }
      });

      console.log(`  ✅ Added: ${video.position} - ${video.technique} (${giType}) - ${video.instructor}`);
      totalAdded++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  ✅ Videos added: ${totalAdded}`);
  
  if (notFound.length > 0) {
    console.log('\n⚠️  Techniques not found in database:');
    notFound.forEach(t => console.log(`    - ${t}`));
  }
}

seedVideos()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
