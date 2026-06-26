import type { ElementType, Player } from '@/types/game';
import {
  getSpiritRootStatMultiplier,
  getSpiritRootUpgradeCost,
  SPIRIT_ROOT_MAX,
} from '@/data/spiritRoot';
import { calcStats } from '@/utils/stats';

export function getSpiritRoots(player: Player): Record<ElementType, number> {
  return player.spiritRoots || {
    metal: player.element === 'metal' ? (player.spiritRootLevel ?? 1) : 1,
    wood: player.element === 'wood' ? (player.spiritRootLevel ?? 1) : 1,
    water: player.element === 'water' ? (player.spiritRootLevel ?? 1) : 1,
    fire: player.element === 'fire' ? (player.spiritRootLevel ?? 1) : 1,
    earth: player.element === 'earth' ? (player.spiritRootLevel ?? 1) : 1,
  };
}

export function getSpiritRootNodeLevel(player: Player, element: ElementType): number {
  const roots = getSpiritRoots(player);
  return roots[element] ?? 1;
}

export function getSpiritRootLevel(player: Player): number {
  return getSpiritRootNodeLevel(player, player.element);
}

export function canUpgradeSpiritRootNode(player: Player, element: ElementType): string | null {
  const level = getSpiritRootNodeLevel(player, element);
  if (level >= SPIRIT_ROOT_MAX) return 'Linh căn đã đạt cấp tối đa';

  const cost = getSpiritRootUpgradeCost(level);
  if (player.gold < cost.gold) return 'Không đủ vàng';
  if (player.crystal < cost.crystal) return 'Không đủ linh thạch';

  return null;
}

export function canUpgradeSpiritRoot(player: Player): string | null {
  return canUpgradeSpiritRootNode(player, player.element);
}

const ELEMENT_NAMES: Record<ElementType, string> = {
  metal: 'Kim', wood: 'Mộc', water: 'Thủy', fire: 'Hỏa', earth: 'Thổ',
};

export function upgradeSpiritRootNode(
  player: Player,
  element: ElementType,
): { player: Player; message: string; error?: string } {
  const err = canUpgradeSpiritRootNode(player, element);
  if (err) return { player, message: '', error: err };

  const roots = { ...getSpiritRoots(player) };
  const level = roots[element] ?? 1;
  const cost = getSpiritRootUpgradeCost(level);
  const nextLevel = level + 1;
  roots[element] = nextLevel;

  const legacyLevel = player.element === element ? nextLevel : (player.spiritRootLevel ?? 1);

  const updated: Player = {
    ...player,
    gold: player.gold - cost.gold,
    crystal: player.crystal - cost.crystal,
    spiritRootLevel: legacyLevel,
    spiritRoots: roots,
  };
  updated.stats = calcStats(updated);

  return {
    player: updated,
    message: `Linh căn ${ELEMENT_NAMES[element]} lên cấp ${nextLevel} (+${Math.round((getSpiritRootStatMultiplier(nextLevel) - 1) * 100)}% ngũ hành)`,
  };
}

export function upgradeSpiritRoot(
  player: Player,
  element?: ElementType,
): { player: Player; message: string; error?: string } {
  return upgradeSpiritRootNode(player, element || player.element);
}
