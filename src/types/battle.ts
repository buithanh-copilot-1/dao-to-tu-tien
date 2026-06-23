export type BattleMode = 'dungeon' | 'boss' | 'arena' | 'tower' | 'secret';

export interface BattleItemDrop {
  templateId: string;
  quantity: number;
}

export interface BattleRewards {
  gold?: number;
  crystal?: number;
  jade?: number;
  /** @deprecated dùng items */
  itemId?: string;
  items?: BattleItemDrop[];
  /** Có thể rơi thêm vật phẩm ngẫu nhiên */
  bonusDrop?: boolean;
}

export interface BattleWave {
  wave: number;
  name: string;
  icon: string;
  power: number;
  hp: number;
}

export interface BattleTarget {
  id: string;
  mode: BattleMode;
  title: string;
  subtitle?: string;
  playerIcon: string;
  waves: BattleWave[];
  rewards: BattleRewards;
}

export interface BattleLogEntry {
  round: number;
  text: string;
  side: 'player' | 'enemy' | 'system';
  damage?: number;
}

export interface WaveBattleResult {
  wave: number;
  win: boolean;
  rounds: number;
  log: BattleLogEntry[];
  playerHpLeft: number;
  enemyHpLeft: number;
}

export interface FullBattleResult {
  win: boolean;
  waves: WaveBattleResult[];
  totalRounds: number;
}
