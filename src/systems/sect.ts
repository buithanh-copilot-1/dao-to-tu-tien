import type { Player } from '@/types/game';
import { calcStats } from '@/utils/stats';
import {
  getSect,
  getSectRankFromContribution,
  getSectRankName,
} from '@/data/sects';

type SectResult = { player: Player; error?: string; message?: string };

/** Bái nhập một tông môn (tốn vàng). Mỗi lúc chỉ ở một tông môn. */
export function joinSect(player: Player, sectId: string): SectResult {
  const sect = getSect(sectId);
  if (!sect) return { player, error: 'Không tìm thấy tông môn' };
  if (player.sect) return { player, error: 'Ngươi đã có tông môn, phải thoái xuất trước' };
  if (player.gold < sect.joinCost) return { player, error: 'Không đủ vàng để bái nhập' };

  const updated: Player = {
    ...player,
    gold: player.gold - sect.joinCost,
    sect: { id: sectId, rank: 0, contribution: 0 },
  };
  return {
    player: { ...updated, stats: calcStats(updated) },
    message: `Đã bái nhập ${sect.name}!`,
  };
}

/** Thoái xuất tông môn (mất toàn bộ cống hiến & chức vị). */
export function leaveSect(player: Player): SectResult {
  if (!player.sect) return { player, error: 'Ngươi chưa gia nhập tông môn nào' };
  const { sect: _drop, ...rest } = player;
  const updated: Player = { ...rest };
  return {
    player: { ...updated, stats: calcStats(updated) },
    message: 'Đã thoái xuất tông môn',
  };
}

/** Cống hiến vàng → tăng cống hiến (1:1) và tự thăng chức vị khi đủ. */
export function donateToSect(player: Player, amount: number): SectResult {
  if (!player.sect) return { player, error: 'Ngươi chưa gia nhập tông môn nào' };
  if (amount <= 0) return { player, error: 'Số vàng không hợp lệ' };
  if (player.gold < amount) return { player, error: 'Không đủ vàng' };

  const contribution = player.sect.contribution + amount;
  const newRank = getSectRankFromContribution(contribution);
  const rankedUp = newRank > player.sect.rank;

  const updated: Player = {
    ...player,
    gold: player.gold - amount,
    sect: { ...player.sect, contribution, rank: newRank },
  };

  return {
    player: { ...updated, stats: calcStats(updated) },
    message: rankedUp
      ? `Thăng chức: ${getSectRankName(newRank)}!`
      : `Cống hiến +${amount}`,
  };
}
