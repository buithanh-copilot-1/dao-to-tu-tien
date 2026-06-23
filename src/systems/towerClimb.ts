import { TOWER_MAX_FLOOR } from '@/data/tower';
import type { Player } from '@/types/game';
import { simulateTowerFloor, type AutoTowerResult, type AutoTowerStopReason } from '@/systems/towerAuto';

export interface TowerAutoClimbDeps {
  getPlayer: () => Player | null;
  getTowerBestFloor: () => number;
  canStartFloor: (floor: number) => string | null;
  resolveFloor: (floor: number, win: boolean) => void;
  shouldStop?: () => boolean;
  onFloor?: (floor: number) => void;
  delayMs?: number;
}

function buildResult(
  deps: TowerAutoClimbDeps,
  startFloor: number,
  startGold: number,
  startCrystal: number,
  startJade: number,
  cleared: number,
  reason: AutoTowerStopReason,
): AutoTowerResult {
  const player = deps.getPlayer();
  return {
    cleared,
    fromFloor: startFloor,
    toFloor: deps.getTowerBestFloor(),
    reason,
    goldGained: (player?.gold ?? 0) - startGold,
    crystalGained: (player?.crystal ?? 0) - startCrystal,
    jadeGained: (player?.jade ?? 0) - startJade,
  };
}

export function runTowerAutoClimbSync(deps: TowerAutoClimbDeps): AutoTowerResult {
  const startPlayer = deps.getPlayer();
  if (!startPlayer) {
    return buildResult(deps, 1, 0, 0, 0, 0, 'blocked');
  }

  const startFloor = deps.getTowerBestFloor() + 1;
  const startGold = startPlayer.gold;
  const startCrystal = startPlayer.crystal;
  const startJade = startPlayer.jade;
  let cleared = 0;
  let reason: AutoTowerStopReason = 'blocked';

  while (true) {
    if (deps.shouldStop?.()) {
      reason = 'stopped';
      break;
    }

    const player = deps.getPlayer();
    if (!player) {
      reason = 'blocked';
      break;
    }

    const best = deps.getTowerBestFloor();
    if (best >= TOWER_MAX_FLOOR) {
      reason = 'max_floor';
      break;
    }

    const floor = best + 1;
    const err = deps.canStartFloor(floor);
    if (err) {
      reason = 'blocked';
      break;
    }

    deps.onFloor?.(floor);
    const battle = simulateTowerFloor(player, floor);
    deps.resolveFloor(floor, battle.win);

    if (!battle.win) {
      reason = 'defeat';
      break;
    }
    cleared += 1;
  }

  return buildResult(deps, startFloor, startGold, startCrystal, startJade, cleared, reason);
}

export async function runTowerAutoClimbAsync(deps: TowerAutoClimbDeps): Promise<AutoTowerResult> {
  const startPlayer = deps.getPlayer();
  if (!startPlayer) {
    return buildResult(deps, 1, 0, 0, 0, 0, 'blocked');
  }

  const startFloor = deps.getTowerBestFloor() + 1;
  const startGold = startPlayer.gold;
  const startCrystal = startPlayer.crystal;
  const startJade = startPlayer.jade;
  const delayMs = deps.delayMs ?? 0;
  let cleared = 0;
  let reason: AutoTowerStopReason = 'blocked';

  while (true) {
    if (deps.shouldStop?.()) {
      reason = 'stopped';
      break;
    }

    const player = deps.getPlayer();
    if (!player) {
      reason = 'blocked';
      break;
    }

    const best = deps.getTowerBestFloor();
    if (best >= TOWER_MAX_FLOOR) {
      reason = 'max_floor';
      break;
    }

    const floor = best + 1;
    const err = deps.canStartFloor(floor);
    if (err) {
      reason = 'blocked';
      break;
    }

    deps.onFloor?.(floor);
    if (delayMs > 0) {
      await new Promise<void>((r) => setTimeout(r, delayMs));
    }

    if (deps.shouldStop?.()) {
      reason = 'stopped';
      break;
    }

    const current = deps.getPlayer();
    if (!current) {
      reason = 'blocked';
      break;
    }

    const battle = simulateTowerFloor(current, floor);
    deps.resolveFloor(floor, battle.win);

    if (!battle.win) {
      reason = 'defeat';
      break;
    }
    cleared += 1;
  }

  return buildResult(deps, startFloor, startGold, startCrystal, startJade, cleared, reason);
}
