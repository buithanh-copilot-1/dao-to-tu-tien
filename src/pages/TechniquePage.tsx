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
  ProgressBar,
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

        <GameBody className="technique-body">
          <PageHead title="Công Pháp" showOrnament onBack={goBack} />

          {/* Ornate Crystal Balance Panel */}
          <section className="technique-balance-panel">
            <span className="technique-balance-title">Linh Thạch Khả Dụng</span>
            <div className="technique-balance-value">
              <AncientIcon name="gem" size={16} className="anc-icon--crystal" />
              {formatNumber(player.crystal)}
            </div>
          </section>

          {/* List of Scroll Cards */}
          <div className="technique-list">
            {TECHNIQUES.map((t) => {
              const level = player.techniques?.[t.id] ?? 0;
              const learned = level > 0;
              const maxed = level >= t.maxLevel;
              const cost = learned ? getTechniqueUpgradeCost(t.id, level) : t.learnCost;
              const canAfford = player.crystal >= cost;
              const statKeys = Object.keys(t.bonusPerLevel) as (keyof PlayerStats)[];

              let cardStatus: 'unlearned' | 'learned' | 'maxed' = 'unlearned';
              if (maxed) cardStatus = 'maxed';
              else if (learned) cardStatus = 'learned';

              return (
                <div key={t.id} className={`technique-scroll-card ${cardStatus}`}>
                  {/* Card Header Info */}
                  <div className="technique-card-header">
                    <div className="technique-icon-container">
                      <AncientIcon 
                        name={t.icon} 
                        size={20} 
                        className={learned ? 'anc-icon--gold' : 'anc-icon--crystal'} 
                      />
                    </div>
                    <div className="technique-info-meta">
                      <div className="technique-name-tag">
                        <span>{t.name}</span>
                        <span className={`technique-level-badge ${cardStatus}`}>
                          {maxed ? 'Cực Hạn' : learned ? `Lv.${level}/${t.maxLevel}` : 'Chưa Học'}
                        </span>
                      </div>
                      <p className="technique-desc">{t.description}</p>
                    </div>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="technique-level-bar">
                    <ProgressBar
                      current={level}
                      max={t.maxLevel}
                      displayText={learned ? `Tiến độ lĩnh ngộ: ${level}/${t.maxLevel}` : 'Chưa lĩnh ngộ công pháp'}
                    />
                  </div>

                  {/* Stats Buff Grid */}
                  <div className="technique-stats-wrap">
                    <span className="technique-stats-title">Hậu Quả Lĩnh Ngộ:</span>
                    <div className="technique-stats-grid">
                      {statKeys.map((k) => {
                        const currentBonus = (t.bonusPerLevel[k] ?? 0) * level;
                        const perLevelBonus = t.bonusPerLevel[k] ?? 0;
                        return (
                          <span key={k} className="meta-stat" style={{ fontSize: 11, color: 'var(--green-stat)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AncientIcon name={STAT_META[k].icon} size={13} className="anc-icon--jade" />
                            {STAT_META[k].label} +{formatNumber(currentBonus > 0 ? currentBonus : perLevelBonus)}
                            {currentBonus > 0 && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}> (+{perLevelBonus}/Lv)</span>}
                          </span>
                        );
                      })}
                      {t.rateBonusPerLevel > 0 && (
                        <span className="meta-stat" style={{ fontSize: 11, color: 'var(--jade-glow)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AncientIcon name="swirl" size={13} className="anc-icon--jade" />
                          Tốc tu luyện +{Math.round((learned ? t.rateBonusPerLevel * level : t.rateBonusPerLevel) * 100)}%
                          {learned && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}> (+{Math.round(t.rateBonusPerLevel * 100)}%/Lv)</span>}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="technique-card-footer">
                    {maxed ? (
                      <span style={{ fontSize: 10, color: 'var(--green-stat)', fontWeight: 'bold' }}>
                        ✨ Công pháp đã đạt đỉnh phong ✨
                      </span>
                    ) : (
                      <GameButton
                        variant={learned ? 'secondary' : 'primary'}
                        style={{ fontSize: 10, padding: '4px 12px' }}
                        disabled={!canAfford}
                        onClick={() => (learned ? upgradeTechnique(t.id) : learnTechnique(t.id))}
                      >
                        {learned ? 'Nâng Cấp' : 'Lĩnh Ngộ'} · <AncientIcon name="gem" size={11} className="anc-icon--crystal" /> {formatNumber(cost)}
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
