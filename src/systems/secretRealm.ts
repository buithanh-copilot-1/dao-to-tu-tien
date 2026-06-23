import type { Player } from '@/types/game';
import { getSecretRealm, type SecretRealmDef } from '@/data/secretRealm';

/** Kiểm tra điều kiện vào bí cảnh. Trả về chuỗi lỗi hoặc null nếu hợp lệ. */
export function canEnterSecretRealm(
  player: Player,
  secretCounters: Record<string, number>,
  id: string,
): string | null {
  const realm = getSecretRealm(id);
  if (!realm) return 'Không tìm thấy bí cảnh';
  if (player.realmId < realm.minRealmId) return 'Cảnh giới chưa đủ';
  const runs = secretCounters[id] ?? 0;
  if (runs >= realm.dailyLimit) return 'Hết lượt hôm nay';
  return null;
}

export function getSecretRewardSummary(realm: SecretRealmDef): string {
  const parts = [`${realm.goldReward} vàng`, `${realm.crystalReward} linh thạch`];
  if (realm.jadeReward > 0) parts.push(`${realm.jadeReward} tiên ngọc`);
  return parts.join(' · ');
}
