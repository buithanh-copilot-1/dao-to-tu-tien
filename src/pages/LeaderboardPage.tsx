import { useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  TabBar,
  GamePanel,
  RealmBadge,
  AncientIcon,
  ItemIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useRedirectBack } from '@/hooks/useRedirectBack';
import { buildLeaderboard } from '@/data/leaderboard';
import { getRealmLabel } from '@/data/realms';
import { calcCombatPower } from '@/utils/stats';
import { formatNumber } from '@/utils/format';

const RANK_TABS = [
  { id: 'power', label: 'Lực Chiến' },
  { id: 'realm', label: 'Cảnh Giới' },
];

export function LeaderboardPage() {
  const player = useGameStore((s) => s.player)!;
  const { navItems, handleNav } = useGameNav();
  const { goBack } = useRedirectBack('/tower');
  const [activeTab, setActiveTab] = useState('power');

  const realmLabel = getRealmLabel(player.realmId, player.tier);
  const power = calcCombatPower(player);
  const leaderboard = buildLeaderboard(power, player.name, realmLabel);
  const playerEntry = leaderboard.find((e) => e.isPlayer);

  const sorted = activeTab === 'realm'
    ? [...leaderboard].sort((a, b) => b.power - a.power)
    : leaderboard;

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Bảng Xếp Hạng" onBack={goBack} />

          <TabBar tabs={RANK_TABS} activeId={activeTab} onChange={setActiveTab} />

          <div className="data-table data-table--leaderboard" style={{ marginTop: 8 }}>
            <div className="data-table__head">
              <span className="data-table__th data-table__th--center">Hạng</span>
              <span className="data-table__th data-table__th--left">Người chơi</span>
              <span className="data-table__th data-table__th--right">Lực chiến</span>
            </div>

            {sorted.slice(0, 15).map((row) => (
              <div
                key={row.name + row.rank}
                className={`data-table__row ${row.isPlayer ? 'data-table__row--highlight' : ''}`}
              >
                <span className={`data-table__cell data-table__cell--center rank-medal ${row.rank <= 3 ? `rank-medal--top${row.rank}` : ''}`}>
                  {row.rank}
                </span>
                <div className="data-table__cell data-table__cell--left data-table__player">
                  <div className="list-row__avatar">
                    <ItemIcon
                      icon={row.isPlayer ? (player.gender === 'male' ? '🧙‍♂️' : '🧙‍♀️') : '🧙'}
                      className="list-row__avatar-icon"
                    />
                  </div>
                  <div className="data-table__player-info">
                    <div
                      className="list-row__name"
                      style={row.isPlayer ? { color: 'var(--green-stat)' } : undefined}
                    >
                      {row.name}{row.isPlayer ? ' (Bạn)' : ''}
                    </div>
                    <RealmBadge text={row.realm} />
                  </div>
                </div>
                <span className="data-table__cell data-table__cell--right meta-stat">
                  <AncientIcon name="flame" size={12} className="anc-icon--power" />
                  {formatNumber(row.power)}
                </span>
              </div>
            ))}
          </div>

          {playerEntry && (
            <GamePanel title="Hạng của bạn">
              <div className="data-table data-table--leaderboard">
                <div className="data-table__row data-table__row--highlight">
                  <span className="data-table__cell data-table__cell--center rank-medal" style={{ fontSize: 20 }}>
                    {playerEntry.rank}
                  </span>
                  <div className="data-table__cell data-table__cell--left data-table__player">
                    <div className="list-row__avatar">
                      <ItemIcon
                        icon={player.gender === 'male' ? '🧙‍♂️' : '🧙‍♀️'}
                        className="list-row__avatar-icon"
                      />
                    </div>
                    <div className="data-table__player-info">
                      <div className="list-row__name" style={{ color: 'var(--green-stat)' }}>
                        {player.name} (Bạn)
                      </div>
                      <RealmBadge text={realmLabel} />
                    </div>
                  </div>
                  <span className="data-table__cell data-table__cell--right meta-stat">
                    <AncientIcon name="flame" size={12} className="anc-icon--power" />
                    {formatNumber(power)}
                  </span>
                </div>
              </div>
            </GamePanel>
          )}
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId="ranking" onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
