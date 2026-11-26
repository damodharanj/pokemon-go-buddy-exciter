export type BuddyActivityId =
  | 'feed'
  | 'pet'
  | 'snapshot'
  | 'battle_leader'
  | 'battle_rocket'
  | 'battle_gym_raid'
  | 'walk_2km'
  | 'route';

export interface BuddyActivity {
  id: BuddyActivityId;
  title: string;
  subtitle: string;
  icon: string;
  points: number;
  cooldownMs: number;
  isCore: boolean;
  tip?: string;
}

export type BuddyMoodStage = 'normal' | 'happy' | 'smile' | 'fun' | 'grin' | 'excited';

export interface BuddyMoodInfo {
  stage: BuddyMoodStage;
  label: string;
  emoji: string;
  description: string;
  badgeColor: string;
  minEp: number;
  maxEp: number;
}

export interface BuddySettings {
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  cooldownMinutes: number; // default 30
  maintenanceMinutes: number; // default 20
  candyDistanceKm: number; // 20, 5, 3, or 1 km
}

export interface ActivityLogEntry {
  id: string;
  timestamp: number;
  title: string;
  epChange: number;
  round: number;
}

export interface BuddySessionState {
  isActive: boolean;
  buddyName: string;
  pokemonSpecies: string;
  startedAt: number | null;
  lastInteractionAt: number | null;
  nextTimerEndsAt: number | null;
  totalEp: number;
  currentRound: number;
  completedActivities: Record<string, number>; // activityId -> timestamp completed
  history: ActivityLogEntry[];
  isExcited: boolean;
  maintenanceMode: boolean;
}
