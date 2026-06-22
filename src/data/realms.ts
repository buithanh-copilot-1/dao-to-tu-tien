import type { Realm } from '@/types/game';

export const REALMS: Realm[] = [
  { id: 0, name: 'Luyện Khí Kỳ', maxTier: 9, baseRate: 10, breakthroughBase: 1000, powerMultiplier: 1 },
  { id: 1, name: 'Trúc Cơ Kỳ', maxTier: 9, baseRate: 50, breakthroughBase: 5000, powerMultiplier: 3 },
  { id: 2, name: 'Kim Đan Kỳ', maxTier: 9, baseRate: 200, breakthroughBase: 25000, powerMultiplier: 8 },
  { id: 3, name: 'Nguyên Anh Kỳ', maxTier: 9, baseRate: 800, breakthroughBase: 100000, powerMultiplier: 20 },
  { id: 4, name: 'Hóa Thần Kỳ', maxTier: 9, baseRate: 3000, breakthroughBase: 500000, powerMultiplier: 50 },
  { id: 5, name: 'Luyện Hư Kỳ', maxTier: 9, baseRate: 12000, breakthroughBase: 2000000, powerMultiplier: 120 },
  { id: 6, name: 'Hợp Thể Kỳ', maxTier: 9, baseRate: 50000, breakthroughBase: 10000000, powerMultiplier: 300 },
  { id: 7, name: 'Đại Thừa Kỳ', maxTier: 9, baseRate: 200000, breakthroughBase: 50000000, powerMultiplier: 800 },
  { id: 8, name: 'Chân Tiên Kỳ', maxTier: 9, baseRate: 1000000, breakthroughBase: 500000000, powerMultiplier: 2000 },
  { id: 9, name: 'Kim Tiên', maxTier: 9, baseRate: 5000000, breakthroughBase: 5000000000, powerMultiplier: 5000 },
  { id: 10, name: 'Đại La Kim Tiên', maxTier: 9, baseRate: 20000000, breakthroughBase: 20000000000, powerMultiplier: 12000 },
  { id: 11, name: 'Dao Tổ Cảnh', maxTier: 9, baseRate: 80000000, breakthroughBase: 80000000000, powerMultiplier: 30000 },
  { id: 12, name: 'Hỗn Nguyên Đại La', maxTier: 9, baseRate: 300000000, breakthroughBase: 300000000000, powerMultiplier: 80000 },
];

export function getMaxRealmId(): number {
  return REALMS.length - 1;
}

/**
 * Hệ số sức mạnh theo cảnh giới + bậc.
 * - Mỗi cảnh giới ~4x (chênh lệch tuyệt đối càng cao càng lớn)
 * - Mỗi bậc trong cảnh ~28%
 * - Gia tốc bổ sung khi cảnh giới cao (realmId lớn)
 */
export function getRealmPowerScale(realmId: number, tier: number): number {
  const REALM_GROWTH = 4.0;
  const TIER_GROWTH = 1.28;
  const realmFactor = Math.pow(REALM_GROWTH, realmId);
  const tierFactor = Math.pow(TIER_GROWTH, Math.max(tier - 1, 0));
  const highRealmAccel = 1 + realmId * 0.1;
  return realmFactor * tierFactor * highRealmAccel;
}

/** Hệ số chênh lệch giữa các cảnh — tăng nhanh hơn ở cấp cao */
export function getRealmGapMultiplier(realmId: number): number {
  return Math.pow(1.18, realmId * realmId * 0.15) * (1 + realmId * 0.05);
}

export function getRealmLabel(realmId: number, tier: number): string {
  const realm = REALMS[realmId];
  if (!realm) return 'Vô Danh';
  return `${realm.name} - Bậc ${tier}`;
}

export function getNextRealmLabel(realmId: number, tier: number): string {
  const realm = REALMS[realmId];
  if (!realm) return '';
  if (tier < realm.maxTier) return `${realm.name} - Bậc ${tier + 1}`;
  const next = REALMS[realmId + 1];
  return next ? `${next.name} - Bậc 1` : 'Đỉnh Phong';
}

export function getBreakthroughCost(realmId: number, tier: number): number {
  const realm = REALMS[realmId];
  if (!realm) return Infinity;
  return Math.floor(realm.breakthroughBase * Math.pow(1.8, tier - 1) * Math.pow(2.5, realmId));
}

export function getCultivationRate(realmId: number, tier: number, element: string, bonus = 1): number {
  const realm = REALMS[realmId];
  if (!realm) return 0;
  const elementBonus: Record<string, number> = { metal: 1.05, wood: 1.0, water: 1.08, fire: 1.1, earth: 0.95 };
  return Math.floor(realm.baseRate * tier * (elementBonus[element] ?? 1) * bonus);
}
