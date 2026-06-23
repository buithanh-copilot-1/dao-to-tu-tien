import { ALCHEMY_RECIPES } from '@/data/alchemy';
import { DUNGEONS } from '@/data/dungeons';
import { FORGE_RECIPES } from '@/data/forge';
import { STARTER_ITEMS } from '@/data/itemTemplates';
import { CURRENCY_LABEL, MARKET_ENTRIES } from '@/data/market';
import { createDefaultQuests } from '@/data/quests';
import { SECRET_REALMS } from '@/data/secretRealm';

export interface ItemAcquisitionSource {
  id: string;
  title: string;
  description: string;
  route: string;
  buttonLabel: string;
}

export interface GroupedItemSources {
  primary: ItemAcquisitionSource[];
  secondary: ItemAcquisitionSource[];
}

const BATTLE_EQUIPMENT = new Set([
  'bracer_iron', 'ring_longwen', 'pendant_jade', 'boots_lingfeng', 'helm_taiji',
  'belt_cloud', 'treasure_mirror', 'armor_xuanbing', 'sword_qingyun',
]);

const BATTLE_MATERIALS = new Set([
  'herb_lingzhi', 'crystal_shard', 'ore_mithril', 'pill_qi', 'pill_spirit', 'soul_shard',
]);

const BOSS_ONLY = new Set(['scroll_skill', 'pill_break']);

function pushUnique(sources: ItemAcquisitionSource[], source: ItemAcquisitionSource) {
  if (sources.some((s) => s.id === source.id)) return;
  sources.push(source);
}

export function getGroupedItemAcquisitionSources(templateId: string): GroupedItemSources {
  const primary: ItemAcquisitionSource[] = [];
  const secondary: ItemAcquisitionSource[] = [];

  for (const entry of MARKET_ENTRIES) {
    if (entry.templateId !== templateId) continue;
    pushUnique(primary, {
      id: `market_${entry.id}`,
      title: 'Phường Thị',
      description: `Mua với ${entry.price.toLocaleString('vi-VN')} ${CURRENCY_LABEL[entry.currency]}`,
      route: '/market',
      buttonLabel: 'Đến Phường Thị',
    });
  }

  for (const recipe of ALCHEMY_RECIPES) {
    if (recipe.resultId !== templateId) continue;
    pushUnique(primary, {
      id: `alchemy_${recipe.id}`,
      title: 'Luyện Đan',
      description: recipe.description,
      route: '/alchemy',
      buttonLabel: 'Đến Luyện Đan',
    });
  }

  for (const recipe of FORGE_RECIPES) {
    if (recipe.resultId !== templateId) continue;
    pushUnique(primary, {
      id: `forge_${recipe.id}`,
      title: 'Luyện Khí',
      description: recipe.description,
      route: '/forge',
      buttonLabel: 'Đến Luyện Khí',
    });
  }

  for (const dungeon of DUNGEONS) {
    if (dungeon.itemDrop !== templateId) continue;
    pushUnique(primary, {
      id: `dungeon_${dungeon.id}`,
      title: 'Thám Hiểm',
      description: `Rơi chính tại phó bản ${dungeon.name}`,
      route: '/dungeon',
      buttonLabel: 'Đến Thám Hiểm',
    });
  }

  for (const realm of SECRET_REALMS) {
    if (realm.dropId !== templateId) continue;
    pushUnique(primary, {
      id: `secret_${realm.id}`,
      title: 'Bí Cảnh',
      description: `Khám phá ${realm.name}`,
      route: '/secret-realm',
      buttonLabel: 'Đến Bí Cảnh',
    });
  }

  for (const quest of createDefaultQuests()) {
    for (const reward of quest.rewards) {
      if (reward.type !== 'item' || reward.itemId !== templateId) continue;
      pushUnique(primary, {
        id: `quest_${quest.id}`,
        title: quest.type === 'daily' ? 'Nhiệm Vụ Ngày' : quest.type === 'main' ? 'Nhiệm Vụ Chính' : 'Thành Tựu',
        description: `Hoàn thành: ${quest.title}`,
        route: '/quests',
        buttonLabel: 'Đến Nhiệm Vụ',
      });
    }
  }

  if (STARTER_ITEMS.includes(templateId)) {
    pushUnique(primary, {
      id: 'starter',
      title: 'Khởi Đầu',
      description: 'Nhận khi tạo nhân vật mới',
      route: '/character',
      buttonLabel: 'Xem Nhân Vật',
    });
  }

  const hasSpecificDungeon = primary.some((s) => s.id.startsWith('dungeon_'));
  const hasSpecificSecret = primary.some((s) => s.id.startsWith('secret_'));

  if (BATTLE_MATERIALS.has(templateId) || BATTLE_EQUIPMENT.has(templateId)) {
    if (!hasSpecificDungeon) {
      pushUnique(secondary, {
        id: 'battle_dungeon',
        title: 'Thám Hiểm',
        description: 'Có thể rơi ngẫu nhiên khi vượt phó bản',
        route: '/dungeon',
        buttonLabel: 'Đến Thám Hiểm',
      });
    }
    pushUnique(secondary, {
      id: 'battle_tower',
      title: 'Tháp Thí Luyện',
      description: 'Có thể rơi khi vượt tầng tháp',
      route: '/tower',
      buttonLabel: 'Đến Tháp',
    });
    pushUnique(secondary, {
      id: 'battle_arena',
      title: 'Đấu Pháp Đài',
      description: 'Có thể rơi khi thắng trận đấu pháp',
      route: '/arena',
      buttonLabel: 'Đến Đấu Đài',
    });
    if (!hasSpecificSecret) {
      pushUnique(secondary, {
        id: 'battle_secret',
        title: 'Bí Cảnh',
        description: 'Có thể rơi khi khám phá bí cảnh',
        route: '/secret-realm',
        buttonLabel: 'Đến Bí Cảnh',
      });
    }
  }

  if (BATTLE_EQUIPMENT.has(templateId) || BOSS_ONLY.has(templateId)) {
    pushUnique(secondary, {
      id: 'battle_boss',
      title: 'Boss Thế Giới',
      description: 'Tỷ lệ rơi cao khi hạ boss',
      route: '/dungeon?tab=boss',
      buttonLabel: 'Đến Boss',
    });
  }

  if (primary.length === 0 && secondary.length === 0) {
    pushUnique(primary, {
      id: 'unknown',
      title: 'Chưa Rõ',
      description: 'Tiếp tục tu luyện và khám phá để tìm nguồn vật phẩm này',
      route: '/home',
      buttonLabel: 'Về Tu Luyện',
    });
  }

  return { primary, secondary };
}

/** @deprecated dùng getGroupedItemAcquisitionSources */
export function getItemAcquisitionSources(templateId: string): ItemAcquisitionSource[] {
  const { primary, secondary } = getGroupedItemAcquisitionSources(templateId);
  return [...primary, ...secondary];
}
