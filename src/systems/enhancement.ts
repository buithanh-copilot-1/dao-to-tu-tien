import type { GameItem, Player } from '@/types/game';
import {
  getEnhancePreview,
  getMaxEnhanceLevel,
} from '@/data/enhancement';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import { calcStats } from '@/utils/stats';
import { findItem, isItemEquipped, removeItem } from './inventory';

export function countMaterial(player: Player, templateId: string): number {
  return player.inventory
    .filter((i) => i.templateId === templateId)
    .reduce((sum, i) => sum + i.quantity, 0);
}

function consumeByTemplate(player: Player, templateId: string, quantity: number): Player {
  let remaining = quantity;
  let updated = player;
  const stacks = updated.inventory.filter((i) => i.templateId === templateId && i.quantity > 0);

  for (const stack of stacks) {
    if (remaining <= 0) break;
    const take = Math.min(stack.quantity, remaining);
    updated = removeItem(updated, stack.id, take);
    remaining -= take;
  }

  return updated;
}

function consumeMaterials(
  player: Player,
  materials: Record<string, number>,
): { player: Player; error?: string } {
  for (const [templateId, qty] of Object.entries(materials)) {
    if (qty <= 0) continue;
    const name = ITEM_TEMPLATES[templateId]?.name ?? templateId;
    if (countMaterial(player, templateId) < qty) {
      return { player, error: `Thiếu ${name}` };
    }
  }

  let updated = player;
  for (const [templateId, qty] of Object.entries(materials)) {
    if (qty <= 0) continue;
    updated = consumeByTemplate(updated, templateId, qty);
  }

  return { player: updated };
}

export function canEnhanceItem(player: Player, itemId: string): string | null {
  const item = findItem(player, itemId);
  if (!item) return 'Không tìm thấy vật phẩm';
  if (item.category !== 'equipment') return 'Chỉ cường hóa trang bị';
  if (item.locked) return 'Vật phẩm đang khóa';

  const level = item.enhance ?? 0;
  if (level >= getMaxEnhanceLevel(item)) return 'Đã đạt cấp cường hóa tối đa';

  const preview = getEnhancePreview(item);
  if (player.gold < preview.cost.gold) return 'Không đủ vàng';
  if (player.crystal < preview.cost.crystal) return 'Không đủ linh thạch';
  if (countMaterial(player, 'ore_mithril') < preview.cost.ore) return 'Thiếu Huyền Thiết';
  if (countMaterial(player, 'crystal_shard') < preview.cost.shards) return 'Thiếu Linh Thạch Mảnh';

  return null;
}

export function enhanceItem(
  player: Player,
  itemId: string,
): { player: Player; success: boolean; message: string; error?: string } {
  const err = canEnhanceItem(player, itemId);
  if (err) return { player, success: false, message: '', error: err };

  const item = findItem(player, itemId)!;
  const preview = getEnhancePreview(item);
  const equipped = isItemEquipped(player, itemId);

  let updated: Player = {
    ...player,
    gold: player.gold - preview.cost.gold,
    crystal: player.crystal - preview.cost.crystal,
  };

  const matResult = consumeMaterials(updated, {
    ore_mithril: preview.cost.ore,
    crystal_shard: preview.cost.shards,
  });
  if (matResult.error) {
    return { player, success: false, message: '', error: matResult.error };
  }
  updated = matResult.player;

  const roll = Math.random() * 100;
  const success = roll < preview.successRate;

  if (!success) {
    return {
      player: updated,
      success: false,
      message: `Cường hóa thất bại! (${preview.successRate}% tỷ lệ)`,
    };
  }

  const nextLevel = preview.nextLevel;
  updated = {
    ...updated,
    inventory: updated.inventory.map((i) =>
      i.id === itemId ? { ...i, enhance: nextLevel } : i,
    ),
  };

  if (equipped) {
    updated = { ...updated, stats: calcStats(updated) };
  }

  return {
    player: updated,
    success: true,
    message: `${item.name} cường hóa +${nextLevel} thành công!`,
  };
}

export function getEnhanceableItems(player: Player): GameItem[] {
  return player.inventory.filter((i) => i.category === 'equipment');
}
