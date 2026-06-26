import type { Player } from '@/types/game';
import { REALMS, getBreakthroughCost, getCultivationRate, getRealmLabel, getMaxRealmId } from '@/data/realms';
import { calcCombatPower, calcStats } from '@/utils/stats';

export interface TribulationInfo {
  targetRealmId: number;
  targetLabel: string;
  difficulty: number;
  combatPower: number;
  successRate: number;
  retainedCultivationPct: number;
}

export type BreakthroughResult =
  | { success: true; player: Player; message: string; tribulation?: TribulationInfo }
  | { success: false; reason: string; player?: Player; tribulation?: TribulationInfo };

const TRIBULATION_RETAINED_CULTIVATION_PCT = 0.65;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function addCultivation(player: Player, amount: number): Player {
  return {
    ...player,
    cultivation: player.cultivation + amount,
  };
}

export function refreshCultivationRate(player: Player, bonus = 1): Player {
  return {
    ...player,
    cultivationRate: getCultivationRate(player.realmId, player.tier, player.element, bonus),
  };
}

export function tickCultivation(player: Player, deltaMs: number, bonus = 1): Player {
  const rate = getCultivationRate(player.realmId, player.tier, player.element, bonus);
  const gained = (rate * deltaMs) / 1000;
  
  let newPlayer = addCultivation(player, gained);
  newPlayer = refreshCultivationRate(newPlayer, bonus);

  return {
    ...newPlayer,
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

export function isRealmBreakthrough(player: Player): boolean {
  const realm = REALMS[player.realmId];
  if (!realm) return false;
  return player.tier >= realm.maxTier && player.realmId < getMaxRealmId();
}

function getTribulationBaselinePlayer(player: Player): Player {
  const cost = getBreakthroughCost(player.realmId, player.tier);
  return {
    ...player,
    cultivation: cost,
    equipment: {},
    sect: undefined,
    techniques: undefined,
    talents: undefined,
    pets: undefined,
    activePet: undefined,
    mounts: undefined,
    activeMount: undefined,
    ascensionCount: 0,
  };
}

export function getTribulationInfo(player: Player): TribulationInfo | null {
  if (!isRealmBreakthrough(player) || !canBreakthrough(player)) return null;

  const targetRealmId = player.realmId + 1;
  const baselinePower = calcCombatPower(getTribulationBaselinePlayer(player));
  const difficulty = Math.max(1, Math.floor(baselinePower * (1.55 + targetRealmId * 0.06)));
  const combatPower = calcCombatPower({
    ...player,
    cultivation: getBreakthroughCost(player.realmId, player.tier),
  });
  const ratio = combatPower / difficulty;
  const successRate = clamp(Math.round((0.35 + ratio * 0.35) * 100), 35, 95);

  return {
    targetRealmId,
    targetLabel: getRealmLabel(targetRealmId, 1),
    difficulty,
    combatPower,
    successRate,
    retainedCultivationPct: TRIBULATION_RETAINED_CULTIVATION_PCT,
  };
}

function rollTribulation(player: Player, bonusRate: number = 0): { passed: true; info: TribulationInfo } | { passed: false; info: TribulationInfo; player: Player } {
  const info = getTribulationInfo(player);
  if (!info) {
    return {
      passed: true,
      info: {
        targetRealmId: player.realmId,
        targetLabel: getRealmLabel(player.realmId, player.tier),
        difficulty: 0,
        combatPower: calcCombatPower(player),
        successRate: 100,
        retainedCultivationPct: 1,
      },
    };
  }

  const finalRate = Math.min(100, info.successRate + bonusRate);
  if (Math.random() * 100 < finalRate) {
    return { passed: true, info };
  }

  const cost = getBreakthroughCost(player.realmId, player.tier);
  let failedPlayer: Player = {
    ...player,
    cultivation: Math.floor(cost * info.retainedCultivationPct),
    lastOnlineAt: Date.now(),
  };
  failedPlayer = refreshCultivationRate(failedPlayer);
  failedPlayer.stats = calcStats(failedPlayer);

  return { passed: false, info, player: failedPlayer };
}

export function fillCultivationForBreakthrough(player: Player): Player {
  if (isAtPeak(player)) return player;
  const cost = getBreakthroughCost(player.realmId, player.tier);
  return { ...player, cultivation: cost };
}

export function attemptBreakthrough(player: Player, bonusRate: number = 0): BreakthroughResult {
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
  let passedTribulation: TribulationInfo | undefined;

  if (player.tier < realm.maxTier) {
    newTier += 1;
  } else if (player.realmId < getMaxRealmId()) {
    const tribulation = rollTribulation(player, bonusRate);
    if (!tribulation.passed) {
      return {
        success: false,
        player: tribulation.player,
        tribulation: tribulation.info,
        reason: `Độ kiếp thất bại! Kiếp lôi phản phệ, tu vi còn ${Math.round(tribulation.info.retainedCultivationPct * 100)}%. Hãy tăng lực chiến rồi thử lại.`,
      };
    }
    passedTribulation = tribulation.info;

    newRealmId += 1;
    newTier = 1;
  } else {
    return { success: false, reason: 'Đã đạt đỉnh phong' };
  }

  let newPlayer: Player = {
    ...player,
    realmId: newRealmId,
    tier: newTier,
    cultivation: player.cultivation - getBreakthroughCost(player.realmId, player.tier),
    breakthroughCount: player.breakthroughCount + 1,
  };

  newPlayer = refreshCultivationRate(newPlayer);
  newPlayer.stats = calcStats(newPlayer);

  const message = passedTribulation
    ? `Độ kiếp thành công! Vượt qua thiên lôi, đạt ${getRealmLabel(newRealmId, newTier)}`
    : `Đột phá thành công! Đạt ${getRealmLabel(newRealmId, newTier)}`;
  return { success: true, player: newPlayer, message, tribulation: passedTribulation };
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
