import type { EquipmentMap, GameItem, Player, PlayerStats } from '@/types/game';
import type { AncientIconName } from '@/components/common/AncientIcon';
import { getEnhanceMultiplier, scaleItemStats } from '@/data/enhancement';
import { getBreakthroughCost, getRealmGapMultiplier, getRealmPowerScale } from '@/data/realms';
import { getSectStatBonus } from '@/data/sects';
import { getTechniqueStatBonus, getTechniqueRateMultiplier } from '@/data/techniques';
import { getTalentStatBonus } from '@/data/talents';
import { PETS, MOUNTS, getCompanionBonus } from '@/data/companions';
import { getSpiritRootStatMultiplier } from '@/data/spiritRoot';
import { EQUIP_SLOT_LABELS } from '@/systems/equipment';

/** Nhãn + icon cổ phong cho từng chỉ số */
export const STAT_META: Record<keyof PlayerStats, { label: string; icon: AncientIconName }> = {
  hp: { label: 'Khí Huyết', icon: 'heart' },
  attack: { label: 'Công Kích', icon: 'sword' },
  defense: { label: 'Phòng Ngự', icon: 'shield' },
  speed: { label: 'Thân Pháp', icon: 'bolt' },
  spirit: { label: 'Thần Thức', icon: 'swirl' },
  comprehension: { label: 'Ngộ Tính', icon: 'eye' },
};

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

/**
 * Tổng chỉ số cộng từ các hệ thống tu luyện (tông môn, công pháp, thiên phú…).
 * Mọi feature buff passive cắm vào đây để được tính chung vào chỉ số/lực chiến.
 */
export function calcBonusStats(player: Player): Partial<PlayerStats> {
  const total: Partial<PlayerStats> = {};
  const add = (src: Partial<PlayerStats>) => {
    for (const k of Object.keys(src) as (keyof PlayerStats)[]) {
      total[k] = (total[k] ?? 0) + (src[k] ?? 0);
    }
  };

  if (player.sect) add(getSectStatBonus(player.sect.id, player.sect.rank));
  add(getTechniqueStatBonus(player.techniques));
  add(getTalentStatBonus(player.talents));
  add(getCompanionBonus(PETS, player.pets, player.activePet));
  add(getCompanionBonus(MOUNTS, player.mounts, player.activeMount));

  return total;
}

/** Hệ số nhân tốc độ tu luyện từ các hệ thống (công pháp…). Mặc định 1. */
export function getCultivationRateBonus(player: Player): number {
  return getTechniqueRateMultiplier(player.techniques);
}

/** Hệ số sức mạnh vĩnh viễn từ phi thăng (+10% mỗi lần). */
export function getAscensionMultiplier(player: Player): number {
  return 1 + (player.ascensionCount ?? 0) * 0.1;
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
    const elemScale = getSpiritRootStatMultiplier(player.spiritRootLevel ?? 1);
    for (const k of Object.keys(elem) as (keyof PlayerStats)[]) {
      base[k] += Math.floor((elem[k] ?? 0) * elemScale);
    }
  }

  for (const item of getEquippedItems(player)) {
    const enhanced = scaleItemStats(item.stats, item.enhance ?? 0);
    for (const k of Object.keys(enhanced) as (keyof PlayerStats)[]) {
      base[k] += enhanced[k] ?? 0;
    }
  }

  const bonus = calcBonusStats(player);
  for (const k of Object.keys(bonus) as (keyof PlayerStats)[]) {
    base[k] += bonus[k] ?? 0;
  }

  const asc = getAscensionMultiplier(player);
  if (asc !== 1) {
    for (const k of Object.keys(base) as (keyof PlayerStats)[]) {
      base[k] = Math.floor(base[k] * asc);
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

/** Chênh lệch lực chiến nếu thay trang bị slot bằng item mới */
export function calcEquipPowerDelta(player: Player, item: GameItem): number {
  if (item.category !== 'equipment' || !item.slot) return 0;
  const current = calcCombatPower(player);
  const equipment = { ...player.equipment, [item.slot]: item.id };
  return calcCombatPower({ ...player, equipment }) - current;
}

export interface EquipCompareRow {
  key: keyof PlayerStats;
  label: string;
  icon: AncientIconName;
  /** Chỉ số từ đồ đang mặc */
  equippedValue: number;
  /** Chỉ số từ đồ mới */
  newValue: number;
  /** Chênh lệch trên tổng nhân vật (sau khi mặc) */
  playerDelta: number;
  playerBefore: number;
  playerAfter: number;
}

export interface EquipCompareData {
  equipped: GameItem | null;
  newItem: GameItem;
  powerBefore: number;
  powerAfter: number;
  powerDelta: number;
  rows: EquipCompareRow[];
}

export function buildEquipCompare(player: Player, item: GameItem): EquipCompareData | null {
  if (item.category !== 'equipment' || !item.slot) return null;

  const equipped = getItemByEquipSlot(player, item.slot) ?? null;
  const equippedStats = equipped ? getItemEnhancedStats(equipped) : {};
  const newStats = getItemEnhancedStats(item);

  const hypothetical: Player = {
    ...player,
    equipment: { ...player.equipment, [item.slot]: item.id },
  };

  const powerBefore = calcCombatPower(player);
  const powerAfter = calcCombatPower(hypothetical);
  const displayBefore = calcDisplayStats(player);
  const displayAfter = calcDisplayStats(hypothetical);

  const keys = new Set<keyof PlayerStats>([
    ...(Object.keys(STAT_WEIGHTS) as (keyof PlayerStats)[]),
  ]);

  const rows: EquipCompareRow[] = [];
  for (const key of keys) {
    const equippedValue = equippedStats[key] ?? 0;
    const newValue = newStats[key] ?? 0;
    const playerBefore = displayBefore[key];
    const playerAfter = displayAfter[key];
    const playerDelta = playerAfter - playerBefore;

    if (equippedValue === 0 && newValue === 0 && playerDelta === 0) continue;

    rows.push({
      key,
      label: STAT_META[key].label,
      icon: STAT_META[key].icon,
      equippedValue,
      newValue,
      playerDelta,
      playerBefore,
      playerAfter,
    });
  }

  rows.sort((a, b) => Math.abs(b.playerDelta) - Math.abs(a.playerDelta));

  return {
    equipped,
    newItem: item,
    powerBefore,
    powerAfter,
    powerDelta: powerAfter - powerBefore,
    rows,
  };
}

export function canEquip(item: GameItem, slot: keyof EquipmentMap): boolean {
  return item.category === 'equipment' && item.slot === slot;
}

export function getItemByEquipSlot(player: Player, slot: keyof EquipmentMap): GameItem | undefined {
  const id = player.equipment[slot];
  return id ? player.inventory.find((i) => i.id === id) : undefined;
}

export function getItemEnhancedStats(item: GameItem): Partial<PlayerStats> {
  return scaleItemStats(item.stats, item.enhance ?? 0);
}

export interface EquipmentStatBreakdown {
  total: Partial<PlayerStats>;
  bySlot: Partial<Record<keyof EquipmentMap, { label: string; icon: string; stats: Partial<PlayerStats> }>>;
}

export function calcEquipmentStatBreakdown(player: Player): EquipmentStatBreakdown {
  const total: Partial<PlayerStats> = {};
  const bySlot: EquipmentStatBreakdown['bySlot'] = {};

  for (const slot of Object.keys(EQUIP_SLOT_LABELS) as (keyof EquipmentMap)[]) {
    const item = getItemByEquipSlot(player, slot);
    if (!item?.stats) continue;

    const stats = getItemEnhancedStats(item);
    bySlot[slot] = {
      label: EQUIP_SLOT_LABELS[slot].label,
      icon: EQUIP_SLOT_LABELS[slot].icon,
      stats,
    };

    for (const k of Object.keys(stats) as (keyof PlayerStats)[]) {
      total[k] = (total[k] ?? 0) + (stats[k] ?? 0);
    }
  }

  return { total, bySlot };
}

export { getEnhanceMultiplier };
