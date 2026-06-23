import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  TowerBottomDock,
  TowerFloorRail,
  TowerSidePanel,
  TowerVisual,
} from '@/components/game/TowerPagoda';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { NPC_LEADERBOARD } from '@/data/leaderboard';
import {
  TOWER_CHAPTERS,
  TOWER_MAX_FLOOR,
  getTowerChapter,
  getTowerFloor,
} from '@/data/tower';
import type { AutoTowerResult } from '@/systems/towerAuto';
import { runTowerAutoClimbAsync } from '@/systems/towerClimb';
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

function buildTowerRankings(playerName: string, towerBestFloor: number) {
  const entries = NPC_LEADERBOARD.slice(0, 9).map((npc, i) => ({
    name: npc.name,
    score: Math.max(1, TOWER_MAX_FLOOR - i * 48 - 12),
  }));
  entries.push({ name: playerName, score: towerBestFloor });
  entries.sort((a, b) => b.score - a.score);
  const ranked = entries.map((e, i) => ({ ...e, rank: i + 1 }));
  const playerRank = ranked.find((e) => e.name === playerName)?.rank ?? ranked.length;
  const topPlayers = ranked.slice(0, 3).map((e) => ({
    rank: e.rank,
    name: e.name,
    score: e.score,
  }));
  return { playerRank, topPlayers };
}

export function TowerPage() {
  const player = useGameStore((s) => s.player)!;
  const towerBestFloor = useGameStore((s) => s.towerBestFloor);
  const canStartBattle = useGameStore((s) => s.canStartBattle);
  const resolveBattle = useGameStore((s) => s.resolveBattle);
  const { activeNav, navItems, handleNav, goWithFrom } = useGameNav();

  const [challengeFloor, setChallengeFloor] = useState<number | null>(null);
  const [visualAuto, setVisualAuto] = useState(false);
  const [fastAutoRunning, setFastAutoRunning] = useState(false);
  const [climbingFloor, setClimbingFloor] = useState<number | null>(null);
  const [autoResult, setAutoResult] = useState<AutoTowerResult | null>(null);
  const fastAutoStopRef = useRef(false);

  const power = calcCombatPower(player);
  const nextFloor = Math.min(towerBestFloor + 1, TOWER_MAX_FLOOR);
  const currentChapter = getTowerChapter(nextFloor);

  const [selectedChapterId, setSelectedChapterId] = useState(currentChapter.id);
  const [selectedFloor, setSelectedFloor] = useState<number>(nextFloor);

  const canAuto = towerBestFloor < TOWER_MAX_FLOOR;
  const autoBlockReason = canAuto
    ? null
    : getAutoBlockReason(towerBestFloor, nextFloor, canStartBattle);

  const { playerRank, topPlayers } = useMemo(
    () => buildTowerRankings(player.name, towerBestFloor),
    [player.name, towerBestFloor],
  );

  const trialPoints = towerBestFloor * 10 + currentChapter.id * 5;

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
  const visualChapter = getTowerChapter(selectedFloor);
  const winChance = calcWinChance(power, selectedData.enemyPower);
  const canChallenge = selectedFloor === nextFloor && towerBestFloor < TOWER_MAX_FLOOR && !fastAutoRunning;

  const handleAutoFast = useCallback(async () => {
    if (!canAuto || fastAutoRunning) return;

    setAutoResult(null);
    setVisualAuto(false);
    setChallengeFloor(null);
    setFastAutoRunning(true);
    fastAutoStopRef.current = false;

    const result = await runTowerAutoClimbAsync({
      getPlayer: () => useGameStore.getState().player,
      getTowerBestFloor: () => useGameStore.getState().towerBestFloor,
      canStartFloor: (floor) => useGameStore.getState().canStartBattle('tower', `tower_${floor}`, floor),
      resolveFloor: (floor, win) => {
        resolveBattle('tower', `tower_${floor}`, win, floor, { silent: true });
      },
      shouldStop: () => fastAutoStopRef.current,
      onFloor: (floor) => {
        const ch = getTowerChapter(floor);
        setSelectedChapterId(ch.id);
        setSelectedFloor(floor);
        setClimbingFloor(floor);
      },
      delayMs: FAST_AUTO_DELAY_MS,
    });

    const endState = useGameStore.getState();

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
    fastAutoStopRef.current = true;
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
      <GameScreen className="game-screen--tower">
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="tower-body">
          <PageTitle title="Tháp Thí Luyện" subtitle="Khiêu chiến tầng cao, nhận thưởng hậu hĩnh" />

          <div className="tower-quick-nav">
            <button type="button" className="tower-quick-nav__btn" onClick={() => goWithFrom('/leaderboard')}>
              <AncientIcon name="trophy" size={14} /> Xếp hạng
            </button>
            <button type="button" className="tower-quick-nav__btn" disabled>
              <AncientIcon name="gift" size={14} /> Sắp ra
            </button>
            <button type="button" className="tower-quick-nav__btn" disabled>
              <AncientIcon name="bag" size={14} /> Sắp ra
            </button>
          </div>

          {autoBlockReason && (
            <p className="tower-hint">{autoBlockReason}</p>
          )}

          {fastAutoRunning && climbingFloor !== null && (
            <div className="tower-fast-overlay">
              <div className="tower-fast-overlay__spinner" />
              <p className="tower-fast-overlay__text">Đang vượt tầng <strong>{climbingFloor}</strong>...</p>
              <button type="button" className="tower-fast-overlay__stop" onClick={handleStopAuto}>
                Dừng
              </button>
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
                  {autoResult.reason === 'stopped' && (
                    <p className="tower-result__warn">Đã dừng thủ công — đang ở tầng {autoResult.toFloor}</p>
                  )}
                </>
              ) : autoResult.reason === 'stopped' ? (
                <>
                  <p className="tower-result__title">Đã dừng vượt nhanh</p>
                  {autoResult.cleared > 0 && (
                    <p className="tower-result__meta">
                      Vượt {autoResult.cleared} tầng · Tầng {autoResult.fromFloor} → {autoResult.toFloor}
                    </p>
                  )}
                  <p className="tower-result__warn">Đang ở tầng {autoResult.toFloor}</p>
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

          <div className="tower-stage">
            <TowerFloorRail
              towerBestFloor={towerBestFloor}
              nextFloor={nextFloor}
              selectedFloor={selectedFloor}
              climbingFloor={climbingFloor}
              disabled={fastAutoRunning}
              onSelectFloor={(f) => setSelectedFloor(f)}
            />

            <TowerVisual
              currentFloor={nextFloor}
              recommendedPower={getTowerFloor(nextFloor).enemyPower}
              chapter={visualChapter}
            />

            <TowerSidePanel
              playerRank={playerRank}
              trialPoints={trialPoints}
              towerBestFloor={towerBestFloor}
              chapters={TOWER_CHAPTERS}
              selectedChapterId={selectedChapterId}
              disabled={fastAutoRunning}
              onChapterChange={handleChapterChange}
              topPlayers={topPlayers}
            />
          </div>

          <TowerBottomDock
            floor={selectedFloor}
            data={selectedData}
            cleared={selectedFloor <= towerBestFloor}
            isCurrent={selectedFloor === nextFloor}
            winChance={winChance}
            canChallenge={canChallenge}
            canAuto={canAuto && !fastAutoRunning}
            visualAutoRunning={visualAuto}
            fastAutoRunning={fastAutoRunning}
            onChallenge={() => {
              setVisualAuto(false);
              setChallengeFloor(selectedFloor);
            }}
            onAutoFast={handleAutoFast}
            onAutoVisual={handleAutoVisual}
            onStopAuto={handleStopAuto}
          />
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
