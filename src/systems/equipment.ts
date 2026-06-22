import type { EquipmentMap, Player } from '@/types/game';
import { calcStats } from '@/utils/stats';
import { findItem } from './inventory';

export function equipItem(player: Player, itemId: string): { player: Player; error?: string } {
  const item = findItem(player, itemId);
  if (!item) return { player, error: 'Không tìm thấy vật phẩm' };
  if (item.category !== 'equipment' || !item.slot) return { player, error: 'Không thể trang bị vật phẩm này' };

  const slot = item.slot as keyof EquipmentMap;
  const currentEquipped = player.equipment[slot];

  if (currentEquipped === itemId) {
    return { player, error: 'Đã trang bị' };
  }

  const equipment: EquipmentMap = { ...player.equipment, [slot]: itemId };

  const updated: Player = {
    ...player,
    equipment,
    stats: calcStats({ ...player, equipment }),
  };

  return { player: updated };
}

export function unequipItem(player: Player, slot: keyof EquipmentMap): { player: Player; error?: string } {
  const itemId = player.equipment[slot];
  if (!itemId) return { player, error: 'Không có trang bị' };

  const equipment = { ...player.equipment };
  delete equipment[slot];

  return {
    player: {
      ...player,
      equipment,
      stats: calcStats({ ...player, equipment }),
    },
  };
}

export const EQUIP_SLOT_LABELS: Record<keyof EquipmentMap, { label: string; icon: string }> = {
  weapon: { label: 'Vũ khí', icon: '⚔️' },
  armor: { label: 'Giáp', icon: '🛡️' },
  bracer: { label: 'Hộ thủ', icon: '🥊' },
  boots: { label: 'Giày', icon: '👢' },
  treasure: { label: 'Pháp bảo', icon: '🔮' },
  belt: { label: 'Đai lưng', icon: '🎗️' },
  ring: { label: 'Nhẫn', icon: '💍' },
  pendant: { label: 'Ngọc bội', icon: '📿' },
};

export const EQUIP_SLOTS = Object.keys(EQUIP_SLOT_LABELS) as (keyof EquipmentMap)[];
