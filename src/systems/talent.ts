import type { Player } from '@/types/game';
import { calcStats } from '@/utils/stats';
import { getTalent, getSpentTalentPoints } from '@/data/talents';

type TalentResult = { player: Player; error?: string; message?: string };

/** Điểm thiên phú khả dụng = số lần đột phá − số điểm đã đầu tư. */
export function getAvailableTalentPoints(player: Player): number {
  return Math.max(0, player.breakthroughCount - getSpentTalentPoints(player.talents));
}

/** Đầu tư 1 điểm thiên phú vào một nhánh. */
export function investTalent(player: Player, id: string): TalentResult {
  const def = getTalent(id);
  if (!def) return { player, error: 'Không tìm thấy thiên phú' };
  const level = player.talents?.[id] ?? 0;
  if (level >= def.maxLevel) return { player, error: 'Đã đạt cấp tối đa' };
  if (getAvailableTalentPoints(player) <= 0) return { player, error: 'Không đủ điểm thiên phú' };

  const updated: Player = {
    ...player,
    talents: { ...player.talents, [id]: level + 1 },
  };
  return { player: { ...updated, stats: calcStats(updated) }, message: `${def.name} → ${level + 1}` };
}

/** Tẩy tủy: hoàn lại toàn bộ điểm thiên phú. */
export function resetTalents(player: Player): TalentResult {
  if (getSpentTalentPoints(player.talents) <= 0) return { player, error: 'Chưa điểm thiên phú nào' };
  const updated: Player = { ...player, talents: {} };
  return { player: { ...updated, stats: calcStats(updated) }, message: 'Đã tẩy tủy, hoàn lại toàn bộ điểm' };
}
