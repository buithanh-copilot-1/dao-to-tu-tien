import type { Player } from '@/types/game';
import { calcStats } from '@/utils/stats';
import { isAtPeak, refreshCultivationRate } from '@/systems/cultivation';

type AscendResult =
  | { success: true; player: Player; message: string }
  | { success: false; reason: string };

/** Đủ điều kiện phi thăng khi đã đạt đỉnh cảnh giới tối cao. */
export function canAscend(player: Player): boolean {
  return isAtPeak(player);
}

/**
 * Phi thăng: trở về Luyện Khí Kỳ tầng 1, nhưng nhận +10% sức mạnh vĩnh viễn.
 * Giữ nguyên trang bị, tài nguyên, tông môn, công pháp, thiên phú, linh thú,
 * tọa kỵ và số lần đột phá (để không mất điểm thiên phú).
 */
export function ascend(player: Player): AscendResult {
  if (!canAscend(player)) {
    return { success: false, reason: 'Phải đạt đỉnh cảnh giới tối cao mới có thể phi thăng' };
  }

  const ascensionCount = (player.ascensionCount ?? 0) + 1;
  let updated: Player = {
    ...player,
    realmId: 0,
    tier: 1,
    cultivation: 0,
    autoCultivate: true,
    ascensionCount,
  };
  updated = refreshCultivationRate(updated);
  updated = { ...updated, stats: calcStats(updated) };

  return {
    success: true,
    player: updated,
    message: `Phi thăng thành công! Đạo cơ lần ${ascensionCount}, sức mạnh +${ascensionCount * 10}% vĩnh viễn.`,
  };
}
