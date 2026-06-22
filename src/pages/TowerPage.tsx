import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageTitle,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { BattleScreen } from '@/components/game/BattleScreen';
import { TowerFloorScreen, TowerPagoda } from '@/components/game/TowerPagoda';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import {
  TOWER_CHAPTERS,
  TOWER_MAX_FLOOR,
  getChapterFloors,
  getTowerChapter,
  getTowerFloor,
} from '@/data/tower';
import { simulateTowerFloor, type AutoTowerResult } from '@/systems/towerAuto';
import { calcCombatPower } from '@/utils/stats';
import { calcWinChance } from '@/systems/combat';
import { formatNumber } from '@/utils/format';

const FAST_AUTO_DELAY_MS = 200;

function getAutoBlockReason(
  towerBestFloor: number,
  nextFloor: number,
  canStartBattle: (mode: 'tower', id: string, floor?: number) => string | null,
): string | null {
  if (towerBestFloor >= TOWER_MAX_FLOOR) return 'Đã chinh phục đỉnh tháp (tầng 500)';
  return canStartBattle('tower', `tower_${nextFloor}`, nextFloor);
}

export function TowerPage() {
  const player = useGameStore((s) => s.player)!;
  const towerBestFloor = useGameStore((s) => s.towerBestFloor);
  const canStartBattle = useGameStore((s) => s.canStartBattle);
  const resolveBattle = useGameStore((s) => s.resolveBattle);
  const { activeNav, navItems, handleNav } = useGameNav();

  const [challengeFloor, setChallengeFloor] = useState<number | null>(null);
  const [visualAuto, setVisualAuto] = useState(false);
  const [fastAutoRunning, setFastAutoRunning] = useState(false);
  const [climbingFloor, setClimbingFloor] = useState<number | null>(null);
  const [autoResult, setAutoResult] = useState<AutoTowerResult | null>(null);

  const power = calcCombatPower(player);
  const nextFloor = Math.min(towerBestFloor + 1, TOWER_MAX_FLOOR);
  const currentChapter = getTowerChapter(nextFloor);

  const [selectedChapterId, setSelectedChapterId] = useState(currentChapter.id);
  const [selectedFloor, setSelectedFloor] = useState<number>(nextFloor);

  const chapterFloors = useMemo(
    () => getChapterFloors(selectedChapterId),
    [selectedChapterId],
  );

  const chapter = TOWER_CHAPTERS.find((c) => c.id === selectedChapterId)!;

  const canAuto = towerBestFloor < TOWER_MAX_FLOOR;
  const autoBlockReason = canAuto
    ? null
    : getAutoBlockReason(towerBestFloor, nextFloor, canStartBattle);

  useEffect(() => {
    const ch = getTowerChapter(nextFloor);
    if (ch.id === selectedChapterId && !fastAutoRunning) {
      setSelectedFloor(nextFloor);
    }
  }, [nextFloor, selectedChapterId, fastAutoRunning]);

  const handleChapterChange = (id: number) => {
    if (fastAutoRunning) return;
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
  const canChallenge = selectedFloor === nextFloor && towerBestFloor < TOWER_MAX_FLOOR && !fastAutoRunning;

  const handleAutoFast = useCallback(async () => {
    if (!canAuto || fastAutoRunning) return;

    setAutoResult(null);
    setVisualAuto(false);
    setChallengeFloor(null);
    setFastAutoRunning(true);

    const startFloor = useGameStore.getState().towerBestFloor + 1;
    const startGold = useGameStore.getState().player!.gold;
    const startCrystal = useGameStore.getState().player!.crystal;
    const startJade = useGameStore.getState().player!.jade;

    let cleared = 0;
    let reason: AutoTowerResult['reason'] = 'blocked';

    const wait = () => new Promise<void>((r) => setTimeout(r, FAST_AUTO_DELAY_MS));

    while (true) {
      const state = useGameStore.getState();
      const { player: p, towerBestFloor: best } = state;
      if (!p) {
        reason = 'blocked';
        break;
      }
      if (best >= TOWER_MAX_FLOOR) {
        reason = 'max_floor';
        break;
      }

      const floor = best + 1;
      const err = state.canStartBattle('tower', `tower_${floor}`, floor);
      if (err) {
        reason = 'blocked';
        break;
      }

      const ch = getTowerChapter(floor);
      setSelectedChapterId(ch.id);
      setSelectedFloor(floor);
      setClimbingFloor(floor);
      await wait();

      const battle = simulateTowerFloor(p, floor);
      resolveBattle('tower', `tower_${floor}`, battle.win, floor, { silent: true });

      if (!battle.win) {
        reason = 'defeat';
        break;
      }
      cleared += 1;
    }

    const endState = useGameStore.getState();
    const result: AutoTowerResult = {
      cleared,
      fromFloor: startFloor,
      toFloor: endState.towerBestFloor,
      reason,
      goldGained: (endState.player?.gold ?? 0) - startGold,
      crystalGained: (endState.player?.crystal ?? 0) - startCrystal,
      jadeGained: (endState.player?.jade ?? 0) - startJade,
    };

    setClimbingFloor(null);
    setFastAutoRunning(false);
    setAutoResult(result);
    setSelectedChapterId(getTowerChapter(endState.towerBestFloor + 1 <= TOWER_MAX_FLOOR ? endState.towerBestFloor + 1 : endState.towerBestFloor).id);
    setSelectedFloor(Math.min(endState.towerBestFloor + 1, TOWER_MAX_FLOOR));
  }, [canAuto, fastAutoRunning, resolveBattle]);

  const handleAutoVisual = () => {
    if (!canAuto) return;
    setAutoResult(null);
    setVisualAuto(true);
    setChallengeFloor(nextFloor);
  };

  const handleStopAuto = () => {
    setVisualAuto(false);
    setChallengeFloor(null);
  };

  const handleBattleComplete = useCallback((win: boolean) => {
    if (!visualAuto || !win) {
      setVisualAuto(false);
      setChallengeFloor(null);
      return;
    }

    const state = useGameStore.getState();
    const nf = Math.min(state.towerBestFloor + 1, TOWER_MAX_FLOOR);
    const err = state.canStartBattle('tower', `tower_${nf}`, nf);

    if (state.towerBestFloor < TOWER_MAX_FLOOR && !err) {
      setChallengeFloor(nf);
    } else {
      setVisualAuto(false);
      setChallengeFloor(null);
    }
  }, [visualAuto]);

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
              <span>Chương</span>
              <strong>{currentChapter.icon} {currentChapter.id}/10</strong>
            </div>
            <div className="tower-hud__item">
              <span>Lực chiến</span>
              <strong className="tower-hud__power">{formatNumber(power)}</strong>
            </div>
          </div>

          <div className="tower-actions">
            <button
              type="button"
              className="tower-actions__btn tower-actions__btn--fast"
              disabled={!canAuto || fastAutoRunning || visualAuto}
              onClick={handleAutoFast}
            >
              <AncientIcon name={fastAutoRunning ? 'hourglass' : 'cycle'} size={14} />
              {fastAutoRunning ? 'Đang vượt...' : 'Vượt nhanh'}
            </button>
            <button
              type="button"
              className="tower-actions__btn tower-actions__btn--visual"
              disabled={!canAuto || fastAutoRunning || visualAuto}
              onClick={handleAutoVisual}
            >
              <AncientIcon name="play" size={13} /> Tự động xem
            </button>
            <button
              type="button"
              className="tower-actions__btn tower-actions__btn--manual"
              disabled={!canChallenge}
              onClick={() => {
                setVisualAuto(false);
                setChallengeFloor(nextFloor);
              }}
            >
              <AncientIcon name="sword" size={14} /> Tầng {nextFloor}
            </button>
          </div>

          {autoBlockReason && (
            <p className="tower-actions__hint">{autoBlockReason}</p>
          )}

          {fastAutoRunning && climbingFloor !== null && (
            <div className="tower-fast-overlay">
              <div className="tower-fast-overlay__spinner" />
              <p className="tower-fast-overlay__text">Đang vượt tầng <strong>{climbingFloor}</strong>...</p>
            </div>
          )}

          {autoResult && !fastAutoRunning && (
            <div className={`tower-result ${autoResult.cleared > 0 ? 'tower-result--win' : 'tower-result--empty'}`}>
              <button type="button" className="tower-result__close" onClick={() => setAutoResult(null)}>
                <AncientIcon name="close" size={13} />
              </button>
              {autoResult.cleared > 0 ? (
                <>
                  <p className="tower-result__title meta-stat" style={{ justifyContent: 'center' }}>
                    <AncientIcon name="sparkle" size={16} className="anc-icon--gold" /> Vượt {autoResult.cleared} tầng!
                  </p>
                  <p className="tower-result__meta">
                    Tầng {autoResult.fromFloor} → {autoResult.toFloor}
                  </p>
                  <div className="tower-result__rewards">
                    <span className="meta-stat"><AncientIcon name="coin" size={12} className="anc-icon--gold" /> +{formatNumber(autoResult.goldGained)}</span>
                    <span className="meta-stat"><AncientIcon name="gem" size={12} className="anc-icon--crystal" /> +{formatNumber(autoResult.crystalGained)}</span>
                    {autoResult.jadeGained > 0 && <span className="meta-stat"><AncientIcon name="jade" size={12} className="anc-icon--jade" /> +{autoResult.jadeGained}</span>}
                  </div>
                  {autoResult.reason === 'defeat' && (
                    <p className="tower-result__warn">Dừng tại tầng {autoResult.toFloor + 1} — thua trận</p>
                  )}
                </>
              ) : (
                <p className="tower-result__title">{autoBlockReason ?? 'Không vượt được tầng nào'}</p>
              )}
            </div>
          )}

          {visualAuto && (
            <div className="tower-auto-banner">
              <span className="tower-auto-banner__pulse meta-stat">
                <AncientIcon name="play" size={12} /> Đang tự động xem chiến đấu...
              </span>
              <button type="button" className="tower-auto-banner__stop" onClick={handleStopAuto}>
                Dừng
              </button>
            </div>
          )}

          <div className="tower-chapter-strip">
            {TOWER_CHAPTERS.map((ch) => {
              const active = ch.id === selectedChapterId;
              const inProgress = towerBestFloor >= ch.startFloor - 1 && towerBestFloor < ch.endFloor;
              return (
                <button
                  key={ch.id}
                  type="button"
                  title={ch.name}
                  disabled={fastAutoRunning}
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
              climbingFloor={climbingFloor}
              onSelectFloor={(f) => !fastAutoRunning && setSelectedFloor(f)}
              getFloorData={getTowerFloor}
            />

            <TowerFloorScreen
              floor={selectedFloor}
              data={selectedData}
              cleared={selectedFloor <= towerBestFloor}
              isCurrent={selectedFloor === nextFloor}
              winChance={winChance}
              canChallenge={canChallenge}
              canAuto={canAuto && !fastAutoRunning}
              visualAutoRunning={visualAuto}
              onChallenge={() => {
                setVisualAuto(false);
                setChallengeFloor(selectedFloor);
              }}
              onAutoFast={handleAutoFast}
              onAutoVisual={handleAutoVisual}
              onStopAuto={handleStopAuto}
            />
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>

        {challengeFloor !== null && (
          <BattleScreen
            key={challengeFloor}
            mode="tower"
            targetId={`tower_${challengeFloor}`}
            towerFloor={challengeFloor}
            autoStart={visualAuto}
            fastPlayback={visualAuto}
            onComplete={visualAuto ? handleBattleComplete : undefined}
            onClose={() => {
              setVisualAuto(false);
              setChallengeFloor(null);
            }}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
