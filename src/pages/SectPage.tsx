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
        <span key={k} className="meta-stat" style={{ fontSize: 11, color: 'var(--green-stat)' }}>
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

        <GameBody>
          <PageHead title="Tông Môn" showOrnament onBack={goBack} />

          {sect && sectState ? (
            <>
              <GamePanel title={sect.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="entity-icon">
                    <AncientIcon name={sect.icon} size={26} className="anc-icon--gold" />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>
                      {getSectRankName(sectState.rank)} · Hệ {ELEMENT_LABEL[sect.element]}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sect.description}</div>
                  </div>
                </div>

                {(() => {
                  const nextReq = getNextRankReq(sectState.rank);
                  return (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        <span>Cống hiến: {formatNumber(sectState.contribution)}</span>
                        <span>{nextReq !== null ? `Lên bậc: ${formatNumber(nextReq)}` : 'Đã đạt đỉnh'}</span>
                      </div>
                      <ProgressBar
                        current={sectState.contribution}
                        max={nextReq != null ? nextReq : Math.max(sectState.contribution, 1)}
                        displayText={nextReq === null ? 'Tối đa' : undefined}
                      />
                    </div>
                  );
                })()}
              </GamePanel>

              <GamePanel title="Phúc lợi tông môn">
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Chỉ số cộng thêm hiện tại:</div>
                <BonusList stats={getSectStatBonus(sectState.id, sectState.rank)} />
              </GamePanel>

              <GamePanel title="Cống hiến">
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
                  Dùng vàng cống hiến cho tông môn để thăng chức vị, nhận thêm phúc lợi.
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[100, 1000, 10000].map((amt) => (
                    <GameButton
                      key={amt}
                      variant="secondary"
                      style={{ fontSize: 11 }}
                      disabled={player.gold < amt}
                      onClick={() => donateSect(amt)}
                    >
                      <AncientIcon name="coin" size={12} className="anc-icon--gold" /> {formatNumber(amt)}
                    </GameButton>
                  ))}
                </div>
                <div style={{ marginTop: 12, textAlign: 'right' }}>
                  <GameButton variant="secondary" style={{ fontSize: 10, color: 'var(--text-muted)' }} onClick={leaveSect}>
                    Thoái xuất tông môn
                  </GameButton>
                </div>
              </GamePanel>
            </>
          ) : (
            <>
              <GamePanel title="Chọn tông môn bái nhập">
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  Gia nhập tông môn cùng linh căn để cộng hưởng phúc lợi mạnh nhất. Mỗi lúc chỉ ở một tông môn.
                </div>
              </GamePanel>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SECTS.map((s) => {
                  const matched = s.element === player.element;
                  return (
                    <div key={s.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="entity-icon entity-icon--sm">
                          <AncientIcon name={s.icon} size={20} className="anc-icon--gold" />
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>
                            {s.name} {matched && <span style={{ color: 'var(--green-stat)', fontSize: 9 }}>· hợp linh căn</span>}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Hệ {ELEMENT_LABEL[s.element]} — {s.description}</div>
                        </div>
                      </div>
                      <BonusList stats={s.bonusPerRank} />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <GameButton
                          variant="primary"
                          style={{ fontSize: 11 }}
                          disabled={player.gold < s.joinCost}
                          onClick={() => joinSect(s.id)}
                        >
                          Bái nhập · <AncientIcon name="coin" size={11} className="anc-icon--gold" /> {formatNumber(s.joinCost)}
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
