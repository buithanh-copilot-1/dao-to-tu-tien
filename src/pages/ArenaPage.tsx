import { useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  GameButton,
  AncientIcon,
  ItemIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { BattleScreen } from '@/components/game/BattleScreen';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { ARENA_DAILY_LIMIT, ARENA_OPPONENTS } from '@/data/arena';
import { calcCombatPower } from '@/utils/stats';
import { calcWinChance } from '@/systems/combat';
import { formatNumber } from '@/utils/format';

export function ArenaPage() {
  const player = useGameStore((s) => s.player)!;
  const dailyCounters = useGameStore((s) => s.dailyCounters);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();
  const [opponentId, setOpponentId] = useState<string | null>(null);

  const power = calcCombatPower(player);
  const remaining = ARENA_DAILY_LIMIT - dailyCounters.arena;

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="arena-body">
          <PageHead title="Đấu Pháp Đài" showOrnament onBack={goBack} />

          {/* Info Status Panel */}
          <section className="arena-info-panel">
            <div className="arena-info-grid">
              <span className="arena-info-power">
                <AncientIcon name="flame" size={14} className="anc-icon--power" /> 
                Lực chiến: <strong>{formatNumber(power)}</strong>
              </span>
              <span className="arena-info-turns">
                Lượt còn lại: <strong>{remaining}/{ARENA_DAILY_LIMIT}</strong>
              </span>
            </div>
          </section>

          {/* Opponents List */}
          <div className="arena-opponents-list">
            {ARENA_OPPONENTS.map((opp) => {
              const winChance = calcWinChance(power, opp.power);
              
              let winClass: 'high' | 'medium' | 'low' = 'low';
              if (winChance >= 75) winClass = 'high';
              else if (winChance >= 40) winClass = 'medium';

              return (
                <div key={opp.id} className="arena-opponent-card">
                  {/* Opponent Avatar */}
                  <div className="arena-opponent-avatar-wrap">
                    <ItemIcon icon={opp.icon} className="arena-opponent-avatar-img" />
                  </div>

                  {/* Opponent Info Details */}
                  <div className="arena-opponent-details">
                    <div className="arena-opponent-name">{opp.name}</div>
                    <div className="arena-opponent-realm">{opp.realm}</div>
                    <div className="arena-opponent-power-win">
                      <span className="arena-opp-power">
                        <AncientIcon name="flame" size={11} className="anc-icon--power" /> 
                        {formatNumber(opp.power)}
                      </span>
                      <span className={`arena-opp-win ${winClass}`}>
                        Thắng {winChance}%
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="arena-challenge-btn">
                    <GameButton
                      variant="primary"
                      onClick={() => setOpponentId(opp.id)}
                      disabled={remaining <= 0}
                      style={{ fontSize: 10, padding: '4px 10px' }}
                    >
                      Khiêu chiến
                    </GameButton>
                  </div>
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
