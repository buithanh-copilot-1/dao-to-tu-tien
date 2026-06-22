import { getTowerFloor } from '@/data/tower';
import { simulateFullBattle } from '@/systems/combat';
import { calcCombatPower } from '@/utils/stats';
import type { Player } from '@/types/game';

export type AutoTowerStopReason =
  | 'defeat'
  | 'max_floor'
  | 'blocked';

export interface AutoTowerResult {
  cleared: number;
  fromFloor: number;
  toFloor: number;
  reason: AutoTowerStopReason;
  goldGained: number;
  crystalGained: number;
  jadeGained: number;
}

export function simulateTowerFloor(player: Player, floor: number) {
  const power = calcCombatPower(player);
  const t = getTowerFloor(floor);
  return simulateFullBattle(power, player.name, [{
    wave: 1,
    name: t.guardName,
    power: t.enemyPower,
    hp: t.enemyHp,
  }]);
}
