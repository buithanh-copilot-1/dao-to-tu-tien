import type { OfflineRewards, Player } from '@/types/game';

const MAX_OFFLINE_MS = 12 * 60 * 60 * 1000;
const MIN_OFFLINE_MS = 60_000;

export function calcOfflineRewards(player: Player, now = Date.now()): OfflineRewards | null {
  const elapsed = now - player.lastOnlineAt;
  if (elapsed < MIN_OFFLINE_MS) return null;

  const durationMs = Math.min(elapsed, MAX_OFFLINE_MS);
  const cultivation = Math.floor((player.cultivationRate * durationMs) / 1000);
  const crystal = Math.floor(durationMs / 60_000) * 10;
  const silver = Math.floor(durationMs / 60_000) * 5;

  return {
    cultivation,
    crystal,
    silver,
    items: [],
    powerGain: 0,
    durationMs,
  };
}

export function applyOfflineRewards(player: Player, rewards: OfflineRewards): Player {
  return {
    ...player,
    cultivation: player.cultivation + rewards.cultivation,
    crystal: player.crystal + rewards.crystal,
    silver: player.silver + rewards.silver,
    lastOnlineAt: Date.now(),
  };
}
