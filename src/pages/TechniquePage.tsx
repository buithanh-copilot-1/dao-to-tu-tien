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
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { STAT_META } from '@/utils/stats';
import { formatNumber } from '@/utils/format';
import type { PlayerStats } from '@/types/game';
import { TECHNIQUES, getTechniqueUpgradeCost } from '@/data/techniques';

export function TechniquePage() {
  const player = useGameStore((s) => s.player)!;
  const learnTechnique = useGameStore((s) => s.learnTechnique);
  const upgradeTechnique = useGameStore((s) => s.upgradeTechnique);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Công Pháp" showOrnament onBack={goBack} />

          <GamePanel title="Linh thạch khả dụng">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-gold)' }}>
              <AncientIcon name="gem" size={16} className="anc-icon--crystal" />
              {formatNumber(player.crystal)}
            </div>
          </GamePanel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TECHNIQUES.map((t) => {
              const level = player.techniques?.[t.id] ?? 0;
              const learned = level > 0;
              const maxed = level >= t.maxLevel;
              const cost = learned ? getTechniqueUpgradeCost(t.id, level) : t.learnCost;
              const canAfford = player.crystal >= cost;
              const statKeys = Object.keys(t.bonusPerLevel) as (keyof PlayerStats)[];

              return (
                <div key={t.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="entity-icon entity-icon--sm">
                      <AncientIcon name={t.icon} size={20} className={learned ? 'anc-icon--gold' : 'anc-icon--crystal'} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>
                        {t.name}{' '}
                        <span style={{ fontSize: 9, color: learned ? 'var(--green-stat)' : 'var(--text-muted)' }}>
                          {learned ? `Lv.${level}/${t.maxLevel}` : 'Chưa học'}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.description}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                    {statKeys.map((k) => (
                      <span key={k} className="meta-stat" style={{ fontSize: 11, color: 'var(--green-stat)' }}>
                        <AncientIcon name={STAT_META[k].icon} size={13} className="anc-icon--jade" />
                        {STAT_META[k].label} +{formatNumber((t.bonusPerLevel[k] ?? 0) * Math.max(level, 1))}
                      </span>
                    ))}
                    {t.rateBonusPerLevel > 0 && (
                      <span className="meta-stat" style={{ fontSize: 11, color: 'var(--jade-glow)' }}>
                        <AncientIcon name="swirl" size={13} className="anc-icon--jade" />
                        Tốc tu luyện +{Math.round(t.rateBonusPerLevel * Math.max(level, 1) * 100)}%
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {maxed ? (
                      <span style={{ fontSize: 10, color: 'var(--green-stat)' }}>Đã đạt cấp tối đa</span>
                    ) : (
                      <GameButton
                        variant={learned ? 'secondary' : 'primary'}
                        style={{ fontSize: 11 }}
                        disabled={!canAfford}
                        onClick={() => (learned ? upgradeTechnique(t.id) : learnTechnique(t.id))}
                      >
                        {learned ? 'Nâng cấp' : 'Lĩnh ngộ'} · <AncientIcon name="gem" size={11} className="anc-icon--crystal" /> {formatNumber(cost)}
                      </GameButton>
                    )}
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
