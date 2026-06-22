import { useEffect, useRef } from 'react';
import type { TowerFloorDef } from '@/data/tower';
import { formatNumber } from '@/utils/format';

export interface TowerLevelProps {
  floor: number;
  data: TowerFloorDef;
  cleared: boolean;
  isCurrent: boolean;
  locked: boolean;
  selected: boolean;
  onSelect: (floor: number) => void;
}

function TowerLevel({ floor, data, cleared, isCurrent, locked, selected, onSelect }: TowerLevelProps) {
  return (
    <button
      type="button"
      data-floor={floor}
      data-current={isCurrent || undefined}
      className={[
        'tower-level',
        cleared && 'tower-level--cleared',
        isCurrent && 'tower-level--current',
        locked && 'tower-level--locked',
        selected && 'tower-level--selected',
        data.isChapterBoss && 'tower-level--boss',
        data.isMilestone && !data.isChapterBoss && 'tower-level--milestone',
      ].filter(Boolean).join(' ')}
      onClick={() => onSelect(floor)}
    >
      <span className="tower-level__wing tower-level__wing--left" />
      <div className="tower-level__plate">
        <span className="tower-level__num">{floor}</span>
        <span className="tower-level__icon">{data.icon}</span>
        <span className="tower-level__status">
          {cleared ? '✓' : isCurrent ? '⚔' : locked ? '🔒' : '·'}
        </span>
      </div>
      <span className="tower-level__wing tower-level__wing--right" />
    </button>
  );
}

interface TowerPagodaProps {
  floors: number[];
  towerBestFloor: number;
  nextFloor: number;
  selectedFloor: number | null;
  onSelectFloor: (floor: number) => void;
  getFloorData: (floor: number) => TowerFloorDef;
}

export function TowerPagoda({
  floors,
  towerBestFloor,
  nextFloor,
  selectedFloor,
  onSelectFloor,
  getFloorData,
}: TowerPagodaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current?.querySelector('[data-current="true"]');
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [floors, nextFloor]);

  const topFloor = floors[floors.length - 1];
  const topData = getFloorData(topFloor);

  return (
    <div className="tower-pagoda">
      <div className="tower-pagoda__roof">
        <div className="tower-pagoda__roof-tier" />
        <div className="tower-pagoda__roof-tier tower-pagoda__roof-tier--sm" />
        <span className="tower-pagoda__roof-icon">{topData.isChapterBoss ? '👑' : '🏮'}</span>
      </div>

      <div className="tower-pagoda__shaft" ref={scrollRef}>
        <div className="tower-pagoda__floors">
          {[...floors].reverse().map((floor) => {
            const data = getFloorData(floor);
            return (
              <TowerLevel
                key={floor}
                floor={floor}
                data={data}
                cleared={floor <= towerBestFloor}
                isCurrent={floor === nextFloor}
                locked={floor > nextFloor}
                selected={selectedFloor === floor}
                onSelect={onSelectFloor}
              />
            );
          })}
        </div>
      </div>

      <div className="tower-pagoda__base">
        <span>Đế Tháp · Tầng {floors[0]}</span>
      </div>
    </div>
  );
}

interface TowerFloorScreenProps {
  floor: number;
  data: TowerFloorDef;
  cleared: boolean;
  isCurrent: boolean;
  winChance: number;
  canChallenge: boolean;
  onChallenge: () => void;
}

export function TowerFloorScreen({
  floor,
  data,
  cleared,
  isCurrent,
  winChance,
  canChallenge,
  onChallenge,
}: TowerFloorScreenProps) {
  return (
    <div className={`tower-floor-screen ${isCurrent ? 'tower-floor-screen--current' : ''}`}>
      <div className="tower-floor-screen__header">
        <span className="tower-floor-screen__floor">Tầng {floor}</span>
        <span className="tower-floor-screen__icon">{data.icon}</span>
        {data.isChapterBoss && <span className="tower-floor-screen__badge">BOSS CHƯƠNG</span>}
        {data.isMilestone && !data.isChapterBoss && <span className="tower-floor-screen__badge tower-floor-screen__badge--milestone">ẢI</span>}
      </div>
      <h3 className="tower-floor-screen__name">{data.guardName}</h3>
      <p className="tower-floor-screen__chapter">{data.chapterName}</p>

      <div className="tower-floor-screen__stats">
        <div className="tower-floor-screen__stat">
          <span>Lực địch</span>
          <strong>{formatNumber(data.enemyPower)}</strong>
        </div>
        <div className="tower-floor-screen__stat">
          <span>Tỷ lệ thắng</span>
          <strong className="tower-floor-screen__stat--chance">{winChance}%</strong>
        </div>
        <div className="tower-floor-screen__stat">
          <span>HP</span>
          <strong>{formatNumber(data.enemyHp)}</strong>
        </div>
      </div>

      <div className="tower-floor-screen__rewards">
        <span>🪙 {formatNumber(data.goldReward)}</span>
        <span>💎 {formatNumber(data.crystalReward)}</span>
        {data.jadeReward > 0 && <span>🟢 {data.jadeReward}</span>}
      </div>

      <div className="tower-floor-screen__action">
        {cleared ? (
          <span className="tower-floor-screen__cleared">✓ Đã vượt tầng này</span>
        ) : isCurrent ? (
          <button
            type="button"
            className="tower-floor-screen__btn"
            disabled={!canChallenge}
            onClick={onChallenge}
          >
            ⚔️ Khiêu chiến
          </button>
        ) : (
          <span className="tower-floor-screen__locked">🔒 Vượt tầng trước để mở khóa</span>
        )}
      </div>
    </div>
  );
}
