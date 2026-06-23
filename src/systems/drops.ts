import type { ArenaOpponent } from '@/data/arena';
import { ARENA_OPPONENTS } from '@/data/arena';
import type { BossDef, DungeonDef } from '@/data/dungeons';
import { BOSSES, DUNGEONS } from '@/data/dungeons';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import type { SecretRealmDef } from '@/data/secretRealm';
import { getSecretRealm } from '@/data/secretRealm';
import type { TowerFloorDef } from '@/data/tower';
import { getTowerFloor } from '@/data/tower';
import type { BattleMode } from '@/types/battle';
import type { Player } from '@/types/game';
import { addItemByTemplate } from './inventory';

export interface DroppedItem {
  templateId: string;
  quantity: number;
}

export interface BattleLoot {
  items: DroppedItem[];
  /** Mô tả ngắn cho toast / UI */
  summary: string;
}

const EMPTY_LOOT: BattleLoot = { items: [], summary: '' };

function rollChance(p: number): boolean {
  return Math.random() < p;
}

function rollInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickWeighted<T extends { weight: number }>(entries: T[]): T | null {
  if (entries.length === 0) return null;
  const total = entries.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of entries) {
    r -= e.weight;
    if (r <= 0) return e;
  }
  return entries[entries.length - 1];
}

function mergeDrops(items: DroppedItem[]): DroppedItem[] {
  const map = new Map<string, number>();
  for (const { templateId, quantity } of items) {
    map.set(templateId, (map.get(templateId) ?? 0) + quantity);
  }
  return [...map.entries()].map(([templateId, quantity]) => ({ templateId, quantity }));
}

function pushDrop(items: DroppedItem[], templateId: string, quantity: number) {
  if (quantity <= 0) return;
  items.push({ templateId, quantity });
}

function finalize(items: DroppedItem[]): BattleLoot {
  const merged = mergeDrops(items);
  return { items: merged, summary: formatLootSummary(merged) };
}

/** Trang bị rơi theo cảnh giới */
function rollEquipmentDrop(minRealmId: number, chance: number): DroppedItem | null {
  if (!rollChance(chance)) return null;

  const pools: Record<number, { id: string; weight: number }[]> = {
    0: [
      { id: 'bracer_iron', weight: 40 },
      { id: 'ring_longwen', weight: 35 },
      { id: 'pendant_jade', weight: 25 },
    ],
    1: [
      { id: 'bracer_iron', weight: 20 },
      { id: 'ring_longwen', weight: 20 },
      { id: 'pendant_jade', weight: 15 },
      { id: 'boots_lingfeng', weight: 25 },
      { id: 'helm_taiji', weight: 20 },
    ],
    2: [
      { id: 'boots_lingfeng', weight: 25 },
      { id: 'belt_cloud', weight: 25 },
      { id: 'helm_taiji', weight: 25 },
      { id: 'bracer_iron', weight: 15 },
      { id: 'ring_longwen', weight: 10 },
    ],
    3: [
      { id: 'belt_cloud', weight: 30 },
      { id: 'helm_taiji', weight: 25 },
      { id: 'boots_lingfeng', weight: 20 },
      { id: 'treasure_mirror', weight: 8 },
      { id: 'armor_xuanbing', weight: 5 },
      { id: 'sword_qingyun', weight: 5 },
    ],
  };

  const tier = Math.min(minRealmId, 3);
  const pool = pools[tier] ?? pools[3];
  const picked = pickWeighted(pool);
  return picked ? { templateId: picked.id, quantity: 1 } : null;
}

/** Rơi đồ cơ bản khi hạ quái thường (theo cấp độ) */
function rollCommonMonsterDrops(tier: number, options?: { boost?: number }): DroppedItem[] {
  const items: DroppedItem[] = [];
  const boost = options?.boost ?? 1;

  if (rollChance(0.45 * boost)) {
    pushDrop(items, 'herb_lingzhi', rollInt(1, 2 + Math.min(tier, 3)));
  }
  if (rollChance(0.35 * boost)) {
    pushDrop(items, 'crystal_shard', rollInt(1, 2 + tier));
  }
  if (tier >= 1 && rollChance(0.18 * boost)) {
    pushDrop(items, 'ore_mithril', rollInt(1, 1 + Math.floor(tier / 2)));
  }
  if (tier >= 2 && rollChance(0.12 * boost)) {
    pushDrop(items, 'pill_qi', rollInt(1, 2));
  }
  if (tier >= 3 && rollChance(0.06 * boost)) {
    pushDrop(items, 'pill_spirit', 1);
  }

  const equip = rollEquipmentDrop(Math.min(tier, 3), (0.025 + tier * 0.01) * boost);
  if (equip) items.push(equip);

  return items;
}

export function rollDungeonDrops(dungeon: DungeonDef): BattleLoot {
  const items: DroppedItem[] = [];
  const tier = dungeon.minRealmId;

  items.push(...rollCommonMonsterDrops(tier, { boost: 1.15 }));

  if (dungeon.itemDrop && rollChance(0.78)) {
    pushDrop(items, dungeon.itemDrop, rollInt(1, 2 + Math.min(tier, 2)));
  }

  if (rollChance(0.32)) {
    pushDrop(items, 'crystal_shard', rollInt(1, 3 + tier));
  }

  if (dungeon.itemDrop !== 'herb_lingzhi' && rollChance(0.22)) {
    pushDrop(items, 'herb_lingzhi', rollInt(1, 2 + tier));
  }

  if (tier >= 1 && rollChance(0.18)) {
    pushDrop(items, 'ore_mithril', rollInt(1, 1 + tier));
  }

  if (tier >= 2 && rollChance(0.12)) {
    pushDrop(items, 'pill_qi', rollInt(1, 2));
  }

  if (tier >= 2 && rollChance(0.08)) {
    pushDrop(items, 'pill_spirit', 1);
  }

  const equip = rollEquipmentDrop(tier, 0.04 + tier * 0.012);
  if (equip) items.push(equip);

  return finalize(items);
}

export function rollBossDrops(boss: BossDef): BattleLoot {
  const items: DroppedItem[] = [];
  const tier = boss.minRealmId;

  pushDrop(items, 'crystal_shard', rollInt(2 + tier, 5 + tier * 2));

  if (rollChance(0.65)) {
    pushDrop(items, 'ore_mithril', rollInt(1, 2 + Math.floor(tier / 2)));
  }

  if (tier >= 1 && rollChance(0.45)) {
    pushDrop(items, 'herb_lingzhi', rollInt(2, 4 + tier));
  }

  if (tier >= 2 && rollChance(0.35)) {
    pushDrop(items, 'pill_spirit', rollInt(1, 1 + Math.floor(tier / 3)));
  }

  if (tier >= 3 && rollChance(0.28)) {
    pushDrop(items, 'soul_shard', rollInt(1, 2));
  }

  if (tier >= 4 && rollChance(0.15)) {
    pushDrop(items, 'pill_break', 1);
  }

  if (tier >= 5 && rollChance(0.08)) {
    pushDrop(items, 'scroll_skill', 1);
  }

  const equipChance = 0.1 + tier * 0.025;
  const equip = rollEquipmentDrop(tier, equipChance);
  if (equip) items.push(equip);

  return finalize(items);
}

export function rollTowerDrops(floor: TowerFloorDef): BattleLoot {
  const items: DroppedItem[] = [];
  const tier = Math.ceil(floor.floor / 50);

  if (floor.isChapterBoss) {
    pushDrop(items, 'crystal_shard', rollInt(5, 10 + tier * 2));
    pushDrop(items, 'ore_mithril', rollInt(2, 4 + tier));
    pushDrop(items, 'soul_shard', rollInt(1, 2));
    if (rollChance(0.6)) pushDrop(items, 'pill_spirit', rollInt(1, 2));
    const equip = rollEquipmentDrop(Math.min(tier + 1, 3), 0.35);
    if (equip) items.push(equip);
    return finalize(items);
  }

  if (floor.isMilestone) {
    pushDrop(items, 'ore_mithril', rollInt(1, 2 + tier));
    if (rollChance(0.5)) pushDrop(items, 'pill_qi', rollInt(2, 4));
    if (floor.floor >= 30 && rollChance(0.35)) {
      pushDrop(items, 'soul_shard', 1);
    }
    const equip = rollEquipmentDrop(Math.min(tier, 3), 0.06 + tier * 0.02);
    if (equip) items.push(equip);
  }

  if (floor.floor % 5 === 0) {
    pushDrop(items, 'crystal_shard', rollInt(2, 4 + tier));
  } else if (rollChance(0.28)) {
    pushDrop(items, 'crystal_shard', rollInt(1, 2));
  }

  if (floor.floor % 10 === 0) {
    pushDrop(items, 'herb_lingzhi', rollInt(1, 3));
  }

  items.push(...rollCommonMonsterDrops(Math.min(tier, 3), { boost: 0.85 + tier * 0.05 }));

  return finalize(items);
}

export function rollArenaDrops(opponent: ArenaOpponent): BattleLoot {
  const items: DroppedItem[] = [];
  const tier = ARENA_OPPONENTS.findIndex((o) => o.id === opponent.id);

  items.push(...rollCommonMonsterDrops(Math.max(0, tier), { boost: 0.75 }));

  if (rollChance(0.55)) {
    pushDrop(items, 'herb_lingzhi', rollInt(1, 2));
  }
  if (rollChance(0.35)) {
    pushDrop(items, 'crystal_shard', rollInt(1, 3));
  }
  if (tier >= 2 && rollChance(0.2)) {
    pushDrop(items, 'pill_qi', 1);
  }
  if (tier >= 3 && rollChance(0.15)) {
    pushDrop(items, 'ore_mithril', 1);
  }
  if (tier >= 4 && rollChance(0.08)) {
    const equip = rollEquipmentDrop(2, 0.06);
    if (equip) items.push(equip);
  }

  return finalize(items);
}

export function rollSecretRealmDrops(realm: SecretRealmDef): BattleLoot {
  const items: DroppedItem[] = [];
  const tier = realm.minRealmId;

  if (realm.dropId && rollChance(0.88)) {
    pushDrop(items, realm.dropId, rollInt(1, 2 + Math.floor(tier / 3)));
  }

  items.push(...rollCommonMonsterDrops(Math.min(tier, 3), { boost: 1.25 }));

  if (rollChance(0.55)) {
    pushDrop(items, 'crystal_shard', rollInt(2, 4 + tier));
  }
  if (tier >= 2 && rollChance(0.35)) {
    pushDrop(items, 'ore_mithril', rollInt(1, 2));
  }
  if (tier >= 4 && rollChance(0.2)) {
    pushDrop(items, 'soul_shard', 1);
  }

  const equip = rollEquipmentDrop(Math.min(tier, 3), 0.05 + tier * 0.015);
  if (equip) items.push(equip);

  return finalize(items);
}

export function rollBattleLoot(
  mode: BattleMode,
  ctx: { dungeon?: DungeonDef; boss?: BossDef; tower?: TowerFloorDef; arena?: ArenaOpponent; secret?: SecretRealmDef },
): BattleLoot {
  if (mode === 'dungeon' && ctx.dungeon) return rollDungeonDrops(ctx.dungeon);
  if (mode === 'boss' && ctx.boss) return rollBossDrops(ctx.boss);
  if (mode === 'tower' && ctx.tower) return rollTowerDrops(ctx.tower);
  if (mode === 'arena' && ctx.arena) return rollArenaDrops(ctx.arena);
  if (mode === 'secret' && ctx.secret) return rollSecretRealmDrops(ctx.secret);
  return EMPTY_LOOT;
}

export function rollBattleLootForTarget(
  mode: BattleMode,
  targetId: string,
  towerFloor?: number,
): BattleLoot {
  if (mode === 'dungeon') {
    const dungeon = DUNGEONS.find((d) => d.id === targetId);
    return dungeon ? rollBattleLoot('dungeon', { dungeon }) : EMPTY_LOOT;
  }
  if (mode === 'boss') {
    const boss = BOSSES.find((b) => b.id === targetId);
    return boss ? rollBattleLoot('boss', { boss }) : EMPTY_LOOT;
  }
  if (mode === 'arena') {
    const arena = ARENA_OPPONENTS.find((o) => o.id === targetId);
    return arena ? rollBattleLoot('arena', { arena }) : EMPTY_LOOT;
  }
  if (mode === 'tower') {
    const floor = towerFloor ?? 1;
    const tower = getTowerFloor(floor);
    return rollBattleLoot('tower', { tower });
  }
  if (mode === 'secret') {
    const secret = getSecretRealm(targetId);
    return secret ? rollBattleLoot('secret', { secret }) : EMPTY_LOOT;
  }
  return EMPTY_LOOT;
}

export function applyBattleLoot(player: Player, loot: BattleLoot): Player {
  let updated = player;
  for (const drop of loot.items) {
    const result = addItemByTemplate(updated, drop.templateId, drop.quantity);
    updated = result.player;
  }
  return updated;
}

export function formatLootSummary(items: DroppedItem[]): string {
  if (items.length === 0) return '';
  return items
    .map(({ templateId, quantity }) => {
      const name = ITEM_TEMPLATES[templateId]?.name ?? templateId;
      return quantity > 1 ? `${name} ×${quantity}` : name;
    })
    .join(', ');
}

/** Xem trước phần thưởng vật phẩm (hiển thị UI) */
export function getDropPreviewItems(
  mode: BattleMode,
  ctx: { dungeon?: DungeonDef; boss?: BossDef; tower?: TowerFloorDef; arena?: ArenaOpponent; secret?: SecretRealmDef },
): DroppedItem[] {
  if (mode === 'dungeon' && ctx.dungeon) {
    const items: DroppedItem[] = [
      { templateId: 'herb_lingzhi', quantity: 1 },
      { templateId: 'crystal_shard', quantity: 1 },
    ];
    if (ctx.dungeon.itemDrop) {
      items.unshift({ templateId: ctx.dungeon.itemDrop, quantity: 1 });
    }
    return items;
  }
  if (mode === 'boss' && ctx.boss) {
    return [
      { templateId: 'crystal_shard', quantity: 1 },
      { templateId: 'ore_mithril', quantity: 1 },
      { templateId: 'soul_shard', quantity: 1 },
    ];
  }
  if (mode === 'arena') {
    return [
      { templateId: 'herb_lingzhi', quantity: 1 },
      { templateId: 'crystal_shard', quantity: 1 },
    ];
  }
  if (mode === 'tower' && ctx.tower) {
    const items: DroppedItem[] = [
      { templateId: 'herb_lingzhi', quantity: 1 },
      { templateId: 'crystal_shard', quantity: 1 },
    ];
    if (ctx.tower.isMilestone || ctx.tower.floor % 5 === 0) {
      items.push({ templateId: 'ore_mithril', quantity: 1 });
    }
    if (ctx.tower.isChapterBoss) {
      items.push({ templateId: 'soul_shard', quantity: 1 });
    }
    return items;
  }
  if (mode === 'secret' && ctx.secret) {
    return getSecretDropPreview(ctx.secret);
  }
  return [];
}

export function getSecretDropPreview(realm: SecretRealmDef): DroppedItem[] {
  const items: DroppedItem[] = [
    { templateId: 'crystal_shard', quantity: 1 },
    { templateId: 'herb_lingzhi', quantity: 1 },
  ];
  if (realm.dropId) {
    items.unshift({ templateId: realm.dropId, quantity: 1 });
  }
  return items;
}
