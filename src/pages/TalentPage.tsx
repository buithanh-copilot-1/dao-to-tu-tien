import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  GamePanel,
  GameButton,
  ProgressBar,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { STAT_META } from '@/utils/stats';
import { formatNumber } from '@/utils/format';
import type { PlayerStats } from '@/types/game';
import { TALENTS } from '@/data/talents';
import { getAvailableTalentPoints } from '@/systems/talent';

export function TalentPage() {
  const player = useGameStore((s) => s.player)!;
  const investTalent = useGameStore((s) => s.investTalent);
  const resetTalents = useGameStore((s) => s.resetTalents);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  const available = getAvailableTalentPoints(player);

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Thiên Phú" showOrnament onBack={goBack} />

          <GamePanel title="Điểm thiên phú">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>
                Khả dụng: <span style={{ color: 'var(--green-stat)' }}>{available}</span>
              </div>
              <GameButton variant="secondary" style={{ fontSize: 10 }} onClick={resetTalents}>
                Tẩy tủy
              </GameButton>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
              Mỗi lần đột phá cảnh giới nhận 1 điểm thiên phú để gia tăng chỉ số vĩnh viễn.
            </div>
          </GamePanel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TALENTS.map((t) => {
              const level = player.talents?.[t.id] ?? 0;
              const maxed = level >= t.maxLevel;
              const statKeys = Object.keys(t.bonusPerLevel) as (keyof PlayerStats)[];

              return (
                <div key={t.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="entity-icon entity-icon--sm">
                      <AncientIcon name={t.icon} size={20} className={level > 0 ? 'anc-icon--power' : 'anc-icon--gold'} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>
                        {t.name} <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Lv.{level}/{t.maxLevel}</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.description}</div>
                    </div>
                    {maxed ? (
                      <span style={{ fontSize: 10, color: 'var(--green-stat)' }}>MAX</span>
                    ) : (
                      <GameButton
                        variant="primary"
                        style={{ fontSize: 11, padding: '4px 10px' }}
                        disabled={available <= 0}
                        onClick={() => investTalent(t.id)}
                      >
                        <AncientIcon name="plus" size={12} />
                      </GameButton>
                    )}
                  </div>
                  <ProgressBar current={level} max={t.maxLevel} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                    {statKeys.map((k) => (
                      <span key={k} className="meta-stat" style={{ fontSize: 11, color: 'var(--green-stat)' }}>
                        <AncientIcon name={STAT_META[k].icon} size={13} className="anc-icon--jade" />
                        {STAT_META[k].label} +{formatNumber((t.bonusPerLevel[k] ?? 0) * Math.max(level, 1))}
                        {level > 0 ? '' : `/điểm`}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
