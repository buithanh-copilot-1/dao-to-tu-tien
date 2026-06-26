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
import type { ElementType, PlayerStats } from '@/types/game';
import {
  SECTS,
  getSect,
  getSectRankName,
  getSectStatBonus,
  getNextRankReq,
} from '@/data/sects';

const ELEMENT_LABEL: Record<ElementType, string> = {
  metal: 'Kim', wood: 'Mộc', water: 'Thủy', fire: 'Hỏa', earth: 'Thổ',
};

function BonusList({ stats }: { stats: Partial<PlayerStats> }) {
  const keys = Object.keys(stats) as (keyof PlayerStats)[];
  if (keys.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 4 }}>
      {keys.map((k) => (
        <span key={k} className="meta-stat" style={{ fontSize: 11, color: 'var(--green-stat)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <AncientIcon name={STAT_META[k].icon} size={13} className="anc-icon--jade" />
          {STAT_META[k].label} +{formatNumber(stats[k] ?? 0)}
        </span>
      ))}
    </div>
  );
}

export function SectPage() {
  const player = useGameStore((s) => s.player)!;
  const joinSect = useGameStore((s) => s.joinSect);
  const leaveSect = useGameStore((s) => s.leaveSect);
  const donateSect = useGameStore((s) => s.donateSect);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  const sectState = player.sect;
  const sect = sectState ? getSect(sectState.id) : undefined;

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="sect-body">
          <PageHead title="Tông Môn" showOrnament onBack={goBack} />

          {sect && sectState ? (
            <>
              {/* Pagoda Gate Panel */}
              <section className={`sect-gate-panel element-${sect.element}`}>
                <h2 className="sect-header-name">{sect.name}</h2>
                <div className="sect-rank-tag">{getSectRankName(sectState.rank)}</div>
                
                <div className="sect-gate-illustration">
                  <div className="sect-gate-glow" />
                  <svg className="sect-gate-svg" viewBox="0 0 24 24" style={{ color: `var(--border-${sect.element})` }}>
                    <path d="M3,6.5 L21,6.5 L21,9 L3,9 L3,6.5 Z M4.5,9.5 L19.5,9.5 L17,21 L7,21 L4.5,9.5 Z M8,12 L8,17 L10,17 L10,12 L8,12 Z M14,12 L14,17 L16,17 L16,12 L14,12 Z" />
                  </svg>
                  <div className="sect-gate-mist" />
                </div>

                <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', maxWidth: '85%', lineHeight: 1.4, margin: '4px 0 10px' }}>
                  "{sect.description}"
                </div>

                {(() => {
                  const nextReq = getNextRankReq(sectState.rank);
                  return (
                    <div className="sect-progress-container">
                      <div className="sect-progress-labels">
                        <span>Cống hiến: {formatNumber(sectState.contribution)}</span>
                        <span>{nextReq !== null ? `Cần lên bậc: ${formatNumber(nextReq)}` : 'Đỉnh Phong'}</span>
                      </div>
                      <ProgressBar
                        current={sectState.contribution}
                        max={nextReq != null ? nextReq : Math.max(sectState.contribution, 1)}
                        displayText={nextReq === null ? 'Tối Đa' : undefined}
                      />
                    </div>
                  );
                })()}
              </section>

              {/* Sect Buffs Panel */}
              <GamePanel title="Phúc Lợi Tông Môn">
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Chỉ số thuộc tính gia tăng hiện tại:
                </div>
                <BonusList stats={getSectStatBonus(sectState.id, sectState.rank)} />
              </GamePanel>

              {/* Donation & Actions Panel */}
              <GamePanel title="Tông Môn Thiết Sự">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="sect-action-row">
                    <div className="sect-action-info">
                      <span className="sect-action-title">Cống Hiến Vàng</span>
                      <span className="sect-action-desc">Đóng góp vàng vào ngân khố tông môn để nhận cống hiến.</span>
                    </div>
                    <div className="sect-action-btn-group">
                      {[100, 1000, 10000].map((amt) => (
                        <GameButton
                          key={amt}
                          variant="secondary"
                          style={{ fontSize: 10, minWidth: '65px', padding: '4px 6px' }}
                          disabled={player.gold < amt}
                          onClick={() => donateSect(amt)}
                        >
                          <AncientIcon name="coin" size={11} className="anc-icon--gold" /> {formatNumber(amt)}
                        </GameButton>
                      ))}
                    </div>
                  </div>

                  <div className="sect-leave-btn-container">
                    <button className="sect-leave-btn" onClick={leaveSect}>
                      Thoái Xuất Tông Môn
                    </button>
                  </div>
                </div>
              </GamePanel>
            </>
          ) : (
            <>
              {/* Recruitment List Title */}
              <GamePanel title="Bái Kiến Sơn Môn">
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Đạo hữu hãy lựa chọn bái nhập một đại tông môn tu tiên. Gia nhập môn phái cùng linh căn với bản thân sẽ nhận được phúc lợi cộng hưởng cao nhất!
                </div>
              </GamePanel>

              {/* Recruitment List */}
              <div className="sect-recruit-list">
                {SECTS.map((s) => {
                  const matched = s.element === player.element;
                  return (
                    <div 
                      key={s.id} 
                      className={`sect-recruit-card element-${s.element} ${matched ? 'matched' : ''}`}
                      style={matched ? { color: `var(--border-${s.element})` } : undefined}
                    >
                      <div className="sect-recruit-card-header">
                        <span className="sect-card-title">
                          <span className="sect-card-icon">
                            <AncientIcon name={s.icon} size={18} className={`anc-icon--${s.element === 'metal' ? 'gold' : s.element === 'wood' || s.element === 'water' ? 'jade' : 'silver'}`} />
                          </span>
                          {s.name}
                        </span>
                        <span className={`sect-element-badge ${s.element}`}>
                          Hệ {ELEMENT_LABEL[s.element]}
                        </span>
                      </div>
                      
                      <p className="sect-card-description">{s.description}</p>
                      
                      <div className="sect-card-buffs">
                        <div style={{ fontSize: 9, fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: 2 }}>Phúc Lợi Mỗi Chức Vị:</div>
                        <BonusList stats={s.bonusPerRank} />
                      </div>

                      <div className="sect-card-footer">
                        <span className="sect-join-cost">
                          Phí bái kiến: <AncientIcon name="coin" size={12} className="anc-icon--gold" /> {formatNumber(s.joinCost)}
                        </span>
                        <GameButton
                          variant={matched ? 'primary' : 'secondary'}
                          style={{ fontSize: 10, padding: '4px 12px' }}
                          disabled={player.gold < s.joinCost}
                          onClick={() => joinSect(s.id)}
                        >
                          Bái Nhập
                        </GameButton>
                      </div>
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
      </GameScreen>
    </GameFrame>
  );
}
