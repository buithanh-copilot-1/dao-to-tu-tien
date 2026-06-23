import type { GameItem, PlayerStats, Rarity } from '@/types/game';

export const ENHANCE_BONUS_PER_LEVEL = 0.05;

export const MAX_ENHANCE_BY_RARITY: Record<Rarity, number> = {
  common: 8,
  uncommon: 10,
  rare: 15,
  epic: 18,
  legendary: 20,
  mythic: 25,
};

const RARITY_COST_MUL: Record<Rarity, number> = {
  common: 1,
  uncommon: 1.2,
  rare: 1.5,
  epic: 2,
  legendary: 2.8,
  mythic: 4,
};

export interface EnhanceCost {
  gold: number;
  crystal: number;
  ore: number;
  shards: number;
}

export interface EnhancePreview {
  currentLevel: number;
  nextLevel: number;
  maxLevel: number;
  cost: EnhanceCost;
  successRate: number;
  currentStats: Partial<PlayerStats>;
  nextStats: Partial<PlayerStats>;
  statDeltas: Partial<PlayerStats>;
}

export function getMaxEnhanceLevel(item: GameItem): number {
  return MAX_ENHANCE_BY_RARITY[item.rarity];
}

export function getEnhanceMultiplier(level: number): number {
  return 1 + level * ENHANCE_BONUS_PER_LEVEL;
}

export function getEnhanceSuccessRate(level: number): number {
  if (level < 5) return 100;
  if (level < 10) return 90;
  if (level < 15) return 75;
  if (level < 18) return 60;
  return 50;
}

export function getEnhanceCost(item: GameItem): EnhanceCost {
  const level = item.enhance ?? 0;
  const mul = RARITY_COST_MUL[item.rarity];
  const base = item.sellPrice ?? 1000;

  return {
    gold: Math.floor(base * 0.08 * (1 + level * 0.35) * mul),
    crystal: Math.floor((level + 1) * 80 * mul),
    ore: Math.max(1, Math.floor((level + 2) / 3)),
    shards: Math.max(2, Math.floor((level + 1) * 2 * mul)),
  };
}

export function scaleItemStats(
  stats: Partial<PlayerStats> | undefined,
  level: number,
): Partial<PlayerStats> {
  if (!stats) return {};
  const mul = getEnhanceMultiplier(level);
  const result: Partial<PlayerStats> = {};
  for (const k of Object.keys(stats) as (keyof PlayerStats)[]) {
    const v = stats[k] ?? 0;
    if (v) result[k] = Math.floor(v * mul);
  }
  return result;
}

export function getEnhancePreview(item: GameItem): EnhancePreview {
  const currentLevel = item.enhance ?? 0;
  const nextLevel = currentLevel + 1;
  const maxLevel = getMaxEnhanceLevel(item);
  const currentStats = scaleItemStats(item.stats, currentLevel);
  const nextStats = scaleItemStats(item.stats, nextLevel);
  const statDeltas: Partial<PlayerStats> = {};

  for (const k of Object.keys(nextStats) as (keyof PlayerStats)[]) {
    const delta = (nextStats[k] ?? 0) - (currentStats[k] ?? 0);
    if (delta) statDeltas[k] = delta;
  }

  return {
    currentLevel,
    nextLevel,
    maxLevel,
    cost: getEnhanceCost(item),
    successRate: getEnhanceSuccessRate(currentLevel),
    currentStats,
    nextStats,
    statDeltas,
  };
}
