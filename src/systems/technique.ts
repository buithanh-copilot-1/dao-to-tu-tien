import type { Player } from '@/types/game';
import { calcStats } from '@/utils/stats';
import { getTechnique, getTechniqueUpgradeCost } from '@/data/techniques';

type TechResult = { player: Player; error?: string; message?: string };

function withStats(player: Player): Player {
  return { ...player, stats: calcStats(player) };
}

/** Lĩnh ngộ công pháp mới (tốn linh thạch). */
export function learnTechnique(player: Player, id: string): TechResult {
  const def = getTechnique(id);
  if (!def) return { player, error: 'Không tìm thấy công pháp' };
  if ((player.techniques?.[id] ?? 0) > 0) return { player, error: 'Đã lĩnh ngộ công pháp này' };
  if (player.crystal < def.learnCost) return { player, error: 'Không đủ linh thạch' };

  const updated: Player = {
    ...player,
    crystal: player.crystal - def.learnCost,
    techniques: { ...player.techniques, [id]: 1 },
  };
  return { player: withStats(updated), message: `Lĩnh ngộ ${def.name}!` };
}

/** Nâng cấp công pháp đã học (tốn linh thạch tăng dần). */
export function upgradeTechnique(player: Player, id: string): TechResult {
  const def = getTechnique(id);
  if (!def) return { player, error: 'Không tìm thấy công pháp' };
  const level = player.techniques?.[id] ?? 0;
  if (level <= 0) return { player, error: 'Chưa lĩnh ngộ công pháp này' };
  if (level >= def.maxLevel) return { player, error: 'Đã đạt cấp tối đa' };

  const cost = getTechniqueUpgradeCost(id, level);
  if (player.crystal < cost) return { player, error: 'Không đủ linh thạch' };

  const updated: Player = {
    ...player,
    crystal: player.crystal - cost,
    techniques: { ...player.techniques, [id]: level + 1 },
  };
  return { player: withStats(updated), message: `${def.name} → cấp ${level + 1}` };
}
