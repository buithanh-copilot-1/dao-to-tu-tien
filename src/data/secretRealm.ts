import { getRealmShortLabel } from '@/data/realms';

export interface SecretRealmDef {
  id: string;
  name: string;
  description: string;
  minRealmId: number;
  /** Lực chiến đối thủ trấn giữ bí cảnh */
  power: number;
  dailyLimit: number;
  goldReward: number;
  crystalReward: number;
  jadeReward: number;
  /** Template vật phẩm rơi khi thắng (nếu có) */
  dropId?: string;
}

export const SECRET_REALMS: SecretRealmDef[] = [
  {
    id: 'sr_thaco',
    name: 'Thượng Cổ Động Phủ',
    description: 'Di tích tu sĩ thượng cổ, linh khí nồng đậm.',
    minRealmId: 1,
    power: 3000,
    dailyLimit: 3,
    goldReward: 3000,
    crystalReward: 200,
    jadeReward: 2,
    dropId: 'herb_lingzhi',
  },
  {
    id: 'sr_vongxuyen',
    name: 'Vọng Xuyên U Cảnh',
    description: 'Âm khí mịt mù, ẩn chứa kỳ trân dị bảo.',
    minRealmId: 4,
    power: 20000,
    dailyLimit: 3,
    goldReward: 12000,
    crystalReward: 600,
    jadeReward: 5,
    dropId: 'ore_mithril',
  },
  {
    id: 'sr_cuuthien',
    name: 'Cửu Thiên Tiên Khư',
    description: 'Tàn tích tiên giới, phi thăng giả từng lưu lại đại đạo.',
    minRealmId: 7,
    power: 120000,
    dailyLimit: 2,
    goldReward: 50000,
    crystalReward: 2000,
    jadeReward: 15,
    dropId: 'soul_shard',
  },
];

export function getSecretRealm(id: string): SecretRealmDef | undefined {
  return SECRET_REALMS.find((s) => s.id === id);
}

export function getSecretRealmReq(realm: SecretRealmDef): string {
  return getRealmShortLabel(realm.minRealmId);
}
