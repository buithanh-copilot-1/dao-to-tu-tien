import type { Player } from '@/types/game';
import {
  getSpiritRootStatMultiplier,
  getSpiritRootUpgradeCost,
  SPIRIT_ROOT_MAX,
} from '@/data/spiritRoot';
import { calcStats } from '@/utils/stats';

export function getSpiritRootLevel(player: Player): number {
  return player.spiritRootLevel ?? 1;
}

export function canUpgradeSpiritRoot(player: Player): string | null {
  const level = getSpiritRootLevel(player);
  if (level >= SPIRIT_ROOT_MAX) return 'Linh căn đã đạt cấp tối đa';

  const cost = getSpiritRootUpgradeCost(level);
  if (player.gold < cost.gold) return 'Không đủ vàng';
  if (player.crystal < cost.crystal) return 'Không đủ linh thạch';

  return null;
}

export function upgradeSpiritRoot(
  player: Player,
): { player: Player; message: string; error?: string } {
  const err = canUpgradeSpiritRoot(player);
  if (err) return { player, message: '', error: err };

  const level = getSpiritRootLevel(player);
  const cost = getSpiritRootUpgradeCost(level);
  const nextLevel = level + 1;

  const updated: Player = {
    ...player,
    gold: player.gold - cost.gold,
    crystal: player.crystal - cost.crystal,
    spiritRootLevel: nextLevel,
  };
  updated.stats = calcStats(updated);

  return {
    player: updated,
    message: `Linh căn lên cấp ${nextLevel} (+${Math.round((getSpiritRootStatMultiplier(nextLevel) - 1) * 100)}% ngũ hành)`,
  };
}
