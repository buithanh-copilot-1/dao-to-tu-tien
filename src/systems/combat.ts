import type { BattleLogEntry, FullBattleResult, WaveBattleResult } from '@/types/battle';
import { formatNumber } from '@/utils/format';

export interface BattleResult {
  win: boolean;
  rounds: number;
  damageDealt: number;
}

export function calcWinChance(attackerPower: number, defenderPower: number): number {
  const ratio = attackerPower / Math.max(defenderPower, 1);
  return Math.min(95, Math.max(5, Math.round((0.5 + (ratio - 1) * 0.3) * 100)));
}

export function simulateBattle(attackerPower: number, defenderPower: number): BattleResult {
  const ratio = attackerPower / Math.max(defenderPower, 1);
  const winChance = Math.min(0.95, Math.max(0.05, 0.5 + (ratio - 1) * 0.3));
  const win = Math.random() < winChance;
  const rounds = Math.floor(3 + Math.random() * 8);
  const damageDealt = Math.floor(attackerPower * (0.1 + Math.random() * 0.2) * rounds);
  return { win, rounds, damageDealt };
}

function simulateWave(
  playerPower: number,
  playerHp: number,
  enemyPower: number,
  enemyHp: number,
  playerName: string,
  enemyName: string,
  wave: number,
): WaveBattleResult {
  const log: BattleLogEntry[] = [];
  let pHp = playerHp;
  let eHp = enemyHp;
  let round = 0;
  const maxRounds = 20;

  log.push({ round: 0, text: `⚔️ Đối đầu ${playerName} vs ${enemyName}`, side: 'system' });

  while (pHp > 0 && eHp > 0 && round < maxRounds) {
    round += 1;
    const pDmg = Math.max(1, Math.floor(playerPower * (0.08 + Math.random() * 0.12)));
    const eDmg = Math.max(1, Math.floor(enemyPower * (0.06 + Math.random() * 0.1)));

    eHp = Math.max(0, eHp - pDmg);
    log.push({
      round,
      text: `${playerName} xuất chiêu gây ${formatNumber(pDmg)} sát thương`,
      side: 'player',
      damage: pDmg,
    });

    if (eHp <= 0) break;

    pHp = Math.max(0, pHp - eDmg);
    log.push({
      round,
      text: `${enemyName} phản kích gây ${formatNumber(eDmg)} sát thương`,
      side: 'enemy',
      damage: eDmg,
    });
  }

  const win = eHp <= 0 && pHp > 0;
  log.push({
    round,
    text: win ? `✨ Chiến thắng sau ${round} hiệp!` : `💀 Thất bại sau ${round} hiệp...`,
    side: 'system',
  });

  return { wave, win, rounds: round, log, playerHpLeft: pHp, enemyHpLeft: eHp };
}

export function simulateFullBattle(
  playerPower: number,
  playerName: string,
  waves: { wave: number; name: string; power: number; hp: number }[],
): FullBattleResult {
  const playerHp = Math.floor(playerPower * 5);
  const results: WaveBattleResult[] = [];
  let currentHp = playerHp;

  for (const w of waves) {
    const result = simulateWave(playerPower, currentHp, w.power, w.hp, playerName, w.name, w.wave);
    results.push(result);
    currentHp = result.playerHpLeft;
    if (!result.win) {
      return {
        win: false,
        waves: results,
        totalRounds: results.reduce((s, r) => s + r.rounds, 0),
      };
    }
  }

  return {
    win: true,
    waves: results,
    totalRounds: results.reduce((s, r) => s + r.rounds, 0),
  };
}
