import { useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageTitle,
  TabBar,
  GamePanel,
  RealmBadge,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
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
          <PageTitle title="Bảng Xếp Hạng" />

          <TabBar tabs={RANK_TABS} activeId={activeTab} onChange={setActiveTab} />

          <div style={{ marginTop: 8 }}>
            <div style={{
              display: 'flex',
              padding: '6px 8px',
              fontSize: 10,
              color: 'var(--text-muted)',
              borderBottom: '1px solid rgba(212,175,55,0.15)',
            }}>
              <span style={{ width: 32 }}>Hạng</span>
              <span style={{ flex: 1 }}>Người chơi</span>
              <span style={{ width: 80, textAlign: 'right' }}>Lực Chiến</span>
            </div>

            {sorted.slice(0, 15).map((row) => (
              <div key={row.name + row.rank} className="list-row">
                <span className={`rank-medal ${row.rank <= 3 ? `rank-medal--top${row.rank}` : ''}`}>
                  {row.rank}
                </span>
                <div className="list-row__avatar">{row.isPlayer ? (player.gender === 'male' ? '🧙‍♂️' : '🧙‍♀️') : '🧙'}</div>
                <div className="list-row__info">
                  <div className="list-row__name" style={row.isPlayer ? { color: 'var(--green-stat)' } : undefined}>
                    {row.name}{row.isPlayer ? ' (Bạn)' : ''}
                  </div>
                  <RealmBadge text={row.realm} />
                </div>
                <span className="list-row__value meta-stat">
                  <AncientIcon name="flame" size={12} className="anc-icon--power" /> {formatNumber(row.power)}
                </span>
              </div>
            ))}
          </div>

          {playerEntry && (
            <GamePanel title="Hạng của bạn">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-gold)', width: 40, textAlign: 'center' }}>
                  {playerEntry.rank}
                </span>
                <div className="list-row__avatar">{player.gender === 'male' ? '🧙‍♂️' : '🧙‍♀️'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--green-stat)' }}>{player.name} (Bạn)</div>
                  <RealmBadge text={realmLabel} />
                  <div className="meta-stat" style={{ fontSize: 11, color: 'var(--orange-power)', marginTop: 2 }}>
                    <AncientIcon name="flame" size={11} className="anc-icon--power" /> {formatNumber(power)}
                  </div>
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
