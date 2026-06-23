import type { Player } from '@/types/game';
import { calcStats } from '@/utils/stats';

function normalizeName(name: string) {
  const cleaned = name.trim().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_-]/gu, '');
  return cleaned || 'player';
}

function isPlayerLike(value: unknown): value is Player {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Player>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.gender === 'string' &&
    typeof candidate.element === 'string' &&
    typeof candidate.realmId === 'number' &&
    typeof candidate.tier === 'number' &&
    typeof candidate.cultivation === 'number' &&
    typeof candidate.cultivationRate === 'number' &&
    typeof candidate.autoCultivate === 'boolean' &&
    typeof candidate.crystal === 'number' &&
    typeof candidate.gold === 'number' &&
    typeof candidate.jade === 'number' &&
    typeof candidate.silver === 'number' &&
    Array.isArray(candidate.inventory) &&
    typeof candidate.equipment === 'object' &&
    Array.isArray(candidate.quests) &&
    typeof candidate.stats === 'object' &&
    typeof candidate.createdAt === 'number' &&
    typeof candidate.lastOnlineAt === 'number'
  );
}

export function exportPlayerToJSON(player: Player) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const payload = JSON.stringify(player, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `player_${normalizeName(player.name)}_${Date.now()}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function importPlayerFromJSON(file: File): Promise<Player> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);

  if (!isPlayerLike(parsed)) {
    throw new Error('File JSON không đúng định dạng dữ liệu nhân vật');
  }

  return {
    ...parsed,
    stats: calcStats(parsed),
  };
}
