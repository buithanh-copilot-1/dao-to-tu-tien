import type { GameItem, ItemCategory, Player } from '@/types/game';
import { createItem } from '@/data/itemTemplates';

export function countUsedSlots(player: Player): number {
  return player.inventory.length;
}

export function hasInventorySpace(player: Player): boolean {
  return countUsedSlots(player) < player.inventoryCapacity;
}

export function findItem(player: Player, itemId: string): GameItem | undefined {
  return player.inventory.find((i) => i.id === itemId);
}

export function isItemEquipped(player: Player, itemId: string): boolean {
  return Object.values(player.equipment).includes(itemId);
}

export function addItem(player: Player, item: GameItem): { player: Player; error?: string } {
  if (!hasInventorySpace(player) && !player.inventory.some((i) => i.templateId === item.templateId && i.quantity < 999)) {
    return { player, error: 'Túi đồ đã đầy' };
  }

  const existing = player.inventory.find(
    (i) => i.templateId === item.templateId && i.category !== 'equipment' && !isItemEquipped(player, i.id),
  );

  if (existing && item.category !== 'equipment') {
    return {
      player: {
        ...player,
        inventory: player.inventory.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        ),
      },
    };
  }

  if (!hasInventorySpace(player)) {
    return { player, error: 'Túi đồ đã đầy' };
  }

  return { player: { ...player, inventory: [...player.inventory, item] } };
}

export function addItemByTemplate(player: Player, templateId: string, quantity = 1): { player: Player; error?: string } {
  return addItem(player, createItem(templateId, quantity));
}

export function removeItem(player: Player, itemId: string, quantity = 1): Player {
  const item = findItem(player, itemId);
  if (!item) return player;

  if (item.quantity <= quantity) {
    const equipment = { ...player.equipment };
    for (const slot of Object.keys(equipment) as (keyof typeof equipment)[]) {
      if (equipment[slot] === itemId) delete equipment[slot];
    }
    return {
      ...player,
      equipment,
      inventory: player.inventory.filter((i) => i.id !== itemId),
    };
  }

  return {
    ...player,
    inventory: player.inventory.map((i) =>
      i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i,
    ),
  };
}

export function sortInventory(player: Player): Player {
  const rarityOrder = { mythic: 0, legendary: 1, epic: 2, rare: 3, uncommon: 4, common: 5 };
  const sorted = [...player.inventory].sort((a, b) => {
    const cat = a.category.localeCompare(b.category);
    if (cat !== 0) return cat;
    const rar = rarityOrder[a.rarity] - rarityOrder[b.rarity];
    if (rar !== 0) return rar;
    return a.name.localeCompare(b.name);
  });
  return { ...player, inventory: sorted };
}

export function sellItem(player: Player, itemId: string, quantity = 1): { player: Player; error?: string; gold?: number } {
  const item = findItem(player, itemId);
  if (!item) return { player, error: 'Không tìm thấy vật phẩm' };
  if (item.locked) return { player, error: 'Vật phẩm đã khóa' };
  if (isItemEquipped(player, itemId)) return { player, error: 'Không thể bán trang bị đang mặc' };

  const sellQty = Math.min(quantity, item.quantity);
  const gold = (item.sellPrice ?? 0) * sellQty;
  const updated = removeItem(player, itemId, sellQty);
  return { player: { ...updated, gold: updated.gold + gold }, gold };
}

export function toggleLockItem(player: Player, itemId: string): Player {
  return {
    ...player,
    inventory: player.inventory.map((i) =>
      i.id === itemId ? { ...i, locked: !i.locked } : i,
    ),
  };
}

export function expandCapacity(player: Player, cost = 500): { player: Player; error?: string } {
  if (player.crystal < cost) return { player, error: 'Không đủ linh thạch' };
  return {
    player: {
      ...player,
      crystal: player.crystal - cost,
      inventoryCapacity: player.inventoryCapacity + 10,
    },
  };
}

export function filterInventory(player: Player, tab: string): GameItem[] {
  const items = player.inventory.filter((i) => !isItemEquipped(player, i.id) || tab === 'all');
  switch (tab) {
    case 'equip':
      return items.filter((i) => i.category === 'equipment');
    case 'pill':
      return items.filter((i) => i.category === 'pill');
    case 'item':
      return items.filter((i) => i.category === 'material');
    case 'other':
      return items.filter((i) => i.category === 'other');
    default:
      return player.inventory;
  }
}

export function usePill(player: Player, itemId: string): { player: Player; error?: string; message?: string } {
  const item = findItem(player, itemId);
  if (!item || item.category !== 'pill') return { player, error: 'Không phải đan dược' };

  let cultivationGain = 0;
  let message = '';

  switch (item.templateId) {
    case 'pill_qi':
      cultivationGain = 1000;
      message = 'Hấp thụ Tụ Khí Đan, tu vi +1,000';
      break;
    case 'pill_spirit':
      cultivationGain = 5000;
      message = 'Hấp thụ Ngưng Thần Đan, tu vi +5,000';
      break;
    case 'pill_break':
      cultivationGain = 2000;
      message = 'Hấp thụ Đột Phá Đan, tu vi +2,000';
      break;
    default:
      cultivationGain = 500;
      message = 'Hấp thụ đan dược, tu vi +500';
  }

  const updated = removeItem(player, itemId, 1);
  return {
    player: { ...updated, cultivation: updated.cultivation + cultivationGain },
    message,
  };
}

export function getCategoryLabel(cat: ItemCategory): string {
  const labels: Record<ItemCategory, string> = {
    equipment: 'Trang bị',
    pill: 'Đan dược',
    material: 'Nguyên liệu',
    other: 'Khác',
  };
  return labels[cat];
}
