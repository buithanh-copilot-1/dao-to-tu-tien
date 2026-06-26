export type ElementType = 'metal' | 'wood' | 'water' | 'fire' | 'earth';
export type Gender = 'male' | 'female';
/** common -> Trắng, uncommon -> Lam, rare -> Lục, epic -> Vàng, legendary -> Cam, mythic -> Đỏ. */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type ItemCategory = 'equipment' | 'pill' | 'material' | 'other';
export type EquipSlotType = 'weapon' | 'armor' | 'bracer' | 'boots' | 'treasure' | 'belt' | 'ring' | 'pendant';
export type QuestType = 'daily' | 'main' | 'achievement';
export type BattleSpeed = 'slow' | 'normal' | 'fast';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  reducedMotion: boolean;
  battleSpeed: BattleSpeed;
  autoClaimOffline: boolean;
  showPowerDelta: boolean;
}

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

/** Trạng thái gia nhập tông môn. `rank` 0-based theo bậc trong data/sects. */
export interface SectState {
  id: string;
  rank: number;
  contribution: number;
}

export interface Player {
  name: string;
  gender: Gender;
  element: ElementType;
  realmId: number;
  tier: number;
  /** Tông môn đang gia nhập (nếu có) */
  sect?: SectState;
  /** Công pháp đã lĩnh ngộ: id công pháp → cấp độ (1+) */
  techniques?: Record<string, number>;
  /** Thiên phú đã điểm: id thiên phú → số điểm đã đầu tư */
  talents?: Record<string, number>;
  /** Linh thú sở hữu: id → cấp; linh thú đang xuất chiến */
  pets?: Record<string, number>;
  activePet?: string;
  /** Tọa kỵ sở hữu: id → cấp; tọa kỵ đang cưỡi */
  mounts?: Record<string, number>;
  activeMount?: string;
  /** Số lần phi thăng — mỗi lần +10% toàn bộ chỉ số vĩnh viễn */
  ascensionCount?: number;
  /** Cấp linh căn (1–10), tăng chỉ số ngũ hành */
  spiritRootLevel?: number;
  /** Cấp độ linh căn của 5 ngũ hành (metal, wood, water, fire, earth) */
  spiritRoots?: Record<ElementType, number>;
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
  settings: GameSettings;
  showOfflineReward: boolean;
  pendingOffline: OfflineRewards | null;
  leaderboardRefreshAt: number;
  lastDailyResetAt: number;
  dailyCounters: {
    dungeons: Record<string, number>;
    arena: number;
    bosses: Record<string, number>;
    secret: Record<string, number>;
  };
  towerBestFloor: number;
}
