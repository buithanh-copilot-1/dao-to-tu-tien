import { TopHeader } from '@/components';
import { useGameStore } from '@/stores/gameStore';
import { getDisplayLevel } from '@/systems/player';
import { getRealmLabel } from '@/data/realms';
import { calcCombatPower } from '@/utils/stats';
import { formatNumber } from '@/utils/format';

export function PlayerHeader() {
  const player = useGameStore((s) => s.player)!;

  return (
    <TopHeader
      name={player.name}
      level={getDisplayLevel(player)}
      realm={getRealmLabel(player.realmId, player.tier)}
      combatPower={formatNumber(calcCombatPower(player))}
      gender={player.gender}
      element={player.element}
      currencies={[
        { type: 'crystal', amount: formatNumber(player.crystal) },
        { type: 'gold', amount: formatNumber(player.gold) },
        { type: 'jade', amount: formatNumber(player.jade) },
      ]}
    />
  );
}
