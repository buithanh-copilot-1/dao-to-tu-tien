import type { EquipSlotType, GameItem, Rarity } from '@/types/game';
import equipWeapon from '@/assets/items/equip_weapon.png';
import equipArmor from '@/assets/items/equip_armor.png';
import equipHelmet from '@/assets/items/equip_helmet.png';
import equipBoots from '@/assets/items/equip_boots.png';
import equipBracelet from '@/assets/items/equip_bracelet.png';
import equipNecklace from '@/assets/items/equip_necklace.png';
import potionExp from '@/assets/items/potion_exp.png';
import potionSpirit from '@/assets/items/potion_spirit.png';
import potionHp from '@/assets/items/potion_hp.png';
import itemScroll from '@/assets/items/item_scroll.png';

export interface ItemTemplate {
  id: string;
  name: string;
  icon: string;
  category: GameItem['category'];
  rarity: Rarity;
  slot?: EquipSlotType;
  stats?: GameItem['stats'];
  sellPrice: number;
  description: string;
}

export const ITEM_TEMPLATES: Record<string, ItemTemplate> = {
  sword_qingyun: { id: 'sword_qingyun', name: 'Thanh Vân Kiếm', icon: equipWeapon, category: 'equipment', rarity: 'legendary', slot: 'weapon', stats: { attack: 1200, speed: 50 }, sellPrice: 50000, description: 'Thanh kiếm linh khí thanh vân, uy lực sắc bén, tăng công kích và thân pháp.' },
  armor_xuanbing: { id: 'armor_xuanbing', name: 'Huyền Băng Giáp', icon: equipArmor, category: 'equipment', rarity: 'legendary', slot: 'armor', stats: { defense: 800, hp: 5000 }, sellPrice: 45000, description: 'Giáp băng huyền cổ, bảo vệ toàn thân, tăng phòng ngự và khí huyết.' },
  helm_taiji: { id: 'helm_taiji', name: 'Thái Cực Mão', icon: equipHelmet, category: 'equipment', rarity: 'epic', slot: 'armor', stats: { defense: 400, hp: 2000 }, sellPrice: 20000, description: 'Mão thái cực hộ thể, củng cố thần thức và sinh mệnh.' },
  boots_lingfeng: { id: 'boots_lingfeng', name: 'Linh Phong Hài', icon: equipBoots, category: 'equipment', rarity: 'epic', slot: 'boots', stats: { speed: 120, defense: 200 }, sellPrice: 18000, description: 'Hài linh phong, nhẹ như gió, tăng thân pháp phi hành.' },
  ring_longwen: { id: 'ring_longwen', name: 'Long Văn Nhẫn', icon: 'item:ring', category: 'equipment', rarity: 'rare', slot: 'ring', stats: { attack: 300, spirit: 20 }, sellPrice: 8000, description: 'Nhẫn khắc long văn, gia tăng công kích và thần thức.' },
  pendant_jade: { id: 'pendant_jade', name: 'Ngọc Bội Tiên', icon: equipNecklace, category: 'equipment', rarity: 'rare', slot: 'pendant', stats: { hp: 1500, comprehension: 15 }, sellPrice: 7500, description: 'Ngọc bội tiên gia, hộ mệnh và tăng ngộ tính.' },
  bracer_iron: { id: 'bracer_iron', name: 'Thiết Hộ Thủ', icon: equipBracelet, category: 'equipment', rarity: 'rare', slot: 'bracer', stats: { defense: 350, attack: 150 }, sellPrice: 6000, description: 'Hộ thủ thiết cốt, cân bằng công thủ khi giao chiến.' },
  belt_cloud: { id: 'belt_cloud', name: 'Vân Ti Đái', icon: 'item:belt', category: 'equipment', rarity: 'epic', slot: 'belt', stats: { hp: 3000, defense: 250 }, sellPrice: 15000, description: 'Đai lưng vân ti, bệ trụ khí huyết vững chắc.' },
  treasure_mirror: { id: 'treasure_mirror', name: 'Huyền Minh Kính', icon: 'item:treasure', category: 'equipment', rarity: 'mythic', slot: 'treasure', stats: { spirit: 80, attack: 500 }, sellPrice: 60000, description: 'Pháp bảo huyền minh, phản chấn linh lực đối thủ.' },
  pill_qi: { id: 'pill_qi', name: 'Tụ Khí Đan', icon: potionExp, category: 'pill', rarity: 'uncommon', sellPrice: 100, description: 'Đan dược tụ linh khí, hấp thụ tăng tu vi nhanh chóng.' },
  pill_spirit: { id: 'pill_spirit', name: 'Ngưng Thần Đan', icon: potionSpirit, category: 'pill', rarity: 'rare', sellPrice: 500, description: 'Đan ngưng thần, củng cố thần thức và tu vi.' },
  pill_break: { id: 'pill_break', name: 'Đột Phá Đan', icon: potionHp, category: 'pill', rarity: 'epic', sellPrice: 2000, description: 'Đan hỗ trợ độ kiếp. Sử dụng trong lúc chuẩn bị độ kiếp để tăng 10% tỷ lệ thành công.' },
  crystal_shard: { id: 'crystal_shard', name: 'Linh Thạch Mảnh', icon: 'item:crystal', category: 'material', rarity: 'common', sellPrice: 10, description: 'Mảnh linh thạch, dùng cường hóa trang bị và luyện khí.' },
  herb_lingzhi: { id: 'herb_lingzhi', name: 'Linh Chi', icon: 'item:herb', category: 'material', rarity: 'uncommon', sellPrice: 50, description: 'Thảo dược linh khí, nguyên liệu luyện đan cơ bản.' },
  ore_mithril: { id: 'ore_mithril', name: 'Huyền Thiết', icon: 'item:ore', category: 'material', rarity: 'rare', sellPrice: 200, description: 'Khoáng thạch huyền thiết, dùng luyện khí và cường hóa.' },
  scroll_skill: { id: 'scroll_skill', name: 'Công Pháp Quyển', icon: itemScroll, category: 'other', rarity: 'epic', sellPrice: 5000, description: 'Quyển cổ ghi chép bí quyết tu luyện, quý hiếm.' },
  soul_shard: { id: 'soul_shard', name: 'Mảnh Hồn', icon: 'item:soul', category: 'material', rarity: 'rare', sellPrice: 300, description: 'Tinh hồn tàn dư, dùng luyện đan và luyện khí cao cấp.' },
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

export const STARTER_ITEMS = ['sword_qingyun', 'armor_xuanbing', 'pill_qi', 'pill_qi', 'herb_lingzhi', 'crystal_shard', 'crystal_shard', 'crystal_shard', 'ore_mithril', 'ore_mithril'];
