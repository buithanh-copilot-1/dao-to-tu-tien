import { useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageTitle,
  GamePanel,
  GameButton,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { BattleScreen } from '@/components/game/BattleScreen';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { ARENA_DAILY_LIMIT, ARENA_OPPONENTS } from '@/data/arena';
import { calcCombatPower } from '@/utils/stats';
import { calcWinChance } from '@/systems/combat';
import { formatNumber } from '@/utils/format';

export function ArenaPage() {
  const player = useGameStore((s) => s.player)!;
  const dailyCounters = useGameStore((s) => s.dailyCounters);
  const { activeNav, navItems, handleNav } = useGameNav();
  const [opponentId, setOpponentId] = useState<string | null>(null);

  const power = calcCombatPower(player);
  const remaining = ARENA_DAILY_LIMIT - dailyCounters.arena;

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageTitle title="Đấu Pháp Đài" showOrnament />

          <GamePanel title="Thông tin">
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="meta-stat">
                <AncientIcon name="flame" size={13} className="anc-icon--power" /> Lực chiến:
                <strong style={{ color: 'var(--orange-power)' }}>{formatNumber(power)}</strong>
              </span>
              <span>Lượt còn: <strong style={{ color: 'var(--text-gold)' }}>{remaining}/{ARENA_DAILY_LIMIT}</strong></span>
            </div>
          </GamePanel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {ARENA_OPPONENTS.map((opp) => {
              const winChance = calcWinChance(power, opp.power);
              return (
                <div key={opp.id} className="list-row">
                  <span className="entity-icon">{opp.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>{opp.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{opp.realm}</div>
                    <div style={{ fontSize: 10, color: 'var(--orange-power)' }} className="meta-stat">
                      <AncientIcon name="flame" size={11} className="anc-icon--power" /> {formatNumber(opp.power)} · Thắng {winChance}%
                    </div>
                  </div>
                  <GameButton
                    variant="primary"
                    onClick={() => setOpponentId(opp.id)}
                    disabled={remaining <= 0}
                    style={{ fontSize: 10 }}
                  >
                    Khiêu chiến
                  </GameButton>
                </div>
              );
            })}
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>

        {opponentId && (
          <BattleScreen
            mode="arena"
            targetId={opponentId}
            onClose={() => setOpponentId(null)}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
