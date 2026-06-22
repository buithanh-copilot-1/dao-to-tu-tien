import type { Player } from '@/types/game';
import { REALMS, getBreakthroughCost, getCultivationRate, getRealmLabel, getMaxRealmId } from '@/data/realms';
import { calcStats } from '@/utils/stats';

export type BreakthroughResult =
  | { success: true; player: Player; message: string }
  | { success: false; reason: string };

export function refreshCultivationRate(player: Player, bonus = 1): Player {
  return {
    ...player,
    cultivationRate: getCultivationRate(player.realmId, player.tier, player.element, bonus),
  };
}

export function tickCultivation(player: Player, deltaMs: number, bonus = 1): Player {
  const rate = getCultivationRate(player.realmId, player.tier, player.element, bonus);
  const gained = (rate * deltaMs) / 1000;
  const cost = getBreakthroughCost(player.realmId, player.tier);
  const newCultivation = Math.min(player.cultivation + gained, cost);

  return {
    ...player,
    cultivation: newCultivation,
    cultivationRate: rate,
    totalPlaySeconds: player.totalPlaySeconds + deltaMs / 1000,
    lastOnlineAt: Date.now(),
  };
}

export function isAtPeak(player: Player): boolean {
  const realm = REALMS[player.realmId];
  if (!realm) return true;
  return player.realmId >= getMaxRealmId() && player.tier >= realm.maxTier;
}

export function canBreakthrough(player: Player): boolean {
  const cost = getBreakthroughCost(player.realmId, player.tier);
  return player.cultivation >= cost;
}

export function fillCultivationForBreakthrough(player: Player): Player {
  if (isAtPeak(player)) return player;
  const cost = getBreakthroughCost(player.realmId, player.tier);
  return { ...player, cultivation: cost };
}

export function attemptBreakthrough(player: Player): BreakthroughResult {
  if (isAtPeak(player)) {
    return { success: false, reason: 'Đã đạt đỉnh phong' };
  }

  if (!canBreakthrough(player)) {
    return { success: false, reason: 'Tu vi chưa đủ để đột phá' };
  }

  const realm = REALMS[player.realmId];
  if (!realm) return { success: false, reason: 'Cảnh giới không hợp lệ' };

  let newRealmId = player.realmId;
  let newTier = player.tier;

  if (player.tier < realm.maxTier) {
    newTier += 1;
  } else if (player.realmId < getMaxRealmId()) {
    newRealmId += 1;
    newTier = 1;
  } else {
    return { success: false, reason: 'Đã đạt đỉnh phong' };
  }

  let newPlayer: Player = {
    ...player,
    realmId: newRealmId,
    tier: newTier,
    cultivation: 0,
    breakthroughCount: player.breakthroughCount + 1,
  };

  newPlayer = refreshCultivationRate(newPlayer);
  newPlayer.stats = calcStats(newPlayer);

  const message = `Đột phá thành công! Đạt ${getRealmLabel(newRealmId, newTier)}`;
  return { success: true, player: newPlayer, message };
}

/** Dev/test: đột phá không cần đủ tu vi */
export function forceBreakthrough(player: Player): BreakthroughResult {
  if (isAtPeak(player)) {
    return { success: false, reason: 'Đã đạt đỉnh phong' };
  }

  const realm = REALMS[player.realmId];
  if (!realm) return { success: false, reason: 'Cảnh giới không hợp lệ' };

  let newRealmId = player.realmId;
  let newTier = player.tier;

  if (player.tier < realm.maxTier) {
    newTier += 1;
  } else if (player.realmId < getMaxRealmId()) {
    newRealmId += 1;
    newTier = 1;
  } else {
    return { success: false, reason: 'Đã đạt đỉnh phong' };
  }

  let newPlayer: Player = {
    ...player,
    realmId: newRealmId,
    tier: newTier,
    cultivation: 0,
    breakthroughCount: player.breakthroughCount + 1,
  };

  newPlayer = refreshCultivationRate(newPlayer);
  newPlayer.stats = calcStats(newPlayer);

  return {
    success: true,
    player: newPlayer,
    message: `Đột phá thành công! Đạt ${getRealmLabel(newRealmId, newTier)}`,
  };
}
