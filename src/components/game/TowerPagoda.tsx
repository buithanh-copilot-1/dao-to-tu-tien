import type { TowerChapter, TowerFloorDef } from '@/data/tower';
import { AncientIcon, ItemIcon, CatalogItemButton } from '@/components';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import { getDropPreviewItems } from '@/systems/drops';
import { formatNumber } from '@/utils/format';

interface TowerFloorRailProps {
  towerBestFloor: number;
  nextFloor: number;
  selectedFloor: number;
  climbingFloor: number | null;
  disabled?: boolean;
  onSelectFloor: (floor: number) => void;
}

export function TowerFloorRail({
  towerBestFloor,
  nextFloor,
  selectedFloor,
  climbingFloor,
  disabled,
  onSelectFloor,
}: TowerFloorRailProps) {
  const start = Math.max(1, nextFloor - 5);
  const floors: number[] = [];
  for (let f = nextFloor; f >= start; f -= 1) floors.push(f);

  return (
    <aside className="tower-rail" aria-label="Danh sách tầng">
      <div className="tower-rail__peak">
        <span className="tower-rail__peak-label">Tầng cao nhất</span>
        <strong>Tầng {towerBestFloor}</strong>
      </div>
      <div className="tower-rail__list">
        {floors.map((floor) => {
          const cleared = floor <= towerBestFloor;
          const isCurrent = floor === nextFloor;
          const isClimbing = floor === climbingFloor;
          const locked = floor > nextFloor;
          const selected = floor === selectedFloor;

          return (
            <button
              key={floor}
              type="button"
              disabled={disabled}
              className={[
                'tower-rail__item',
                cleared && 'tower-rail__item--cleared',
                isCurrent && 'tower-rail__item--current',
                isClimbing && 'tower-rail__item--climbing',
                locked && 'tower-rail__item--locked',
                selected && 'tower-rail__item--selected',
              ].filter(Boolean).join(' ')}
              onClick={() => onSelectFloor(floor)}
            >
              <span className="tower-rail__num">Tầng {floor}</span>
              <span className="tower-rail__state">
                {cleared ? 'Đã vượt' : isCurrent ? 'Khiêu chiến' : locked ? 'Khóa' : '·'}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

interface TowerVisualProps {
  currentFloor: number;
  recommendedPower: number;
  chapter: TowerChapter;
}

export function TowerVisual({ currentFloor, recommendedPower, chapter }: TowerVisualProps) {
  return (
    <div className="tower-visual" aria-hidden="true">
      <div className="tower-visual__bg">
        <div className="tower-visual__moon" />
        <div className="tower-visual__mist" />
        <div className="tower-visual__mountains" />
      </div>
      <div className="tower-visual__pagoda">
        <div className="tower-visual__roof" />
        <div className="tower-visual__body">
          <span className="tower-visual__tier" />
          <span className="tower-visual__tier" />
          <span className="tower-visual__tier" />
          <span className="tower-visual__tier" />
          <span className="tower-visual__tier tower-visual__tier--glow" />
        </div>
        <div className="tower-visual__base" />
        <div className="tower-visual__aura" />
      </div>
      <div className="tower-visual__badge">
        <p>
          Tầng hiện tại: <strong>{currentFloor}</strong>
        </p>
        <p>
          Chiến lực đề xuất: <strong>{formatNumber(recommendedPower)}</strong>
        </p>
        <p className="tower-visual__chapter">
          <ItemIcon icon={chapter.icon} className="tower-visual__chapter-icon" />
          {chapter.name}
        </p>
      </div>
    </div>
  );
}

interface TowerSidePanelProps {
  playerRank: number;
  trialPoints: number;
  towerBestFloor: number;
  chapters: TowerChapter[];
  selectedChapterId: number;
  disabled?: boolean;
  onChapterChange: (id: number) => void;
  topPlayers: Array<{ rank: number; name: string; score: number }>;
}

export function TowerSidePanel({
  playerRank,
  trialPoints,
  towerBestFloor,
  chapters,
  selectedChapterId,
  disabled,
  onChapterChange,
  topPlayers,
}: TowerSidePanelProps) {
  const nextMilestone = [10, 20, 30, 40, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500].find(
    (m) => m > towerBestFloor,
  ) ?? 500;
  const milestoneDone = towerBestFloor >= nextMilestone;

  return (
    <aside className="tower-aside">
      <section className="tower-aside__card">
        <h3>BXH của tôi</h3>
        <div className="tower-aside__rank-row">
          <span className="tower-aside__rank-num">{playerRank}</span>
          <div>
            <p className="tower-aside__rank-label">Điểm thí luyện</p>
            <strong>{formatNumber(trialPoints)}</strong>
          </div>
        </div>
      </section>

      <section className="tower-aside__card tower-aside__card--server">
        <h3>BXH Server</h3>
        <ul className="tower-aside__server-list">
          {topPlayers.map((entry) => (
            <li key={entry.rank}>
              <span>{entry.rank}. {entry.name}</span>
              <strong>{formatNumber(entry.score)}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="tower-aside__card tower-aside__card--milestone">
        <h3>Thưởng vượt {nextMilestone} tầng</h3>
        <div className="tower-aside__milestone">
          <ItemIcon icon="🎁" className="tower-aside__chest" />
          <div className="tower-aside__milestone-bar">
            <div
              className="tower-aside__milestone-fill"
              style={{ width: `${Math.min(100, (towerBestFloor / nextMilestone) * 100)}%` }}
            />
          </div>
          <span className="tower-aside__milestone-text">
            ({towerBestFloor}/{nextMilestone}){milestoneDone ? ' ✓' : ''}
          </span>
        </div>
      </section>

      <section className="tower-aside__chapters">
        <h3>Chương</h3>
        <div className="tower-aside__chapter-scroll">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              type="button"
              disabled={disabled}
              title={ch.name}
              className={`tower-aside__chapter ${ch.id === selectedChapterId ? 'tower-aside__chapter--active' : ''} ${towerBestFloor >= ch.endFloor ? 'tower-aside__chapter--done' : ''}`}
              onClick={() => onChapterChange(ch.id)}
            >
              <ItemIcon icon={ch.icon} className="tower-aside__chapter-icon" />
              <small>{ch.id}</small>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

interface TowerBottomDockProps {
  floor: number;
  data: TowerFloorDef;
  cleared: boolean;
  isCurrent: boolean;
  winChance: number;
  canChallenge: boolean;
  canAuto: boolean;
  visualAutoRunning: boolean;
  fastAutoRunning: boolean;
  onChallenge: () => void;
  onAutoFast: () => void;
  onAutoVisual: () => void;
  onStopAuto: () => void;
}

export function TowerBottomDock({
  floor,
  data,
  cleared,
  isCurrent,
  winChance,
  canChallenge,
  canAuto,
  visualAutoRunning,
  fastAutoRunning,
  onChallenge,
  onAutoFast,
  onAutoVisual,
  onStopAuto,
}: TowerBottomDockProps) {
  const drops = getDropPreviewItems('tower', { tower: data });

  return (
    <section className={`tower-dock ${isCurrent ? 'tower-dock--current' : ''}`}>
      <div className="tower-dock__head">
        <div>
          <p className="tower-dock__floor">
            <ItemIcon icon={data.icon} className="tower-dock__floor-icon" />
            Tầng {floor} · {data.guardName}
          </p>
          <p className="tower-dock__meta">
            {data.chapterName}
            {data.isChapterBoss && ' · BOSS'}
            {data.isMilestone && !data.isChapterBoss && ' · ẢI'}
          </p>
        </div>
        <div className="tower-dock__chance">
          <span>Tỷ lệ thắng</span>
          <strong>{winChance}%</strong>
        </div>
      </div>

      <div className="tower-dock__rewards">
        <span className="tower-dock__rewards-title">Thưởng vượt ải</span>
        <div className="tower-dock__reward-row">
          <span className="meta-stat"><AncientIcon name="coin" size={13} className="anc-icon--gold" /> {formatNumber(data.goldReward)}</span>
          <span className="meta-stat"><AncientIcon name="gem" size={13} className="anc-icon--crystal" /> {formatNumber(data.crystalReward)}</span>
          {data.jadeReward > 0 && <span className="meta-stat"><AncientIcon name="jade" size={13} className="anc-icon--jade" /> {data.jadeReward}</span>}
          {drops.map((drop) => (
            <CatalogItemButton
              key={drop.templateId}
              templateId={drop.templateId}
              className="meta-stat catalog-chip-btn"
            >
              <ItemIcon icon={ITEM_TEMPLATES[drop.templateId]?.icon ?? '📦'} className="reward-item-icon" />
              {ITEM_TEMPLATES[drop.templateId]?.name ?? drop.templateId}
            </CatalogItemButton>
          ))}
        </div>
      </div>

      <div className="tower-dock__actions">
        {cleared ? (
          <p className="tower-dock__cleared meta-stat"><AncientIcon name="check" size={14} /> Đã vượt tầng này</p>
        ) : visualAutoRunning || fastAutoRunning ? (
          <button type="button" className="tower-dock__btn tower-dock__btn--stop" onClick={onStopAuto}>
            <AncientIcon name="pause" size={15} />
            {fastAutoRunning ? 'Dừng vượt nhanh' : 'Dừng tự động'}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="tower-dock__btn tower-dock__btn--main"
              disabled={!canChallenge || fastAutoRunning}
              onClick={onChallenge}
            >
              <AncientIcon name="sword" size={16} /> Khiêu chiến
            </button>
            <div className="tower-dock__secondary">
              <button type="button" className="tower-dock__link" disabled={!canAuto || fastAutoRunning} onClick={onAutoFast}>
                <AncientIcon name="cycle" size={13} /> {fastAutoRunning ? 'Đang vượt...' : 'Vượt nhanh'}
              </button>
              <button type="button" className="tower-dock__link" disabled={!canAuto || fastAutoRunning} onClick={onAutoVisual}>
                <AncientIcon name="play" size={12} /> Tự động xem
              </button>
            </div>
          </>
        )}
        {!isCurrent && !cleared && (
          <p className="tower-dock__locked meta-stat"><AncientIcon name="lock" size={12} /> Chọn tầng đang mở để khiêu chiến</p>
        )}
      </div>
    </section>
  );
}
