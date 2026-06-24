import type { OfflineRewards, Player } from '@/types/game';
import { REALMS, getBreakthroughCost } from '@/data/realms';
import { refreshCultivationRate } from '@/systems/cultivation';
import { calcStats } from '@/utils/stats';

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

/**
 * Tu vi offline có thể vượt xa tu vi cần cho bậc hiện tại. Tự động đột phá
 * liên tiếp trong cùng cảnh giới để cộng dồn phần linh khí thừa vào bậc kế
 * tiếp, thay vì cắt bỏ. Đột phá vượt cảnh giới (cần độ kiếp) vẫn để người
 * chơi tự thực hiện.
 */
export function applyOfflineRewards(player: Player, rewards: OfflineRewards): Player {
  const realm = REALMS[player.realmId];
  let tier = player.tier;
  let cultivation = player.cultivation + rewards.cultivation;
  let breakthroughCount = player.breakthroughCount;
  let cost = getBreakthroughCost(player.realmId, tier);

  while (realm && tier < realm.maxTier && cultivation >= cost) {
    cultivation -= cost;
    tier += 1;
    breakthroughCount += 1;
    cost = getBreakthroughCost(player.realmId, tier);
  }

  let newPlayer: Player = {
    ...player,
    tier,
    cultivation: Math.min(cultivation, cost),
    breakthroughCount,
    crystal: player.crystal + rewards.crystal,
    silver: player.silver + rewards.silver,
    lastOnlineAt: Date.now(),
  };
  newPlayer = refreshCultivationRate(newPlayer);
  newPlayer.stats = calcStats(newPlayer);
  return newPlayer;
}
