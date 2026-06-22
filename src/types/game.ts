export type ElementType = 'metal' | 'wood' | 'water' | 'fire' | 'earth';
export type Gender = 'male' | 'female';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type ItemCategory = 'equipment' | 'pill' | 'material' | 'other';
export type EquipSlotType = 'weapon' | 'armor' | 'bracer' | 'boots' | 'treasure' | 'belt' | 'ring' | 'pendant';
export type QuestType = 'daily' | 'main' | 'achievement';

export interface Realm {
  id: number;
  name: string;
  maxTier: number;
  baseRate: number;
  breakthroughBase: number;
  powerMultiplier: number;
}

export interface GameItem {
  id: string;
  templateId: string;
  name: string;
  icon: string;
  category: ItemCategory;
  rarity: Rarity;
  quantity: number;
  enhance?: number;
  locked?: boolean;
  slot?: EquipSlotType;
  stats?: Partial<PlayerStats>;
  sellPrice?: number;
}

export interface PlayerStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  spirit: number;
  comprehension: number;
}

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  rewards: { type: 'crystal' | 'gold' | 'jade' | 'item'; amount?: number; itemId?: string }[];
  claimed: boolean;
}

export interface EquipmentMap {
  weapon?: string;
  armor?: string;
  bracer?: string;
  boots?: string;
  treasure?: string;
  belt?: string;
  ring?: string;
  pendant?: string;
}

export interface OfflineRewards {
  cultivation: number;
  crystal: number;
  silver: number;
  items: GameItem[];
  powerGain: number;
  durationMs: number;
}

export interface Player {
  name: string;
  gender: Gender;
  element: ElementType;
  realmId: number;
  tier: number;
  cultivation: number;
  cultivationRate: number;
  autoCultivate: boolean;
  crystal: number;
  gold: number;
  jade: number;
  silver: number;
  inventory: GameItem[];
  equipment: EquipmentMap;
  inventoryCapacity: number;
  quests: Quest[];
  activityPoints: number;
  claimedMilestones: number[];
  stats: PlayerStats;
  totalPlaySeconds: number;
  breakthroughCount: number;
  dungeonClears: number;
  bossKills: number;
  arenaWins: number;
  createdAt: number;
  lastOnlineAt: number;
}

export interface GameSave {
  hasCharacter: boolean;
  player: Player | null;
  showOfflineReward: boolean;
  pendingOffline: OfflineRewards | null;
  leaderboardRefreshAt: number;
  lastDailyResetAt: number;
  dailyCounters: {
    dungeons: Record<string, number>;
    arena: number;
    bosses: Record<string, number>;
    tower: number;
  };
  towerBestFloor: number;
}
