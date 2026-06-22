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
  GameButton,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { BattleScreen } from '@/components/game/BattleScreen';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { BOSSES, DUNGEONS } from '@/data/dungeons';
import { getBossRealmLabel } from '@/data/bosses';
import { getMaxRealmId } from '@/data/realms';
import { calcCombatPower } from '@/utils/stats';
import { calcWinChance } from '@/systems/combat';
import { formatNumber } from '@/utils/format';
import type { BattleMode } from '@/types/battle';

interface ActiveBattle {
  mode: BattleMode;
  targetId: string;
}

const BOSS_DAILY_LIMIT = 3;

export function DungeonPage() {
  const player = useGameStore((s) => s.player)!;
  const dailyCounters = useGameStore((s) => s.dailyCounters);
  const { activeNav, navItems, handleNav } = useGameNav();
  const [tab, setTab] = useState('dungeon');
  const [battle, setBattle] = useState<ActiveBattle | null>(null);
  const [bossRealmFilter, setBossRealmFilter] = useState<number | 'all'>('all');

  const power = calcCombatPower(player);

  const bossRealms = Array.from(new Set(BOSSES.map((b) => b.minRealmId))).sort((a, b) => a - b);
  const filteredBosses = bossRealmFilter === 'all'
    ? BOSSES
    : BOSSES.filter((b) => b.minRealmId === bossRealmFilter);

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageTitle title="Bí Cảnh" showOrnament />

          <GamePanel title="Lực chiến">
            <div style={{ fontSize: 14, color: 'var(--orange-power)', textAlign: 'center' }}>
              🔥 {formatNumber(power)}
            </div>
          </GamePanel>

          <TabBar
            tabs={[
              { id: 'dungeon', label: `Phó bản (${DUNGEONS.length})` },
              { id: 'boss', label: `Boss (${BOSSES.length})` },
            ]}
            activeId={tab}
            onChange={setTab}
          />

          {tab === 'dungeon' && (
            <div className="content-list">
              {DUNGEONS.map((d) => {
                const runs = dailyCounters.dungeons[d.id] ?? 0;
                const locked = player.realmId < d.minRealmId;
                const winChance = calcWinChance(power, d.enemyPower);
                return (
                  <div key={d.id} className={`content-list__row ${locked ? 'content-list__row--locked' : ''}`}>
                    <span className="content-list__icon">{d.icon}</span>
                    <div className="content-list__info">
                      <div className="content-list__title">{d.name}</div>
                      <div className="content-list__desc">{d.description}</div>
                      <div className="content-list__meta">
                        3 đợt · 🪙{formatNumber(d.goldReward)} 💎{formatNumber(d.crystalReward)} · {runs}/{d.dailyLimit} lượt · {winChance}%
                      </div>
                    </div>
                    <GameButton
                      variant="primary"
                      onClick={() => setBattle({ mode: 'dungeon', targetId: d.id })}
                      disabled={locked || runs >= d.dailyLimit}
                      style={{ fontSize: 10 }}
                    >
                      {locked ? 'Khóa' : 'Vào'}
                    </GameButton>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'boss' && (
            <>
              <div className="boss-realm-filter">
                <button
                  type="button"
                  className={`boss-realm-filter__item ${bossRealmFilter === 'all' ? 'boss-realm-filter__item--active' : ''}`}
                  onClick={() => setBossRealmFilter('all')}
                >
                  Tất cả
                </button>
                {bossRealms.map((realmId) => (
                  <button
                    key={realmId}
                    type="button"
                    className={`boss-realm-filter__item ${bossRealmFilter === realmId ? 'boss-realm-filter__item--active' : ''}`}
                    onClick={() => setBossRealmFilter(realmId)}
                  >
                    {getBossRealmLabel(realmId)}
                  </button>
                ))}
              </div>

              <div className="content-list">
                {filteredBosses.map((b) => {
                  const runs = dailyCounters.bosses[b.id] ?? 0;
                  const locked = player.realmId < b.minRealmId;
                  const winChance = calcWinChance(power, b.power);
                  const isEndgame = b.minRealmId >= getMaxRealmId() - 1;
                  return (
                    <div key={b.id} className={`content-list__row ${locked ? 'content-list__row--locked' : ''}`}>
                      <span className="content-list__icon">{b.icon}</span>
                      <div className="content-list__info">
                        <div className="content-list__title">
                          {b.name}
                          {isEndgame && <span className="content-list__badge">BOSS</span>}
                        </div>
                        <div className="content-list__desc">{b.description}</div>
                        <div className="content-list__meta">
                          {getBossRealmLabel(b.minRealmId)} · HP {formatNumber(b.hp)} · 🔥 {formatNumber(b.power)} · {winChance}%
                        </div>
                        <div className="content-list__meta">
                          🪙{formatNumber(b.goldReward)} 💎{formatNumber(b.crystalReward)} 🟢{b.jadeReward} · {runs}/{BOSS_DAILY_LIMIT}
                        </div>
                      </div>
                      <GameButton
                        variant="primary"
                        onClick={() => setBattle({ mode: 'boss', targetId: b.id })}
                        disabled={locked || runs >= BOSS_DAILY_LIMIT}
                        style={{ fontSize: 10 }}
                      >
                        {locked ? 'Khóa' : 'Đánh'}
                      </GameButton>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>

        {battle && (
          <BattleScreen
            mode={battle.mode}
            targetId={battle.targetId}
            onClose={() => setBattle(null)}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
