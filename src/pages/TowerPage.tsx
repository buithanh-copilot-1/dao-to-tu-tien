import { useEffect, useMemo, useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageTitle,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { BattleScreen } from '@/components/game/BattleScreen';
import { TowerFloorScreen, TowerPagoda } from '@/components/game/TowerPagoda';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import {
  TOWER_CHAPTERS,
  TOWER_DAILY_LIMIT,
  TOWER_MAX_FLOOR,
  getChapterFloors,
  getTowerChapter,
  getTowerFloor,
} from '@/data/tower';
import { calcCombatPower } from '@/utils/stats';
import { calcWinChance } from '@/systems/combat';
import { formatNumber } from '@/utils/format';

export function TowerPage() {
  const player = useGameStore((s) => s.player)!;
  const towerBestFloor = useGameStore((s) => s.towerBestFloor);
  const dailyCounters = useGameStore((s) => s.dailyCounters);
  const { activeNav, navItems, handleNav } = useGameNav();
  const [challengeFloor, setChallengeFloor] = useState<number | null>(null);

  const power = calcCombatPower(player);
  const nextFloor = Math.min(towerBestFloor + 1, TOWER_MAX_FLOOR);
  const remaining = TOWER_DAILY_LIMIT - dailyCounters.tower;
  const currentChapter = getTowerChapter(nextFloor);

  const [selectedChapterId, setSelectedChapterId] = useState(currentChapter.id);
  const [selectedFloor, setSelectedFloor] = useState<number>(nextFloor);

  const chapterFloors = useMemo(
    () => getChapterFloors(selectedChapterId),
    [selectedChapterId],
  );

  const chapter = TOWER_CHAPTERS.find((c) => c.id === selectedChapterId)!;

  useEffect(() => {
    const ch = getTowerChapter(nextFloor);
    if (ch.id === selectedChapterId) {
      setSelectedFloor(nextFloor);
    }
  }, [nextFloor, selectedChapterId]);

  const handleChapterChange = (id: number) => {
    setSelectedChapterId(id);
    const ch = TOWER_CHAPTERS.find((c) => c.id === id)!;
    const defaultFloor = id === currentChapter.id
      ? nextFloor
      : towerBestFloor >= ch.endFloor
        ? ch.endFloor
        : towerBestFloor >= ch.startFloor
          ? towerBestFloor + 1
          : ch.startFloor;
    setSelectedFloor(Math.min(defaultFloor, ch.endFloor));
  };

  const selectedData = getTowerFloor(selectedFloor);
  const winChance = calcWinChance(power, selectedData.enemyPower);
  const canChallenge = selectedFloor === nextFloor && remaining > 0;

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="tower-body tower-body--pagoda">
          <PageTitle title="Tháp Thí Luyện" subtitle="VƯỢT TỪNG TẦNG · ĐẠT ĐẠO VÔ CỰC" />

          <div className="tower-hud">
            <div className="tower-hud__item">
              <span>Đỉnh</span>
              <strong>{towerBestFloor}/{TOWER_MAX_FLOOR}</strong>
            </div>
            <div className="tower-hud__item tower-hud__item--highlight">
              <span>Tiếp</span>
              <strong>T.{nextFloor}</strong>
            </div>
            <div className="tower-hud__item">
              <span>Lượt</span>
              <strong>{remaining}/{TOWER_DAILY_LIMIT}</strong>
            </div>
            <div className="tower-hud__item">
              <span>Lực chiến</span>
              <strong className="tower-hud__power">{formatNumber(power)}</strong>
            </div>
          </div>

          <div className="tower-chapter-strip">
            {TOWER_CHAPTERS.map((ch) => {
              const active = ch.id === selectedChapterId;
              const inProgress = towerBestFloor >= ch.startFloor - 1 && towerBestFloor < ch.endFloor;
              return (
                <button
                  key={ch.id}
                  type="button"
                  title={ch.name}
                  className={`tower-chapter-pip ${active ? 'tower-chapter-pip--active' : ''} ${inProgress ? 'tower-chapter-pip--progress' : ''} ${towerBestFloor >= ch.endFloor ? 'tower-chapter-pip--done' : ''}`}
                  onClick={() => handleChapterChange(ch.id)}
                >
                  <span>{ch.icon}</span>
                  <small>{ch.id}</small>
                </button>
              );
            })}
          </div>

          <p className="tower-chapter-label">
            {chapter.icon} {chapter.name}
            <span> · Tầng {chapter.startFloor}–{chapter.endFloor}</span>
          </p>

          <div className="tower-scene">
            <TowerPagoda
              floors={chapterFloors}
              towerBestFloor={towerBestFloor}
              nextFloor={nextFloor}
              selectedFloor={selectedFloor}
              onSelectFloor={setSelectedFloor}
              getFloorData={getTowerFloor}
            />

            <TowerFloorScreen
              floor={selectedFloor}
              data={selectedData}
              cleared={selectedFloor <= towerBestFloor}
              isCurrent={selectedFloor === nextFloor}
              winChance={winChance}
              canChallenge={canChallenge}
              onChallenge={() => setChallengeFloor(selectedFloor)}
            />
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>

        {challengeFloor !== null && (
          <BattleScreen
            mode="tower"
            targetId={`tower_${challengeFloor}`}
            towerFloor={challengeFloor}
            onClose={() => setChallengeFloor(null)}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
