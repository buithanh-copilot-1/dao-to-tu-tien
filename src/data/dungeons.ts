export interface DungeonDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  minRealmId: number;
  enemyPower: number;
  goldReward: number;
  crystalReward: number;
  itemDrop?: string;
  dailyLimit: number;
}

export interface BossDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  minRealmId: number;
  hp: number;
  power: number;
  goldReward: number;
  crystalReward: number;
  jadeReward: number;
}

export { BOSSES, getBossesByRealm, getBossRealmLabel } from '@/data/bosses';

export const DUNGEONS: DungeonDef[] = [
  {
    id: 'dungeon_1',
    name: 'Linh Cốc',
    icon: '🌲',
    description: 'Thung lũng linh khí mỏng, thích hợp luyện khí sĩ',
    minRealmId: 0,
    enemyPower: 500,
    goldReward: 200,
    crystalReward: 50,
    itemDrop: 'herb_lingzhi',
    dailyLimit: 10,
  },
  {
    id: 'dungeon_2',
    name: 'Huyền Động',
    icon: '🕳️',
    description: 'Động phủ cổ xưa, ẩn chứa yêu thú',
    minRealmId: 1,
    enemyPower: 5000,
    goldReward: 800,
    crystalReward: 150,
    itemDrop: 'pill_qi',
    dailyLimit: 8,
  },
  {
    id: 'dungeon_3',
    name: 'Viêm Ma Điện',
    icon: '🔥',
    description: 'Điện thất ma tộc, nguy hiểm nhưng báu vật phong phú',
    minRealmId: 2,
    enemyPower: 25000,
    goldReward: 3000,
    crystalReward: 500,
    itemDrop: 'pill_spirit',
    dailyLimit: 5,
  },
  {
    id: 'dungeon_4',
    name: 'Băng Huyền Cung',
    icon: '❄️',
    description: 'Cung điện băng giá, chỉ kim đan trở lên mới vào được',
    minRealmId: 3,
    enemyPower: 100000,
    goldReward: 10000,
    crystalReward: 1500,
    itemDrop: 'ore_mithril',
    dailyLimit: 3,
  },
];

