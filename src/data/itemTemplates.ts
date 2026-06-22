import type { EquipSlotType, GameItem, Rarity } from '@/types/game';

export interface ItemTemplate {
  id: string;
  name: string;
  icon: string;
  category: GameItem['category'];
  rarity: Rarity;
  slot?: EquipSlotType;
  stats?: GameItem['stats'];
  sellPrice: number;
}

export const ITEM_TEMPLATES: Record<string, ItemTemplate> = {
  sword_qingyun: { id: 'sword_qingyun', name: 'Thanh Vân Kiếm', icon: '⚔️', category: 'equipment', rarity: 'legendary', slot: 'weapon', stats: { attack: 1200, speed: 50 }, sellPrice: 50000 },
  armor_xuanbing: { id: 'armor_xuanbing', name: 'Huyền Băng Giáp', icon: '🛡️', category: 'equipment', rarity: 'legendary', slot: 'armor', stats: { defense: 800, hp: 5000 }, sellPrice: 45000 },
  helm_taiji: { id: 'helm_taiji', name: 'Thái Cực Mão', icon: '⛑️', category: 'equipment', rarity: 'epic', slot: 'armor', stats: { defense: 400, hp: 2000 }, sellPrice: 20000 },
  boots_lingfeng: { id: 'boots_lingfeng', name: 'Linh Phong Hài', icon: '👢', category: 'equipment', rarity: 'epic', slot: 'boots', stats: { speed: 120, defense: 200 }, sellPrice: 18000 },
  ring_longwen: { id: 'ring_longwen', name: 'Long Văn Nhẫn', icon: '💍', category: 'equipment', rarity: 'rare', slot: 'ring', stats: { attack: 300, spirit: 20 }, sellPrice: 8000 },
  pendant_jade: { id: 'pendant_jade', name: 'Ngọc Bội Tiên', icon: '📿', category: 'equipment', rarity: 'rare', slot: 'pendant', stats: { hp: 1500, comprehension: 15 }, sellPrice: 7500 },
  bracer_iron: { id: 'bracer_iron', name: 'Thiết Hộ Thủ', icon: '🥊', category: 'equipment', rarity: 'rare', slot: 'bracer', stats: { defense: 350, attack: 150 }, sellPrice: 6000 },
  belt_cloud: { id: 'belt_cloud', name: 'Vân Ti Đái', icon: '🎗️', category: 'equipment', rarity: 'epic', slot: 'belt', stats: { hp: 3000, defense: 250 }, sellPrice: 15000 },
  treasure_mirror: { id: 'treasure_mirror', name: 'Huyền Minh Kính', icon: '🔮', category: 'equipment', rarity: 'legendary', slot: 'treasure', stats: { spirit: 80, attack: 500 }, sellPrice: 60000 },
  pill_qi: { id: 'pill_qi', name: 'Tụ Khí Đan', icon: '💊', category: 'pill', rarity: 'uncommon', sellPrice: 100 },
  pill_spirit: { id: 'pill_spirit', name: 'Ngưng Thần Đan', icon: '🔵', category: 'pill', rarity: 'rare', sellPrice: 500 },
  pill_break: { id: 'pill_break', name: 'Đột Phá Đan', icon: '🟠', category: 'pill', rarity: 'epic', sellPrice: 2000 },
  crystal_shard: { id: 'crystal_shard', name: 'Linh Thạch Mảnh', icon: '💎', category: 'material', rarity: 'common', sellPrice: 10 },
  herb_lingzhi: { id: 'herb_lingzhi', name: 'Linh Chi', icon: '🌿', category: 'material', rarity: 'uncommon', sellPrice: 50 },
  ore_mithril: { id: 'ore_mithril', name: 'Huyền Thiết', icon: '🪨', category: 'material', rarity: 'rare', sellPrice: 200 },
  scroll_skill: { id: 'scroll_skill', name: 'Công Pháp Quyển', icon: '📜', category: 'other', rarity: 'epic', sellPrice: 5000 },
  soul_shard: { id: 'soul_shard', name: 'Mảnh Hồn', icon: '👻', category: 'material', rarity: 'rare', sellPrice: 300 },
};

export function createItem(templateId: string, quantity = 1, enhance = 0): GameItem {
  const t = ITEM_TEMPLATES[templateId];
  if (!t) throw new Error(`Unknown item: ${templateId}`);
  return {
    id: `${templateId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    templateId,
    name: t.name,
    icon: t.icon,
    category: t.category,
    rarity: t.rarity,
    quantity,
    enhance,
    slot: t.slot,
    stats: t.stats ? { ...t.stats } : undefined,
    sellPrice: t.sellPrice,
  };
}

export const STARTER_ITEMS = ['sword_qingyun', 'armor_xuanbing', 'pill_qi', 'pill_qi', 'herb_lingzhi', 'crystal_shard'];
