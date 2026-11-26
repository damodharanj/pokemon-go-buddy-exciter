import { BuddyActivity, BuddyMoodInfo } from '../types/buddy';

export const ACTIVITIES: BuddyActivity[] = [
  {
    id: 'feed',
    title: 'Feed Buddy',
    subtitle: 'Give 3 berries to appear on map (or 1 berry if hungry)',
    icon: 'Apple',
    points: 2,
    cooldownMs: 30 * 60 * 1000,
    isCore: true,
    tip: 'In round 1, give 3 berries to bring your buddy onto the map. In later rounds, give 1 berry.',
  },
  {
    id: 'pet',
    title: 'Play / Pet Buddy',
    subtitle: 'Rub head/belly until hearts sparkle',
    icon: 'Sparkles',
    points: 2,
    cooldownMs: 30 * 60 * 1000,
    isCore: true,
    tip: 'Open the play screen and gently swipe back and forth over your buddy until it jumps with hearts.',
  },
  {
    id: 'snapshot',
    title: 'Take Snapshot',
    subtitle: 'Tap the camera button in the play screen',
    icon: 'Camera',
    points: 2,
    cooldownMs: 30 * 60 * 1000,
    isCore: true,
    tip: 'A quick single photo is enough to earn emotion points!',
  },
  {
    id: 'battle_leader',
    title: 'Battle Team Leader',
    subtitle: 'Train vs Blanche/Candela/Spark & surrender immediately',
    icon: 'Swords',
    points: 2,
    cooldownMs: 30 * 60 * 1000,
    isCore: true,
    tip: 'Go to Battle tab -> scroll down to Training -> pick Master League with your buddy on the team. Top-left surrender right as it starts!',
  },
  {
    id: 'battle_rocket',
    title: 'Battle GO Rocket',
    subtitle: 'Defeat a Rocket Grunt or Team Leader with buddy in party',
    icon: 'Skull',
    points: 2,
    cooldownMs: 30 * 60 * 1000,
    isCore: false,
    tip: 'Bonus points! Counts as a distinct battle category from Team Leader training.',
  },
  {
    id: 'battle_gym_raid',
    title: 'Gym or Raid Battle',
    subtitle: 'Fight a gym defender or raid boss with buddy',
    icon: 'ShieldAlert',
    points: 2,
    cooldownMs: 30 * 60 * 1000,
    isCore: false,
    tip: 'Gym and raid battles have their own cooldown slot separate from Leader training.',
  },
  {
    id: 'walk_2km',
    title: 'Walk 2 km',
    subtitle: 'Explore 2 kilometers with buddy on map',
    icon: 'Footprints',
    points: 3,
    cooldownMs: 0,
    isCore: false,
    tip: 'Walking distance grants emotion points for every 2 km logged on the buddy meter.',
  },
  {
    id: 'route',
    title: 'Follow a Route',
    subtitle: 'Complete an in-game Route together',
    icon: 'Compass',
    points: 2,
    cooldownMs: 0,
    isCore: false,
    tip: 'Routes grant instant emotion points with no cooldown, making it the fastest free boost.',
  },
];

export const MOOD_LEVELS: BuddyMoodInfo[] = [
  {
    stage: 'normal',
    label: 'Normal',
    emoji: '😴',
    description: 'Resting / Neutral',
    badgeColor: 'bg-slate-700 text-slate-300',
    minEp: 0,
    maxEp: 1,
  },
  {
    stage: 'happy',
    label: 'Happy',
    emoji: '🙂',
    description: 'Noticing you',
    badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    minEp: 2,
    maxEp: 3,
  },
  {
    stage: 'smile',
    label: 'Smiling',
    emoji: '😊',
    description: 'Cheering up',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    minEp: 4,
    maxEp: 10,
  },
  {
    stage: 'fun',
    label: 'Fun',
    emoji: '😃',
    description: 'High spirits',
    badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    minEp: 11,
    maxEp: 19,
  },
  {
    stage: 'grin',
    label: 'Grinning',
    emoji: '😄',
    description: 'Almost excited!',
    badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    minEp: 20,
    maxEp: 31,
  },
  {
    stage: 'excited',
    label: 'Excited',
    emoji: '🤩',
    description: 'Glowing with pink hearts!',
    badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse-glow',
    minEp: 32,
    maxEp: 32,
  },
];

export function getMoodInfo(totalEp: number): BuddyMoodInfo {
  if (totalEp >= 32) return MOOD_LEVELS[5];
  if (totalEp >= 20) return MOOD_LEVELS[4];
  if (totalEp >= 11) return MOOD_LEVELS[3];
  if (totalEp >= 4) return MOOD_LEVELS[2];
  if (totalEp >= 2) return MOOD_LEVELS[1];
  return MOOD_LEVELS[0];
}

export const POPULAR_BUDDIES = [
  { name: 'Lucario', species: 'lucario', km: 5 },
  { name: 'Mewtwo', species: 'mewtwo', km: 20 },
  { name: 'Rayquaza', species: 'rayquaza', km: 20 },
  { name: 'Kyogre', species: 'kyogre', km: 20 },
  { name: 'Groudon', species: 'groudon', km: 20 },
  { name: 'Garchomp', species: 'garchomp', km: 5 },
  { name: 'Charizard', species: 'charizard', km: 3 },
  { name: 'Eevee', species: 'eevee', km: 5 },
  { name: 'Pikachu', species: 'pikachu', km: 1 },
  { name: 'Magikarp', species: 'magikarp', km: 1 },
  { name: 'Larvitar', species: 'larvitar', km: 5 },
  { name: 'Beldum', species: 'beldum', km: 5 },
];
