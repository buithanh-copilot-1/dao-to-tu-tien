import type { EquipmentMap, Player } from '@/types/game';
import { calcStats } from '@/utils/stats';
import { findItem } from './inventory';
import equipWeapon from '@/assets/items/equip_weapon.png';
import equipArmor from '@/assets/items/equip_armor.png';
import equipBoots from '@/assets/items/equip_boots.png';
import equipBracelet from '@/assets/items/equip_bracelet.png';
import equipNecklace from '@/assets/items/equip_necklace.png';

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
  weapon: { label: 'Vũ khí', icon: equipWeapon },
  armor: { label: 'Giáp', icon: equipArmor },
  bracer: { label: 'Hộ thủ', icon: equipBracelet },
  boots: { label: 'Giày', icon: equipBoots },
  treasure: { label: 'Pháp bảo', icon: 'item:treasure' },
  belt: { label: 'Đai lưng', icon: 'item:belt' },
  ring: { label: 'Nhẫn', icon: 'item:ring' },
  pendant: { label: 'Ngọc bội', icon: equipNecklace },
};

export const EQUIP_SLOTS = Object.keys(EQUIP_SLOT_LABELS) as (keyof EquipmentMap)[];
