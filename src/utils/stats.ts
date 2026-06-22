import type { EquipmentMap, GameItem, Player, PlayerStats } from '@/types/game';
import { getBreakthroughCost, getRealmGapMultiplier, getRealmPowerScale } from '@/data/realms';

const ELEMENT_STATS: Record<string, Partial<PlayerStats>> = {
  metal: { attack: 50, defense: 30 },
  wood: { hp: 500, comprehension: 10 },
  water: { spirit: 20, speed: 15 },
  fire: { attack: 80, speed: 10 },
  earth: { defense: 60, hp: 800 },
};

const STAT_WEIGHTS: Record<keyof PlayerStats, number> = {
  hp: 0.5,
  attack: 3,
  defense: 2,
  speed: 5,
  spirit: 4,
  comprehension: 0.5,
};

export function getEquippedItems(player: Player): GameItem[] {
  return Object.values(player.equipment)
    .filter(Boolean)
    .map((id) => player.inventory.find((i) => i.id === id))
    .filter((i): i is GameItem => !!i);
}

export function calcStats(player: Player): PlayerStats {
  const scale = getRealmPowerScale(player.realmId, player.tier);

  const base: PlayerStats = {
    hp: Math.floor(180 * scale),
    attack: Math.floor(18 * scale),
    defense: Math.floor(11 * scale),
    speed: Math.floor(3.5 * scale),
    spirit: Math.floor(5 * scale),
    comprehension: Math.floor(8 + player.tier * 2 + player.realmId * 4),
  };

  const elem = ELEMENT_STATS[player.element];
  if (elem) {
    for (const k of Object.keys(elem) as (keyof PlayerStats)[]) {
      base[k] += elem[k] ?? 0;
    }
  }

  for (const item of getEquippedItems(player)) {
    const enhanceMul = 1 + (item.enhance ?? 0) * 0.05;
    if (item.stats) {
      for (const k of Object.keys(item.stats) as (keyof PlayerStats)[]) {
        base[k] += Math.floor((item.stats[k] ?? 0) * enhanceMul);
      }
    }
  }

  return base;
}

/** Hệ số nhân từ cảnh giới + tiến độ tu vi (dùng chung cho lực chiến & chỉ số hiển thị) */
export function getStatPowerMultiplier(player: Player): number {
  const realmGap = getRealmGapMultiplier(player.realmId);
  const breakthroughCost = getBreakthroughCost(player.realmId, player.tier);
  const cultivationRatio = breakthroughCost > 0 && breakthroughCost !== Infinity
    ? Math.min(player.cultivation / breakthroughCost, 1)
    : 0;
  return realmGap + cultivationRatio * 0.15;
}

/** Chỉ số hiển thị — đã nhân hệ số cảnh giới, khớp với lực chiến */
export function calcDisplayStats(player: Player): PlayerStats {
  const base = calcStats(player);
  const mul = getStatPowerMultiplier(player);
  const result = {} as PlayerStats;
  for (const k of Object.keys(base) as (keyof PlayerStats)[]) {
    result[k] = Math.floor(base[k] * mul);
  }
  return result;
}

function sumStatPower(stats: PlayerStats): number {
  let total = 0;
  for (const k of Object.keys(STAT_WEIGHTS) as (keyof PlayerStats)[]) {
    total += stats[k] * STAT_WEIGHTS[k];
  }
  return total;
}

export function calcCombatPower(player: Player): number {
  const stats = calcStats(player);
  const statPower = sumStatPower(stats);
  return Math.floor(statPower * getStatPowerMultiplier(player));
}

export function canEquip(item: GameItem, slot: keyof EquipmentMap): boolean {
  return item.category === 'equipment' && item.slot === slot;
}

export function getItemByEquipSlot(player: Player, slot: keyof EquipmentMap): GameItem | undefined {
  const id = player.equipment[slot];
  return id ? player.inventory.find((i) => i.id === id) : undefined;
}
