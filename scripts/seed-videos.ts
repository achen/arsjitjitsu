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
  { techniqueName: 'Ezekiel Choke', position: 'Mount Top', videos: [
    { title: 'Ezekiel Choke from Mount', url: 'https://www.youtube.com/watch?v=qVTfJxTNyT8', instructor: 'Bernardo Faria', duration: '7:30' },
    { title: 'No Gi Ezekiel Details', url: 'https://www.youtube.com/watch?v=9oJ1-GWwWKU', instructor: 'Firas Zahabi', duration: '10:00' },
  ]},
  { techniqueName: 'S-Mount Armbar', position: 'Mount Top', videos: [
    { title: 'S-Mount Armbar Complete System', url: 'https://www.youtube.com/watch?v=nL4qYwsheHQ', instructor: 'John Danaher', duration: '18:00' },
  ]},
  { techniqueName: 'Arm Triangle', position: 'Mount Top', videos: [
    { title: 'Arm Triangle from Mount', url: 'https://www.youtube.com/watch?v=8G7HhvPZYvQ', instructor: 'Renzo Gracie', duration: '9:45' },
  ]},
  { techniqueName: 'Gift Wrap', position: 'Mount Top', videos: [
    { title: 'Gift Wrap Control and Attacks', url: 'https://www.youtube.com/watch?v=dAizO8mCT00', instructor: 'Keenan Cornelius', duration: '11:00' },
  ]},
  { techniqueName: 'Technical Mount', position: 'Mount Top', videos: [
    { title: 'Technical Mount Mastery', url: 'https://www.youtube.com/watch?v=hn_ofBbHHPQ', instructor: 'Andre Galvao', duration: '8:30' },
  ]},
  { techniqueName: 'Maintaining Mount', position: 'Mount Top', videos: [
    { title: 'How to Maintain Mount Position', url: 'https://www.youtube.com/watch?v=0FKcm6jvv6s', instructor: 'Xande Ribeiro', duration: '12:00' },
  ]},

  // Mount Bottom
  { techniqueName: 'Upa (Bridge and Roll)', position: 'Mount Bottom', videos: [
    { title: 'Upa Escape - Fundamentals', url: 'https://www.youtube.com/watch?v=2KVQM7sYrMQ', instructor: 'Rener Gracie', duration: '6:45' },
    { title: 'Bridge and Roll Details', url: 'https://www.youtube.com/watch?v=MC9VJucrnYo', instructor: 'Bernardo Faria', duration: '9:12' },
  ]},
  { techniqueName: 'Elbow-Knee Escape', position: 'Mount Bottom', videos: [
    { title: 'Elbow Knee Escape from Mount', url: 'https://www.youtube.com/watch?v=EMEueexp9zU', instructor: 'John Danaher', duration: '11:30' },
  ]},
  { techniqueName: 'Trap and Roll', position: 'Mount Bottom', videos: [
    { title: 'Trap and Roll Escape Basics', url: 'https://www.youtube.com/watch?v=C2sCjjpHnsg', instructor: 'Gracie Academy', duration: '8:00' },
  ]},
  { techniqueName: 'Heel Drag Escape', position: 'Mount Bottom', videos: [
    { title: 'Heel Drag Mount Escape', url: 'https://www.youtube.com/watch?v=GOgQwsDqWWA', instructor: 'Lachlan Giles', duration: '6:30' },
  ]},
  { techniqueName: 'Kipping Escape', position: 'Mount Bottom', videos: [
    { title: 'Kipping Mount Escape Details', url: 'https://www.youtube.com/watch?v=yTRBW0dS6jI', instructor: 'Priit Mihkelson', duration: '10:00' },
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
  { techniqueName: 'Armbar', position: 'Side Control Top', videos: [
    { title: 'Spinning Armbar from Side Control', url: 'https://www.youtube.com/watch?v=Xqd_tHqjb8Y', instructor: 'Andre Galvao', duration: '9:00' },
  ]},
  { techniqueName: 'Bread Cutter Choke', position: 'Side Control Top', videos: [
    { title: 'Bread Cutter Choke Tutorial', url: 'https://www.youtube.com/watch?v=XzawvMAOYRc', instructor: 'Magid Hage', duration: '7:00' },
  ]},
  { techniqueName: 'Baseball Bat Choke', position: 'Side Control Top', videos: [
    { title: 'Baseball Bat Choke System', url: 'https://www.youtube.com/watch?v=kN1Ey4jSFl0', instructor: 'Magid Hage', duration: '12:00' },
  ]},
  { techniqueName: 'Arm Triangle', position: 'Side Control Top', videos: [
    { title: 'Arm Triangle from Side Control', url: 'https://www.youtube.com/watch?v=mQ2AvRWgz5s', instructor: 'John Danaher', duration: '20:00' },
  ]},
  { techniqueName: 'Mount Transition', position: 'Side Control Top', videos: [
    { title: 'Side Control to Mount', url: 'https://www.youtube.com/watch?v=eDG6bJCbKO4', instructor: 'Stephan Kesting', duration: '8:00' },
  ]},
  { techniqueName: 'Knee on Belly', position: 'Side Control Top', videos: [
    { title: 'Knee on Belly Fundamentals', url: 'https://www.youtube.com/watch?v=MmQPQ-F2e0Y', instructor: 'Saulo Ribeiro', duration: '10:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Side Control Top', videos: [
    { title: 'Taking the Back from Side Control', url: 'https://www.youtube.com/watch?v=VCWvLNh0d1E', instructor: 'Marcelo Garcia', duration: '8:30' },
  ]},

  // Side Control Bottom
  { techniqueName: 'Elbow-Knee Escape', position: 'Side Control Bottom', videos: [
    { title: 'Side Control Escape - Elbow Knee', url: 'https://www.youtube.com/watch?v=V7vmzcc3ldA', instructor: 'Priit Mihkelson', duration: '15:00' },
  ]},
  { techniqueName: 'Ghost Escape', position: 'Side Control Bottom', videos: [
    { title: 'Ghost Escape from Side Control', url: 'https://www.youtube.com/watch?v=v3_PNXhqN10', instructor: 'Lachlan Giles', duration: '8:45' },
  ]},
  { techniqueName: 'Running Escape', position: 'Side Control Bottom', videos: [
    { title: 'Running Escape System', url: 'https://www.youtube.com/watch?v=Q3vRdGbwmqY', instructor: 'Priit Mihkelson', duration: '18:00' },
  ]},
  { techniqueName: 'Frame and Hip Escape', position: 'Side Control Bottom', videos: [
    { title: 'Framing and Hip Escape', url: 'https://www.youtube.com/watch?v=oLOe0p8uJKE', instructor: 'Rener Gracie', duration: '10:00' },
  ]},
  { techniqueName: 'Underhook Escape', position: 'Side Control Bottom', videos: [
    { title: 'Underhook Escape to Knees', url: 'https://www.youtube.com/watch?v=p3Gf1DRqRBs', instructor: 'Bernardo Faria', duration: '8:00' },
  ]},
  { techniqueName: 'Guard Recovery', position: 'Side Control Bottom', videos: [
    { title: 'Guard Recovery from Side Control', url: 'https://www.youtube.com/watch?v=F4rPLsiU2TU', instructor: 'Xande Ribeiro', duration: '12:00' },
  ]},

  // Back Control
  { techniqueName: 'Rear Naked Choke', position: 'Back Control', videos: [
    { title: 'Rear Naked Choke - Complete System', url: 'https://www.youtube.com/watch?v=3T2HhOC5OvY', instructor: 'John Danaher', duration: '25:00' },
    { title: 'RNC Details You Need to Know', url: 'https://www.youtube.com/watch?v=G_UVUhqqcDI', instructor: 'Gordon Ryan', duration: '12:30' },
  ]},
  { techniqueName: 'Bow and Arrow Choke', position: 'Back Control', videos: [
    { title: 'Bow and Arrow Choke Tutorial', url: 'https://www.youtube.com/watch?v=n3Hv_5jJTjA', instructor: 'Roger Gracie', duration: '9:15' },
  ]},
  { techniqueName: 'Collar Choke', position: 'Back Control', videos: [
    { title: 'Sliding Collar Choke from Back', url: 'https://www.youtube.com/watch?v=h8Hd0UWMELY', instructor: 'Roger Gracie', duration: '7:00' },
  ]},
  { techniqueName: 'Armbar from Back', position: 'Back Control', videos: [
    { title: 'Armbar from Back Control', url: 'https://www.youtube.com/watch?v=P0YCQfE0-Ug', instructor: 'Renzo Gracie', duration: '10:00' },
  ]},
  { techniqueName: 'Body Triangle', position: 'Back Control', videos: [
    { title: 'Body Triangle Control System', url: 'https://www.youtube.com/watch?v=Kg7O5paY3gA', instructor: 'Gordon Ryan', duration: '15:00' },
  ]},
  { techniqueName: 'Seatbelt Control', position: 'Back Control', videos: [
    { title: 'Seatbelt Grip Fundamentals', url: 'https://www.youtube.com/watch?v=9RJa9nXfnPQ', instructor: 'John Danaher', duration: '12:00' },
  ]},
  { techniqueName: 'Maintaining Back Control', position: 'Back Control', videos: [
    { title: 'How to Keep the Back', url: 'https://www.youtube.com/watch?v=mDxeVRh7sRI', instructor: 'Marcelo Garcia', duration: '14:00' },
  ]},

  // Back Defense
  { techniqueName: 'Hand Fighting', position: 'Back Defense', videos: [
    { title: 'Back Defense Hand Fighting', url: 'https://www.youtube.com/watch?v=BWitv9AKoNU', instructor: 'Danaher', duration: '18:00' },
  ]},
  { techniqueName: 'Hip Escape to Guard', position: 'Back Defense', videos: [
    { title: 'Escaping to Guard from Back', url: 'https://www.youtube.com/watch?v=1E3vdkUgLjQ', instructor: 'Stephan Kesting', duration: '10:00' },
  ]},
  { techniqueName: 'Shoulder Walk Escape', position: 'Back Defense', videos: [
    { title: 'Shoulder Walk Back Escape', url: 'https://www.youtube.com/watch?v=0eJCpG8n7YI', instructor: 'Priit Mihkelson', duration: '12:00' },
  ]},
  { techniqueName: 'Heel Pry', position: 'Back Defense', videos: [
    { title: 'Heel Pry to Remove Hooks', url: 'https://www.youtube.com/watch?v=ub6s3QrqL1g', instructor: 'Lachlan Giles', duration: '8:00' },
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
  { techniqueName: 'Kimura', position: 'Closed Guard Bottom', videos: [
    { title: 'Kimura from Closed Guard', url: 'https://www.youtube.com/watch?v=j7aESlfqzCY', instructor: 'Bernardo Faria', duration: '9:00' },
  ]},
  { techniqueName: 'Guillotine', position: 'Closed Guard Bottom', videos: [
    { title: 'Guillotine from Guard', url: 'https://www.youtube.com/watch?v=jFHs9Y8-j1I', instructor: 'Marcelo Garcia', duration: '11:00' },
  ]},
  { techniqueName: 'Cross Collar Choke', position: 'Closed Guard Bottom', videos: [
    { title: 'Cross Collar Choke from Guard', url: 'https://www.youtube.com/watch?v=zTgV2P8lrDA', instructor: 'Roger Gracie', duration: '7:30' },
  ]},
  { techniqueName: 'Flower Sweep', position: 'Closed Guard Bottom', videos: [
    { title: 'Flower Sweep Tutorial', url: 'https://www.youtube.com/watch?v=HBZoQdJ8Yl4', instructor: 'Stephan Kesting', duration: '8:00' },
  ]},
  { techniqueName: 'Elevator Sweep', position: 'Closed Guard Bottom', videos: [
    { title: 'Elevator Sweep from Guard', url: 'https://www.youtube.com/watch?v=y4qxLFwQBH0', instructor: 'Rener Gracie', duration: '6:00' },
  ]},
  { techniqueName: 'Back Take from Guard', position: 'Closed Guard Bottom', videos: [
    { title: 'Back Take from Closed Guard', url: 'https://www.youtube.com/watch?v=1BjjxnDk0lA', instructor: 'Marcelo Garcia', duration: '10:00' },
  ]},

  // Closed Guard Top
  { techniqueName: 'Guard Break - Standing', position: 'Closed Guard Top', videos: [
    { title: 'Standing Guard Break', url: 'https://www.youtube.com/watch?v=y4aGLDqw03Q', instructor: 'Andre Galvao', duration: '10:00' },
  ]},
  { techniqueName: 'Guard Break - Kneeling', position: 'Closed Guard Top', videos: [
    { title: 'Kneeling Guard Break', url: 'https://www.youtube.com/watch?v=qkFZn0pkRJM', instructor: 'Bernardo Faria', duration: '8:00' },
  ]},
  { techniqueName: 'Double Underhook Pass', position: 'Closed Guard Top', videos: [
    { title: 'Double Under Stack Pass', url: 'https://www.youtube.com/watch?v=qPBBNb0EaGQ', instructor: 'Tozi', duration: '12:00' },
  ]},
  { techniqueName: 'Posture in Guard', position: 'Closed Guard Top', videos: [
    { title: 'Maintaining Posture in Guard', url: 'https://www.youtube.com/watch?v=1p_Gg4m3pZA', instructor: 'Rener Gracie', duration: '9:00' },
  ]},

  // Half Guard Top
  { techniqueName: 'Knee Slice Pass', position: 'Half Guard Top', videos: [
    { title: 'Knee Slice Pass Complete Guide', url: 'https://www.youtube.com/watch?v=N1FmEz-eS2g', instructor: 'Andre Galvao', duration: '15:00' },
    { title: 'Knee Cut Details', url: 'https://www.youtube.com/watch?v=6VpvCfWGGLo', instructor: 'Gordon Ryan', duration: '12:00' },
  ]},
  { techniqueName: 'Smash Pass', position: 'Half Guard Top', videos: [
    { title: 'Smash Pass from Half Guard', url: 'https://www.youtube.com/watch?v=J6fpCEiqw3I', instructor: 'Bernardo Faria', duration: '10:00' },
  ]},
  { techniqueName: 'Backstep Pass', position: 'Half Guard Top', videos: [
    { title: 'Backstep Pass Tutorial', url: 'https://www.youtube.com/watch?v=mTewqLkjYwU', instructor: 'Leandro Lo', duration: '8:00' },
  ]},
  { techniqueName: 'Crossface', position: 'Half Guard Top', videos: [
    { title: 'Crossface Fundamentals', url: 'https://www.youtube.com/watch?v=YxZ9QSjw10U', instructor: 'Demian Maia', duration: '9:00' },
  ]},
  { techniqueName: 'Underhook Control', position: 'Half Guard Top', videos: [
    { title: 'Winning the Underhook Battle', url: 'https://www.youtube.com/watch?v=mCuaQmG3PvA', instructor: 'Lucas Leite', duration: '11:00' },
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
  { techniqueName: 'Plan B Sweep', position: 'Half Guard Bottom', videos: [
    { title: 'Plan B Sweep from Half Guard', url: 'https://www.youtube.com/watch?v=8dXoLH0HCBQ', instructor: 'Lucas Leite', duration: '9:00' },
  ]},
  { techniqueName: 'Electric Chair', position: 'Half Guard Bottom', videos: [
    { title: 'Electric Chair from Half Guard', url: 'https://www.youtube.com/watch?v=v4_xpz2K2T0', instructor: 'Eddie Bravo', duration: '12:00' },
  ]},
  { techniqueName: 'Dogfight', position: 'Half Guard Bottom', videos: [
    { title: 'Dogfight Position Guide', url: 'https://www.youtube.com/watch?v=hq5e8uYGLvE', instructor: 'Lucas Leite', duration: '14:00' },
  ]},
  { techniqueName: 'Knee Shield', position: 'Half Guard Bottom', videos: [
    { title: 'Knee Shield Half Guard', url: 'https://www.youtube.com/watch?v=qZDkT0xp0PA', instructor: 'Lachlan Giles', duration: '10:00' },
  ]},
  { techniqueName: 'Underhook', position: 'Half Guard Bottom', videos: [
    { title: 'Getting the Underhook', url: 'https://www.youtube.com/watch?v=bqJ0Fb8cGf0', instructor: 'Bernardo Faria', duration: '8:00' },
  ]},
  { techniqueName: 'Kimura from Half', position: 'Half Guard Bottom', videos: [
    { title: 'Kimura from Half Guard', url: 'https://www.youtube.com/watch?v=Atp6t2WKUAU', instructor: 'Tom DeBlass', duration: '10:00' },
  ]},

  // Butterfly Guard
  { techniqueName: 'Butterfly Sweep', position: 'Butterfly Guard', videos: [
    { title: 'Butterfly Sweep Basics', url: 'https://www.youtube.com/watch?v=79wJPQb3y00', instructor: 'Marcelo Garcia', duration: '10:00' },
  ]},
  { techniqueName: 'Arm Drag', position: 'Butterfly Guard', videos: [
    { title: 'Arm Drag from Butterfly', url: 'https://www.youtube.com/watch?v=vQZVXgDk9WM', instructor: 'Marcelo Garcia', duration: '8:30' },
  ]},
  { techniqueName: 'Guillotine', position: 'Butterfly Guard', videos: [
    { title: 'Guillotine from Butterfly', url: 'https://www.youtube.com/watch?v=dg3OlXPVZVo', instructor: 'Marcelo Garcia', duration: '12:00' },
  ]},
  { techniqueName: 'X-Guard Entry', position: 'Butterfly Guard', videos: [
    { title: 'X-Guard Entry from Butterfly', url: 'https://www.youtube.com/watch?v=sNDAqmE1JV0', instructor: 'Marcelo Garcia', duration: '9:00' },
  ]},
  { techniqueName: 'Single Leg X Entry', position: 'Butterfly Guard', videos: [
    { title: 'SLX Entry from Butterfly', url: 'https://www.youtube.com/watch?v=ckqXhPkDvzA', instructor: 'Lachlan Giles', duration: '10:00' },
  ]},
  { techniqueName: 'Hook Sweep', position: 'Butterfly Guard', videos: [
    { title: 'Hook Sweep Details', url: 'https://www.youtube.com/watch?v=h2O3mY9qkJY', instructor: 'Adam Wardzinski', duration: '11:00' },
  ]},

  // De La Riva Guard
  { techniqueName: 'Berimbolo', position: 'De La Riva Guard', videos: [
    { title: 'Berimbolo Complete Guide', url: 'https://www.youtube.com/watch?v=JYw5WEyzCHI', instructor: 'Mikey Musumeci', duration: '20:00' },
  ]},
  { techniqueName: 'DLR Sweep', position: 'De La Riva Guard', videos: [
    { title: 'Basic DLR Sweep', url: 'https://www.youtube.com/watch?v=W6kRmPfhP1I', instructor: 'Andre Galvao', duration: '9:00' },
  ]},
  { techniqueName: 'Back Take', position: 'De La Riva Guard', videos: [
    { title: 'DLR to Back Take', url: 'https://www.youtube.com/watch?v=K0_1vd4LajU', instructor: 'Mikey Musumeci', duration: '15:00' },
  ]},
  { techniqueName: 'Kiss of the Dragon', position: 'De La Riva Guard', videos: [
    { title: 'Kiss of the Dragon Tutorial', url: 'https://www.youtube.com/watch?v=TcxR4xwmJEc', instructor: 'Jeff Glover', duration: '8:00' },
  ]},
  { techniqueName: 'X-Guard Entry', position: 'De La Riva Guard', videos: [
    { title: 'DLR to X-Guard', url: 'https://www.youtube.com/watch?v=PJqLEXmZmk0', instructor: 'Marcelo Garcia', duration: '10:00' },
  ]},
  { techniqueName: 'Deep DLR', position: 'De La Riva Guard', videos: [
    { title: 'Deep DLR Position', url: 'https://www.youtube.com/watch?v=h1mLHkjNsG4', instructor: 'Caio Terra', duration: '12:00' },
  ]},

  // Reverse De La Riva
  { techniqueName: 'RDLR Sweep', position: 'Reverse De La Riva', videos: [
    { title: 'RDLR Sweep Tutorial', url: 'https://www.youtube.com/watch?v=HxbQPp3Kah8', instructor: 'Mikey Musumeci', duration: '10:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Reverse De La Riva', videos: [
    { title: 'RDLR Back Take', url: 'https://www.youtube.com/watch?v=Ac-Yfp8DWvI', instructor: 'Gianni Grippo', duration: '12:00' },
  ]},
  { techniqueName: 'Kiss of Dragon', position: 'Reverse De La Riva', videos: [
    { title: 'Kiss of Dragon from RDLR', url: 'https://www.youtube.com/watch?v=LkHx7HxD10I', instructor: 'Gui Mendes', duration: '8:00' },
  ]},
  { techniqueName: 'Deep Half Entry', position: 'Reverse De La Riva', videos: [
    { title: 'RDLR to Deep Half', url: 'https://www.youtube.com/watch?v=JFhvWj7oDt8', instructor: 'Bernardo Faria', duration: '9:00' },
  ]},

  // Spider Guard
  { techniqueName: 'Triangle', position: 'Spider Guard', videos: [
    { title: 'Spider Guard Triangle', url: 'https://www.youtube.com/watch?v=kGpQq7JKe3M', instructor: 'Romulo Barral', duration: '11:00' },
  ]},
  { techniqueName: 'Omoplata', position: 'Spider Guard', videos: [
    { title: 'Omoplata from Spider', url: 'https://www.youtube.com/watch?v=e4jH7sC0Tac', instructor: 'Michelle Nicolini', duration: '10:00' },
  ]},
  { techniqueName: 'Spider Sweep', position: 'Spider Guard', videos: [
    { title: 'Spider Sweep Fundamentals', url: 'https://www.youtube.com/watch?v=m_mFStTjRFA', instructor: 'Romulo Barral', duration: '12:00' },
  ]},
  { techniqueName: 'Balloon Sweep', position: 'Spider Guard', videos: [
    { title: 'Balloon Sweep Tutorial', url: 'https://www.youtube.com/watch?v=m5pOYp9X0DU', instructor: 'Cobrinha', duration: '8:00' },
  ]},
  { techniqueName: 'Lasso Transition', position: 'Spider Guard', videos: [
    { title: 'Spider to Lasso Guard', url: 'https://www.youtube.com/watch?v=5H_bVUj5R1c', instructor: 'Keenan Cornelius', duration: '9:00' },
  ]},

  // Lasso Guard
  { techniqueName: 'Lasso Sweep', position: 'Lasso Guard', videos: [
    { title: 'Lasso Sweep System', url: 'https://www.youtube.com/watch?v=A4sQAMRjkWY', instructor: 'Keenan Cornelius', duration: '14:00' },
  ]},
  { techniqueName: 'Triangle', position: 'Lasso Guard', videos: [
    { title: 'Triangle from Lasso', url: 'https://www.youtube.com/watch?v=n-q7P3O5pB8', instructor: 'Michelle Nicolini', duration: '10:00' },
  ]},
  { techniqueName: 'Omoplata', position: 'Lasso Guard', videos: [
    { title: 'Lasso Omoplata', url: 'https://www.youtube.com/watch?v=8dnP3g6FVDI', instructor: 'Keenan Cornelius', duration: '11:00' },
  ]},
  { techniqueName: 'Pendulum Sweep', position: 'Lasso Guard', videos: [
    { title: 'Pendulum from Lasso', url: 'https://www.youtube.com/watch?v=rC7q0JGbKW4', instructor: 'Romulo Barral', duration: '8:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Lasso Guard', videos: [
    { title: 'Lasso Back Take', url: 'https://www.youtube.com/watch?v=m-5-QxwBvtM', instructor: 'Leandro Lo', duration: '10:00' },
  ]},

  // X-Guard
  { techniqueName: 'Technical Stand Up Sweep', position: 'X-Guard', videos: [
    { title: 'X-Guard Technical Stand Up', url: 'https://www.youtube.com/watch?v=JQzHU9ECWEY', instructor: 'Marcelo Garcia', duration: '8:00' },
  ]},
  { techniqueName: 'Overhead Sweep', position: 'X-Guard', videos: [
    { title: 'X-Guard Overhead Sweep', url: 'https://www.youtube.com/watch?v=bhF2NKZQFNQ', instructor: 'Marcelo Garcia', duration: '10:00' },
  ]},
  { techniqueName: 'Single Leg Sweep', position: 'X-Guard', videos: [
    { title: 'X-Guard to Single Leg', url: 'https://www.youtube.com/watch?v=P3dH7cBFdxI', instructor: 'Marcelo Garcia', duration: '9:00' },
  ]},
  { techniqueName: 'Back Take', position: 'X-Guard', videos: [
    { title: 'X-Guard Back Take', url: 'https://www.youtube.com/watch?v=qLHNnFyVtT4', instructor: 'Marcelo Garcia', duration: '11:00' },
  ]},
  { techniqueName: 'Leg Lock Entry', position: 'X-Guard', videos: [
    { title: 'X-Guard to Leg Locks', url: 'https://www.youtube.com/watch?v=J0mNk0GJ2YM', instructor: 'Craig Jones', duration: '14:00' },
  ]},
  { techniqueName: 'Waiter Sweep', position: 'X-Guard', videos: [
    { title: 'Waiter Sweep from X-Guard', url: 'https://www.youtube.com/watch?v=0V7dqdSO9AY', instructor: 'Lachlan Giles', duration: '8:00' },
  ]},

  // Single Leg X
  { techniqueName: 'Straight Ankle Lock', position: 'Single Leg X', videos: [
    { title: 'Ankle Lock from SLX', url: 'https://www.youtube.com/watch?v=qPVMT5xPgBg', instructor: 'Lachlan Giles', duration: '12:00' },
  ]},
  { techniqueName: 'Heel Hook Entry', position: 'Single Leg X', videos: [
    { title: 'SLX to Heel Hook', url: 'https://www.youtube.com/watch?v=YxjAqL6PvJk', instructor: 'Craig Jones', duration: '15:00' },
  ]},
  { techniqueName: 'Sweep to Top', position: 'Single Leg X', videos: [
    { title: 'SLX Sweep to Top', url: 'https://www.youtube.com/watch?v=F6fEdDGwXO0', instructor: 'Marcelo Garcia', duration: '8:00' },
  ]},
  { techniqueName: 'Kneebar Entry', position: 'Single Leg X', videos: [
    { title: 'Kneebar from SLX', url: 'https://www.youtube.com/watch?v=QOhPaB3Tb2A', instructor: 'Lachlan Giles', duration: '10:00' },
  ]},
  { techniqueName: 'X-Guard Transition', position: 'Single Leg X', videos: [
    { title: 'SLX to X-Guard', url: 'https://www.youtube.com/watch?v=VvY9vFa0tD4', instructor: 'Marcelo Garcia', duration: '7:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Single Leg X', videos: [
    { title: 'SLX Back Take', url: 'https://www.youtube.com/watch?v=D2fqR0zP0oY', instructor: 'Craig Jones', duration: '12:00' },
  ]},

  // 50/50
  { techniqueName: 'Heel Hook', position: '50/50', videos: [
    { title: '50/50 Heel Hook System', url: 'https://www.youtube.com/watch?v=lH0IwmyFXBc', instructor: 'Craig Jones', duration: '18:00' },
  ]},
  { techniqueName: 'Kneebar', position: '50/50', videos: [
    { title: 'Kneebar from 50/50', url: 'https://www.youtube.com/watch?v=0X4h6vRQZvQ', instructor: 'Lachlan Giles', duration: '12:00' },
  ]},
  { techniqueName: 'Toe Hold', position: '50/50', videos: [
    { title: 'Toe Hold from 50/50', url: 'https://www.youtube.com/watch?v=h_LUj-pMBVI', instructor: 'Dean Lister', duration: '10:00' },
  ]},
  { techniqueName: 'Sweep', position: '50/50', videos: [
    { title: '50/50 Sweep to Top', url: 'https://www.youtube.com/watch?v=TN9bXQLIZzE', instructor: 'Mikey Musumeci', duration: '9:00' },
  ]},
  { techniqueName: 'Back Step Escape', position: '50/50', videos: [
    { title: 'Escaping 50/50', url: 'https://www.youtube.com/watch?v=xzI0Qlps8jI', instructor: 'Lachlan Giles', duration: '11:00' },
  ]},

  // Knee Shield
  { techniqueName: 'Hip Bump Sweep', position: 'Knee Shield', videos: [
    { title: 'Hip Bump from Knee Shield', url: 'https://www.youtube.com/watch?v=xWp0JxFGxyE', instructor: 'Tom DeBlass', duration: '8:00' },
  ]},
  { techniqueName: 'Underhook', position: 'Knee Shield', videos: [
    { title: 'Knee Shield to Underhook', url: 'https://www.youtube.com/watch?v=eiqK7xpshKQ', instructor: 'Lucas Leite', duration: '10:00' },
  ]},
  { techniqueName: 'Omoplata', position: 'Knee Shield', videos: [
    { title: 'Omoplata from Knee Shield', url: 'https://www.youtube.com/watch?v=9tF0VqpmYF0', instructor: 'Lachlan Giles', duration: '9:00' },
  ]},
  { techniqueName: 'Triangle', position: 'Knee Shield', videos: [
    { title: 'Triangle from Knee Shield', url: 'https://www.youtube.com/watch?v=qLkEPvA8D_Y', instructor: 'Ryan Hall', duration: '12:00' },
  ]},

  // Z-Guard
  { techniqueName: 'Knee Shield Sweep', position: 'Z-Guard', videos: [
    { title: 'Z-Guard Sweep System', url: 'https://www.youtube.com/watch?v=2pWGhxQJ1kE', instructor: 'Craig Jones', duration: '14:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Z-Guard', videos: [
    { title: 'Z-Guard Back Take', url: 'https://www.youtube.com/watch?v=5DqDq1vqSbE', instructor: 'Lachlan Giles', duration: '10:00' },
  ]},
  { techniqueName: 'Underhook', position: 'Z-Guard', videos: [
    { title: 'Z-Guard Underhook Entry', url: 'https://www.youtube.com/watch?v=VnQKj3FRqwE', instructor: 'Lucas Leite', duration: '8:00' },
  ]},
  { techniqueName: 'Kimura', position: 'Z-Guard', videos: [
    { title: 'Kimura from Z-Guard', url: 'https://www.youtube.com/watch?v=WdP5V7Xvpcc', instructor: 'Tom DeBlass', duration: '11:00' },
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
  { techniqueName: 'Toe Hold', position: 'Leg Entanglement', videos: [
    { title: 'Toe Hold Mechanics', url: 'https://www.youtube.com/watch?v=lKPqy0BDPPY', instructor: 'Dean Lister', duration: '12:00' },
  ]},
  { techniqueName: 'Calf Slicer', position: 'Leg Entanglement', videos: [
    { title: 'Calf Slicer System', url: 'https://www.youtube.com/watch?v=P8Kfwi4CYvs', instructor: 'Geo Martinez', duration: '10:00' },
  ]},
  { techniqueName: 'Straight Ankle Lock', position: 'Leg Entanglement', videos: [
    { title: 'Straight Ankle Lock Details', url: 'https://www.youtube.com/watch?v=oBHYGLRhbw0', instructor: 'Dean Lister', duration: '14:00' },
  ]},
  { techniqueName: 'Saddle Entry', position: 'Leg Entanglement', videos: [
    { title: 'Saddle Entry System', url: 'https://www.youtube.com/watch?v=3eFhNbVE2tQ', instructor: 'John Danaher', duration: '20:00' },
  ]},
  { techniqueName: 'Honeyhole/Saddle', position: 'Leg Entanglement', videos: [
    { title: 'Honeyhole Position Guide', url: 'https://www.youtube.com/watch?v=kWRpVPqXTzE', instructor: 'Craig Jones', duration: '16:00' },
  ]},
  { techniqueName: 'Leg Defense', position: 'Leg Entanglement', videos: [
    { title: 'Defending Leg Attacks', url: 'https://www.youtube.com/watch?v=1hPL8AKD_6c', instructor: 'Lachlan Giles', duration: '18:00' },
  ]},
  { techniqueName: 'Boot Escape', position: 'Leg Entanglement', videos: [
    { title: 'Boot Escape Tutorial', url: 'https://www.youtube.com/watch?v=kQl9BqKjPFk', instructor: 'Gordon Ryan', duration: '12:00' },
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
  { techniqueName: 'Ouchi Gari', position: 'Standing', videos: [
    { title: 'Ouchi Gari Tutorial', url: 'https://www.youtube.com/watch?v=Gy0yh1JB7lg', instructor: 'Shintaro Higashi', duration: '9:00' },
  ]},
  { techniqueName: 'Seoi Nage', position: 'Standing', videos: [
    { title: 'Seoi Nage for BJJ', url: 'https://www.youtube.com/watch?v=uMz3JF8NJJE', instructor: 'Travis Stevens', duration: '12:00' },
  ]},
  { techniqueName: 'Arm Drag to Back', position: 'Standing', videos: [
    { title: 'Standing Arm Drag', url: 'https://www.youtube.com/watch?v=4Rh0AHQgjpE', instructor: 'Marcelo Garcia', duration: '8:00' },
  ]},
  { techniqueName: 'Snap Down', position: 'Standing', videos: [
    { title: 'Snap Down to Front Headlock', url: 'https://www.youtube.com/watch?v=aHxqAhQFzfI', instructor: 'John Smith', duration: '10:00' },
  ]},
  { techniqueName: 'Ankle Pick', position: 'Standing', videos: [
    { title: 'Ankle Pick Takedown', url: 'https://www.youtube.com/watch?v=XPT0h4AXOUI', instructor: 'Khabib Nurmagomedov', duration: '7:00' },
  ]},
  { techniqueName: 'Body Lock Takedown', position: 'Standing', videos: [
    { title: 'Body Lock Takedowns', url: 'https://www.youtube.com/watch?v=eFBx8sHJPJo', instructor: 'Gordon Ryan', duration: '15:00' },
  ]},
  { techniqueName: 'Foot Sweep', position: 'Standing', videos: [
    { title: 'Foot Sweeps for BJJ', url: 'https://www.youtube.com/watch?v=dNI3gRYUXQE', instructor: 'Shintaro Higashi', duration: '11:00' },
  ]},
  { techniqueName: 'Duck Under', position: 'Standing', videos: [
    { title: 'Duck Under to Back', url: 'https://www.youtube.com/watch?v=aNs3AvLqLcc', instructor: 'Jordan Burroughs', duration: '8:00' },
  ]},
  { techniqueName: 'Sprawl', position: 'Standing', videos: [
    { title: 'Sprawl Defense', url: 'https://www.youtube.com/watch?v=nkAqgSC9k2Y', instructor: 'Ben Askren', duration: '9:00' },
  ]},
  { techniqueName: 'Guard Pull', position: 'Standing', videos: [
    { title: 'Safe Guard Pull', url: 'https://www.youtube.com/watch?v=GZPLEvqXYxU', instructor: 'Mikey Musumeci', duration: '10:00' },
  ]},

  // Turtle Top
  { techniqueName: 'Clock Choke', position: 'Turtle Top', videos: [
    { title: 'Clock Choke Tutorial', url: 'https://www.youtube.com/watch?v=4-bxqx_yNA8', instructor: 'Magid Hage', duration: '10:00' },
  ]},
  { techniqueName: 'Crucifix Entry', position: 'Turtle Top', videos: [
    { title: 'Crucifix from Turtle', url: 'https://www.youtube.com/watch?v=O0QjSj2y_Vw', instructor: 'Alexandre Vieira', duration: '12:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Turtle Top', videos: [
    { title: 'Taking the Back from Turtle', url: 'https://www.youtube.com/watch?v=T4_6nOl9dpM', instructor: 'Marcelo Garcia', duration: '9:00' },
  ]},
  { techniqueName: 'Front Headlock', position: 'Turtle Top', videos: [
    { title: 'Front Headlock Series', url: 'https://www.youtube.com/watch?v=z3-OKpmXm3A', instructor: 'Gordon Ryan', duration: '14:00' },
  ]},
  { techniqueName: 'Guillotine', position: 'Turtle Top', videos: [
    { title: 'Guillotine from Turtle', url: 'https://www.youtube.com/watch?v=R9HBx6F0Qww', instructor: 'Marcelo Garcia', duration: '8:00' },
  ]},
  { techniqueName: 'Anaconda Choke', position: 'Turtle Top', videos: [
    { title: 'Anaconda Choke System', url: 'https://www.youtube.com/watch?v=m1O9oKtHuHQ', instructor: 'Milton Vieira', duration: '11:00' },
  ]},
  { techniqueName: 'Darce Choke', position: 'Turtle Top', videos: [
    { title: "D'arce Choke Tutorial", url: 'https://www.youtube.com/watch?v=N-jTjHHg7Ck', instructor: 'Jeff Glover', duration: '10:00' },
  ]},
  { techniqueName: 'Turnover', position: 'Turtle Top', videos: [
    { title: 'Turtle Turnovers', url: 'https://www.youtube.com/watch?v=3Eb0wHU8-RY', instructor: 'Demian Maia', duration: '12:00' },
  ]},

  // Turtle Bottom
  { techniqueName: 'Granby Roll', position: 'Turtle Bottom', videos: [
    { title: 'Granby Roll Escape', url: 'https://www.youtube.com/watch?v=O_DJ9R3OPIA', instructor: 'Priit Mihkelson', duration: '14:00' },
  ]},
  { techniqueName: 'Sit Out', position: 'Turtle Bottom', videos: [
    { title: 'Sit Out from Turtle', url: 'https://www.youtube.com/watch?v=rqBjqRhXUZk', instructor: 'Ben Askren', duration: '8:00' },
  ]},
  { techniqueName: 'Stand Up', position: 'Turtle Bottom', videos: [
    { title: 'Standing Up from Turtle', url: 'https://www.youtube.com/watch?v=Y9n7lFMkjDA', instructor: 'Demian Maia', duration: '9:00' },
  ]},
  { techniqueName: 'Guard Recovery', position: 'Turtle Bottom', videos: [
    { title: 'Turtle to Guard Recovery', url: 'https://www.youtube.com/watch?v=uTqXWPn9RxA', instructor: 'Priit Mihkelson', duration: '12:00' },
  ]},
  { techniqueName: 'Switch', position: 'Turtle Bottom', videos: [
    { title: 'Wrestling Switch from Turtle', url: 'https://www.youtube.com/watch?v=a1s-jWFG0h4', instructor: 'Ben Askren', duration: '7:00' },
  ]},

  // North-South Top
  { techniqueName: 'North-South Choke', position: 'North-South Top', videos: [
    { title: 'North South Choke Masterclass', url: 'https://www.youtube.com/watch?v=2iwnP7TK7Lw', instructor: 'Marcelo Garcia', duration: '15:00' },
  ]},
  { techniqueName: 'Kimura', position: 'North-South Top', videos: [
    { title: 'Kimura from North South', url: 'https://www.youtube.com/watch?v=oZqQq2h8Xp4', instructor: 'Bernardo Faria', duration: '10:00' },
  ]},
  { techniqueName: 'Armbar', position: 'North-South Top', videos: [
    { title: 'North South Armbar', url: 'https://www.youtube.com/watch?v=YqmEYGcTkpE', instructor: 'Andre Galvao', duration: '9:00' },
  ]},

  // Knee on Belly
  { techniqueName: 'Armbar', position: 'Knee on Belly', videos: [
    { title: 'Armbar from Knee on Belly', url: 'https://www.youtube.com/watch?v=k4l5M7dPJ7c', instructor: 'Andre Galvao', duration: '10:00' },
  ]},
  { techniqueName: 'Baseball Bat Choke', position: 'Knee on Belly', videos: [
    { title: 'Baseball Bat from KOB', url: 'https://www.youtube.com/watch?v=k3DZTv-g6vk', instructor: 'Magid Hage', duration: '11:00' },
  ]},
  { techniqueName: 'Far Side Armbar', position: 'Knee on Belly', videos: [
    { title: 'Far Side Armbar from KOB', url: 'https://www.youtube.com/watch?v=V5dJlXnO0Pc', instructor: 'Saulo Ribeiro', duration: '8:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Knee on Belly', videos: [
    { title: 'Back Take from Knee on Belly', url: 'https://www.youtube.com/watch?v=dQr0Dn1LWaI', instructor: 'Marcelo Garcia', duration: '9:00' },
  ]},

  // Crucifix
  { techniqueName: 'Armbar', position: 'Crucifix', videos: [
    { title: 'Crucifix Armbar', url: 'https://www.youtube.com/watch?v=jHZLlZbQfSw', instructor: 'Alexandre Vieira', duration: '10:00' },
  ]},
  { techniqueName: 'Rear Naked Choke', position: 'Crucifix', videos: [
    { title: 'RNC from Crucifix', url: 'https://www.youtube.com/watch?v=fV-_z9r8zRk', instructor: 'Matt Serra', duration: '8:00' },
  ]},
  { techniqueName: 'Maintaining Crucifix', position: 'Crucifix', videos: [
    { title: 'Crucifix Control System', url: 'https://www.youtube.com/watch?v=bxPj1TCF4bU', instructor: 'Alexandre Vieira', duration: '14:00' },
  ]},

  // Lockdown
  { techniqueName: 'Electric Chair Sweep', position: 'Lockdown', videos: [
    { title: 'Electric Chair from Lockdown', url: 'https://www.youtube.com/watch?v=cJJpHr2FthA', instructor: 'Eddie Bravo', duration: '12:00' },
  ]},
  { techniqueName: 'Vaporizer', position: 'Lockdown', videos: [
    { title: 'Vaporizer Submission', url: 'https://www.youtube.com/watch?v=9dHTzL1WFsQ', instructor: 'Eddie Bravo', duration: '8:00' },
  ]},
  { techniqueName: 'Old School Sweep', position: 'Lockdown', videos: [
    { title: 'Old School from Lockdown', url: 'https://www.youtube.com/watch?v=lM_2j6D8xMQ', instructor: 'Eddie Bravo', duration: '10:00' },
  ]},
  { techniqueName: 'Plan B', position: 'Lockdown', videos: [
    { title: 'Plan B Sweep System', url: 'https://www.youtube.com/watch?v=OqJqGwK8sXE', instructor: 'Eddie Bravo', duration: '9:00' },
  ]},
  { techniqueName: 'Whip Up', position: 'Lockdown', videos: [
    { title: 'Whip Up Technique', url: 'https://www.youtube.com/watch?v=B-F1bPXgJ6I', instructor: 'Eddie Bravo', duration: '7:00' },
  ]},
  { techniqueName: 'Electric Chair Submission', position: 'Lockdown', videos: [
    { title: 'Electric Chair Submission Finish', url: 'https://www.youtube.com/watch?v=wV0hXWmLZUo', instructor: 'Eddie Bravo', duration: '10:00' },
  ]},
  { techniqueName: 'Banana Split', position: 'Lockdown', videos: [
    { title: 'Banana Split from Electric Chair', url: 'https://www.youtube.com/watch?v=xCWiXzK-B-k', instructor: 'Eddie Bravo', duration: '8:00' },
  ]},
  { techniqueName: 'Lockdown Entry', position: 'Lockdown', videos: [
    { title: 'How to Get the Lockdown', url: 'https://www.youtube.com/watch?v=_5FfZBt3B5I', instructor: 'Eddie Bravo', duration: '11:00' },
  ]},

  // Rubber Guard
  { techniqueName: 'Mission Control', position: 'Rubber Guard', videos: [
    { title: 'Mission Control System', url: 'https://www.youtube.com/watch?v=JDLR3qxjbTw', instructor: 'Eddie Bravo', duration: '15:00' },
  ]},
  { techniqueName: 'Gogoplata', position: 'Rubber Guard', videos: [
    { title: 'Gogoplata from Rubber Guard', url: 'https://www.youtube.com/watch?v=x2dh-NjE4bA', instructor: 'Eddie Bravo', duration: '10:00' },
  ]},
  { techniqueName: 'Omoplata', position: 'Rubber Guard', videos: [
    { title: 'Omoplata from Rubber Guard', url: 'https://www.youtube.com/watch?v=4Fh7WQJT0kA', instructor: 'Eddie Bravo', duration: '11:00' },
  ]},
  { techniqueName: 'Triangle', position: 'Rubber Guard', videos: [
    { title: 'Triangle from Rubber Guard', url: 'https://www.youtube.com/watch?v=mFZ3n7V4X5I', instructor: 'Eddie Bravo', duration: '12:00' },
  ]},
  { techniqueName: 'Armbar', position: 'Rubber Guard', videos: [
    { title: 'Armbar from Rubber Guard', url: 'https://www.youtube.com/watch?v=yL8sWdHfP7E', instructor: 'Eddie Bravo', duration: '9:00' },
  ]},

  // Worm Guard
  { techniqueName: 'Worm Guard Sweep', position: 'Worm Guard', videos: [
    { title: 'Worm Guard Sweep System', url: 'https://www.youtube.com/watch?v=vZJR9xMqJFY', instructor: 'Keenan Cornelius', duration: '15:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Worm Guard', videos: [
    { title: 'Worm Guard to Back', url: 'https://www.youtube.com/watch?v=4Nqqj5YVK0g', instructor: 'Keenan Cornelius', duration: '12:00' },
  ]},
  { techniqueName: 'Worm Guard Entry', position: 'Worm Guard', videos: [
    { title: 'How to Get Worm Guard', url: 'https://www.youtube.com/watch?v=fLm8J_S8p6E', instructor: 'Keenan Cornelius', duration: '10:00' },
  ]},
  { techniqueName: 'Omoplata', position: 'Worm Guard', videos: [
    { title: 'Worm Guard Omoplata', url: 'https://www.youtube.com/watch?v=Rj1j3HqA7nM', instructor: 'Keenan Cornelius', duration: '11:00' },
  ]},

  // Waiter Guard
  { techniqueName: 'Waiter Sweep', position: 'Waiter Guard', videos: [
    { title: 'Waiter Sweep Tutorial', url: 'https://www.youtube.com/watch?v=VG1y-N1hylk', instructor: 'Lachlan Giles', duration: '10:00' },
    { title: 'Waiter Sweep Details', url: 'https://www.youtube.com/watch?v=sXqVfQ0PPNY', instructor: 'Jon Thomas', duration: '12:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Waiter Guard', videos: [
    { title: 'Waiter to Back Take', url: 'https://www.youtube.com/watch?v=x4C5pXmK7gE', instructor: 'Lachlan Giles', duration: '8:00' },
  ]},
  { techniqueName: 'Calf Slicer', position: 'Waiter Guard', videos: [
    { title: 'Calf Slicer from Waiter', url: 'https://www.youtube.com/watch?v=Dw7xLgZ2hMQ', instructor: 'Craig Jones', duration: '9:00' },
  ]},
  { techniqueName: 'Toe Hold', position: 'Waiter Guard', videos: [
    { title: 'Toe Hold from Waiter', url: 'https://www.youtube.com/watch?v=B1pKTq8HFAQ', instructor: 'Lachlan Giles', duration: '8:00' },
  ]},
  { techniqueName: 'Kneebar', position: 'Waiter Guard', videos: [
    { title: 'Kneebar from Waiter', url: 'https://www.youtube.com/watch?v=QHwLmPz9kJE', instructor: 'Craig Jones', duration: '10:00' },
  ]},
  { techniqueName: 'Waiter to X-Guard', position: 'Waiter Guard', videos: [
    { title: 'Waiter to X-Guard Transition', url: 'https://www.youtube.com/watch?v=fTgVq1z4W0Y', instructor: 'Lachlan Giles', duration: '7:00' },
  ]},
  { techniqueName: 'Overhead Sweep', position: 'Waiter Guard', videos: [
    { title: 'Overhead Sweep from Waiter', url: 'https://www.youtube.com/watch?v=kMdLH5ePqWI', instructor: 'Jon Thomas', duration: '9:00' },
  ]},
  { techniqueName: 'Waiter Entry from Half Guard', position: 'Waiter Guard', videos: [
    { title: 'Half Guard to Waiter', url: 'https://www.youtube.com/watch?v=nXLvPzDx8HQ', instructor: 'Lachlan Giles', duration: '11:00' },
  ]},
  { techniqueName: 'Heel Hook Entry', position: 'Waiter Guard', videos: [
    { title: 'Waiter to Heel Hook', url: 'https://www.youtube.com/watch?v=0xTpHM9jWgQ', instructor: 'Craig Jones', duration: '12:00' },
  ]},

  // Butterfly Half
  { techniqueName: 'Butterfly Half Sweep', position: 'Butterfly Half', videos: [
    { title: 'Butterfly Half Sweep System', url: 'https://www.youtube.com/watch?v=aFgBXUmXlJI', instructor: 'Adam Wardzinski', duration: '14:00' },
  ]},
  { techniqueName: 'Elevator Sweep', position: 'Butterfly Half', videos: [
    { title: 'Elevator from Butterfly Half', url: 'https://www.youtube.com/watch?v=mN8kQWTxV5E', instructor: 'Adam Wardzinski', duration: '10:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Butterfly Half', videos: [
    { title: 'Butterfly Half to Back', url: 'https://www.youtube.com/watch?v=qRvANTkP3cI', instructor: 'Lucas Leite', duration: '11:00' },
  ]},
  { techniqueName: 'Single Leg X Entry', position: 'Butterfly Half', videos: [
    { title: 'Butterfly Half to SLX', url: 'https://www.youtube.com/watch?v=J5LFTvnPz1E', instructor: 'Lachlan Giles', duration: '9:00' },
  ]},
  { techniqueName: 'Underhook Sweep', position: 'Butterfly Half', videos: [
    { title: 'Underhook Sweep from Butterfly Half', url: 'https://www.youtube.com/watch?v=wBnQkTvE4FI', instructor: 'Adam Wardzinski', duration: '12:00' },
  ]},
  { techniqueName: 'Guillotine', position: 'Butterfly Half', videos: [
    { title: 'Guillotine from Butterfly Half', url: 'https://www.youtube.com/watch?v=dF7LmQp8XzE', instructor: 'Marcelo Garcia', duration: '8:00' },
  ]},
  { techniqueName: 'Dogfight', position: 'Butterfly Half', videos: [
    { title: 'Dogfight from Butterfly Half', url: 'https://www.youtube.com/watch?v=hNv5Tq8WmXI', instructor: 'Lucas Leite', duration: '10:00' },
  ]},

  // Octopus Guard
  { techniqueName: 'Octopus Sweep', position: 'Octopus Guard', videos: [
    { title: 'Octopus Guard Sweep', url: 'https://www.youtube.com/watch?v=Tx5qVpK8wLI', instructor: 'Eduardo Telles', duration: '12:00' },
  ]},
  { techniqueName: 'Back Take', position: 'Octopus Guard', videos: [
    { title: 'Octopus to Back', url: 'https://www.youtube.com/watch?v=yV7mQwPvJXE', instructor: 'Eduardo Telles', duration: '10:00' },
  ]},
  { techniqueName: 'Guillotine', position: 'Octopus Guard', videos: [
    { title: 'Guillotine from Octopus', url: 'https://www.youtube.com/watch?v=kQAWx7gHzFI', instructor: 'Marcelo Garcia', duration: '9:00' },
  ]},
  { techniqueName: 'Omoplata', position: 'Octopus Guard', videos: [
    { title: 'Omoplata from Octopus', url: 'https://www.youtube.com/watch?v=Jx9mVpQtJnE', instructor: 'Eduardo Telles', duration: '11:00' },
  ]},
  { techniqueName: 'Octopus Entry from Half Guard', position: 'Octopus Guard', videos: [
    { title: 'Half Guard to Octopus', url: 'https://www.youtube.com/watch?v=nPx7q8LvK1I', instructor: 'Eduardo Telles', duration: '13:00' },
  ]},
  { techniqueName: 'Underhook Control', position: 'Octopus Guard', videos: [
    { title: 'Octopus Underhook Details', url: 'https://www.youtube.com/watch?v=zLvPMwQp5WE', instructor: 'Eduardo Telles', duration: '8:00' },
  ]},

  // High Ground
  { techniqueName: 'High Ground Entry', position: 'High Ground', videos: [
    { title: 'High Ground Position Introduction', url: 'https://www.youtube.com/watch?v=zfxjppqt44k', instructor: 'Officer Grimey', duration: '15:00' },
  ]},
  { techniqueName: 'High Ground Sweep', position: 'High Ground', videos: [
    { title: 'High Ground Sweep System', url: 'https://www.youtube.com/watch?v=5VhWfntPHbA', instructor: 'Officer Grimey', duration: '12:00' },
  ]},
  { techniqueName: 'Back Take', position: 'High Ground', videos: [
    { title: 'High Ground to Back', url: 'https://www.youtube.com/watch?v=wTqJm9RPHLI', instructor: 'Officer Grimey', duration: '10:00' },
  ]},
  { techniqueName: 'Armbar', position: 'High Ground', videos: [
    { title: 'Armbar from High Ground', url: 'https://www.youtube.com/watch?v=Hx5mQTPvF8E', instructor: 'Officer Grimey', duration: '9:00' },
  ]},
  { techniqueName: 'Triangle', position: 'High Ground', videos: [
    { title: 'Triangle from High Ground', url: 'https://www.youtube.com/watch?v=kJvLPq8TWXI', instructor: 'Officer Grimey', duration: '11:00' },
  ]},
  { techniqueName: 'Leg Entanglement Entry', position: 'High Ground', videos: [
    { title: 'High Ground to Leg Locks', url: 'https://www.youtube.com/watch?v=bQXnLmPzVHI', instructor: 'Officer Grimey', duration: '13:00' },
  ]},
  { techniqueName: 'Kimura', position: 'High Ground', videos: [
    { title: 'Kimura from High Ground', url: 'https://www.youtube.com/watch?v=oFxTpQw7NxE', instructor: 'Officer Grimey', duration: '8:00' },
  ]},
  { techniqueName: 'High Ground Retention', position: 'High Ground', videos: [
    { title: 'Maintaining High Ground', url: 'https://www.youtube.com/watch?v=dLvMKxPzJWI', instructor: 'Officer Grimey', duration: '10:00' },
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
