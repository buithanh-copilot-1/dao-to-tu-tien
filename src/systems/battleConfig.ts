import type { Player } from '@/types/game';
import type { BattleMode, BattleTarget } from '@/types/battle';
import { ARENA_OPPONENTS } from '@/data/arena';
import { BOSSES, DUNGEONS } from '@/data/dungeons';
import { getTowerFloor } from '@/data/tower';

export function buildBattleTarget(
  mode: BattleMode,
  id: string,
  player: Player,
  towerFloor?: number,
): BattleTarget | null {
  const playerIcon = player.gender === 'male' ? '🧙‍♂️' : '🧙‍♀️';

  if (mode === 'dungeon') {
    const d = DUNGEONS.find((x) => x.id === id);
    if (!d) return null;
    const waves = [0.55, 0.75, 1.0].map((mul, i) => ({
      wave: i + 1,
      name: i < 2 ? `Yêu thú đợt ${i + 1}` : 'Thủ vệ động phủ',
      icon: i < 2 ? '👾' : '💀',
      power: Math.floor(d.enemyPower * mul),
      hp: Math.floor(d.enemyPower * mul * 8),
    }));
    return {
      id: d.id,
      mode,
      title: d.name,
      subtitle: d.description,
      playerIcon,
      waves,
      rewards: { gold: d.goldReward, crystal: d.crystalReward, itemId: d.itemDrop },
    };
  }

  if (mode === 'boss') {
    const b = BOSSES.find((x) => x.id === id);
    if (!b) return null;
    return {
      id: b.id,
      mode,
      title: b.name,
      subtitle: b.description,
      playerIcon,
      waves: [{ wave: 1, name: b.name, icon: b.icon, power: b.power, hp: b.hp }],
      rewards: { gold: b.goldReward, crystal: b.crystalReward, jade: b.jadeReward },
    };
  }

  if (mode === 'arena') {
    const o = ARENA_OPPONENTS.find((x) => x.id === id);
    if (!o) return null;
    return {
      id: o.id,
      mode,
      title: o.name,
      subtitle: o.realm,
      playerIcon,
      waves: [{
        wave: 1,
        name: o.name,
        icon: o.icon,
        power: o.power,
        hp: Math.floor(o.power * 6),
      }],
      rewards: { gold: o.goldReward, crystal: o.crystalReward },
    };
  }

  if (mode === 'tower') {
    const floor = towerFloor ?? 1;
    const t = getTowerFloor(floor);
    return {
      id: `tower_${floor}`,
      mode,
      title: `Vượt Tháp · Tầng ${floor}`,
      subtitle: t.guardName,
      playerIcon,
      waves: [{
        wave: 1,
        name: t.guardName,
        icon: t.icon,
        power: t.enemyPower,
        hp: t.enemyHp,
      }],
      rewards: { gold: t.goldReward, crystal: t.crystalReward, jade: t.jadeReward },
    };
  }

  return null;
}
