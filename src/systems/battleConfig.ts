import type { Player } from '@/types/game';
import type { BattleMode, BattleTarget } from '@/types/battle';
import { ARENA_OPPONENTS } from '@/data/arena';
import { BOSSES, DUNGEONS } from '@/data/dungeons';
import { getTowerFloor } from '@/data/tower';
import { getSecretRealm } from '@/data/secretRealm';
import { getDropPreviewItems } from '@/systems/drops';

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
    return {
      id: d.id,
      mode,
      title: d.name,
      subtitle: d.description,
      playerIcon,
      waves: [{
        wave: 1,
        name: d.name,
        icon: d.icon,
        power: d.enemyPower,
        hp: Math.floor(d.enemyPower * 8),
      }],
      rewards: {
        gold: d.goldReward,
        crystal: d.crystalReward,
        items: getDropPreviewItems('dungeon', { dungeon: d }),
        bonusDrop: true,
      },
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
      rewards: {
        gold: b.goldReward,
        crystal: b.crystalReward,
        jade: b.jadeReward,
        items: getDropPreviewItems('boss', { boss: b }),
        bonusDrop: true,
      },
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
      rewards: {
        gold: o.goldReward,
        crystal: o.crystalReward,
        items: getDropPreviewItems('arena', { arena: o }),
        bonusDrop: true,
      },
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
      rewards: {
        gold: t.goldReward,
        crystal: t.crystalReward,
        jade: t.jadeReward,
        items: getDropPreviewItems('tower', { tower: t }),
        bonusDrop: true,
      },
    };
  }

  if (mode === 'secret') {
    const r = getSecretRealm(id);
    if (!r) return null;
    return {
      id: r.id,
      mode,
      title: r.name,
      subtitle: r.description,
      playerIcon,
      waves: [{
        wave: 1,
        name: r.name,
        icon: '🌀',
        power: r.power,
        hp: Math.floor(r.power * 8),
      }],
      rewards: {
        gold: r.goldReward,
        crystal: r.crystalReward,
        jade: r.jadeReward,
        items: getDropPreviewItems('secret', { secret: r }),
        bonusDrop: true,
      },
    };
  }

  return null;
}
