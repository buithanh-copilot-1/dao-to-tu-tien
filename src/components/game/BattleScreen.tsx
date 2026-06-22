import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameButton, ProgressBar, AncientIcon } from '@/components';
import { SpiritPortrait } from '@/components/game/SpiritPortrait';
import { useGameStore } from '@/stores/gameStore';
import { buildBattleTarget } from '@/systems/battleConfig';
import { calcCombatPower } from '@/utils/stats';
import { calcWinChance, simulateFullBattle } from '@/systems/combat';
import { formatNumber } from '@/utils/format';
import type { BattleLogEntry, BattleMode, FullBattleResult } from '@/types/battle';

type Phase = 'ready' | 'fighting' | 'wave-transition' | 'result';

interface DisplayLog {
  id: number;
  text: string;
  side: BattleLogEntry['side'];
  damage?: number;
}

interface DamagePopup {
  id: number;
  value: number;
  side: 'player' | 'enemy';
}

interface BattleScreenProps {
  mode: BattleMode;
  targetId: string;
  towerFloor?: number;
  onClose: () => void;
  autoStart?: boolean;
  fastPlayback?: boolean;
  onComplete?: (win: boolean) => void;
}

let logIdSeq = 0;

export function BattleScreen({
  mode,
  targetId,
  towerFloor,
  onClose,
  autoStart = false,
  fastPlayback = false,
  onComplete,
}: BattleScreenProps) {
  const player = useGameStore((s) => s.player)!;
  const canStartBattle = useGameStore((s) => s.canStartBattle);
  const resolveBattle = useGameStore((s) => s.resolveBattle);

  const target = useMemo(
    () => buildBattleTarget(mode, targetId, player, towerFloor),
    [mode, targetId, towerFloor, player.gender],
  );

  const [phase, setPhase] = useState<Phase>('ready');
  const [waveIndex, setWaveIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [logs, setLogs] = useState<DisplayLog[]>([]);
  const [result, setResult] = useState<FullBattleResult | null>(null);
  const [playerHp, setPlayerHp] = useState(0);
  const [playerHpMax, setPlayerHpMax] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);
  const [enemyHpMax, setEnemyHpMax] = useState(0);
  const [animSide, setAnimSide] = useState<'player' | 'enemy' | null>(null);
  const [flash, setFlash] = useState(false);
  const [popups, setPopups] = useState<DamagePopup[]>([]);
  const [waveBanner, setWaveBanner] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const battleResultRef = useRef<FullBattleResult | null>(null);
  const playerHpRef = useRef(0);
  const resolveBattleRef = useRef(resolveBattle);
  const waveAnnouncedRef = useRef(-1);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  resolveBattleRef.current = resolveBattle;

  const playerPower = calcCombatPower(player);
  const playbackMs = fastPlayback ? 160 : 480;
  const currentWave = target?.waves[waveIndex];
  const enemyPower = currentWave?.power ?? target?.waves[0]?.power ?? 0;

  const appendLog = useCallback((text: string, side: BattleLogEntry['side'], damage?: number) => {
    setLogs((prev) => [...prev, { id: ++logIdSeq, text, side, damage }]);
  }, []);

  const showDamage = useCallback((value: number, side: 'player' | 'enemy') => {
    if (value <= 0) return;
    const id = ++logIdSeq;
    setPopups((prev) => [...prev, { id, value, side }]);
    setFlash(true);
    setTimeout(() => setFlash(false), 120);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 700);
  }, []);

  const startBattle = useCallback(() => {
    if (!target) return;
    const err = canStartBattle(mode, targetId, towerFloor);
    if (err) return;

    const full = simulateFullBattle(
      playerPower,
      player.name,
      target.waves.map((w) => ({ wave: w.wave, name: w.name, power: w.power, hp: w.hp })),
    );
    battleResultRef.current = full;
    waveAnnouncedRef.current = -1;
    const hpMax = Math.floor(playerPower * 5);
    playerHpRef.current = hpMax;
    setPlayerHpMax(hpMax);
    setPlayerHp(hpMax);
    setEnemyHpMax(target.waves[0].hp);
    setEnemyHp(target.waves[0].hp);
    setPhase('fighting');
    setWaveIndex(0);
    setRound(0);
    setLogs([]);
    setResult(null);
    setWaveBanner('');
    appendLog('⚔️ Bắt đầu giao đấu!', 'system');
  }, [target, canStartBattle, mode, targetId, towerFloor, playerPower, player.name, appendLog]);

  useEffect(() => {
    if (!autoStart || !target) return;
    const err = canStartBattle(mode, targetId, towerFloor);
    if (err) return;
    const t = setTimeout(() => startBattle(), 80);
    return () => clearTimeout(t);
  }, [autoStart, target, canStartBattle, mode, targetId, towerFloor, startBattle]);

  useEffect(() => {
    if (phase !== 'result' || !result || !autoStart) return;
    const t = setTimeout(() => {
      onCompleteRef.current?.(result.win);
      if (!onCompleteRef.current) onClose();
    }, fastPlayback ? 500 : 1200);
    return () => clearTimeout(t);
  }, [phase, result, autoStart, fastPlayback, onClose]);

  useEffect(() => {
    if (phase !== 'fighting' || !target || !battleResultRef.current) return;

    const full = battleResultRef.current;
    const waveResult = full.waves[waveIndex];
    if (!waveResult) return;

    const wave = target.waves[waveIndex];
    const eMax = wave.hp;
    setEnemyHpMax(eMax);
    setEnemyHp(eMax);

    if (target.waves.length > 1 && waveAnnouncedRef.current !== waveIndex) {
      waveAnnouncedRef.current = waveIndex;
      appendLog(`━━ Đợt ${waveIndex + 1}/${target.waves.length}: ${wave.name} ━━`, 'system');
    }

    let lineIdx = 0;
    let cancelled = false;

    const interval = setInterval(() => {
      if (cancelled) return;

      if (lineIdx >= waveResult.log.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (cancelled) return;
          if (!waveResult.win) {
            setResult(full);
            setPhase('result');
            resolveBattleRef.current(mode, targetId, false, towerFloor);
            return;
          }
          if (waveIndex + 1 < full.waves.length) {
            playerHpRef.current = waveResult.playerHpLeft;
            setPlayerHp(waveResult.playerHpLeft);
            setWaveBanner(`Đợt ${waveIndex + 2} sắp bắt đầu...`);
            setPhase('wave-transition');
            setTimeout(() => {
              if (cancelled) return;
              setWaveBanner('');
              setWaveIndex((i) => i + 1);
              setPhase('fighting');
            }, 1200);
          } else {
            setResult(full);
            setPhase('result');
            resolveBattleRef.current(mode, targetId, true, towerFloor);
          }
        }, 500);
        return;
      }

      const entry = waveResult.log[lineIdx];
      if (entry.round > 0) setRound(entry.round);

      appendLog(entry.text, entry.side, entry.damage);

      if (entry.side === 'player' || entry.side === 'enemy') {
        setAnimSide(entry.side === 'player' ? 'player' : 'enemy');
        setTimeout(() => setAnimSide(null), 350);
      }

      if (entry.side === 'player' && entry.damage) {
        setEnemyHp((hp) => Math.max(0, hp - entry.damage!));
        showDamage(entry.damage, 'enemy');
      }
      if (entry.side === 'enemy' && entry.damage) {
        setPlayerHp((hp) => {
          const next = Math.max(0, hp - entry.damage!);
          playerHpRef.current = next;
          return next;
        });
        showDamage(entry.damage, 'player');
      }

      lineIdx += 1;
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
    }, playbackMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [phase, waveIndex, target, mode, targetId, towerFloor, appendLog, showDamage, playbackMs]);

  if (!target) {
    return (
      <div className="battle-screen">
        <div className="battle-screen__result">
          <p>Không tìm thấy mục tiêu</p>
          <GameButton variant="primary" onClick={onClose}>Đóng</GameButton>
        </div>
      </div>
    );
  }

  const startError = canStartBattle(mode, targetId, towerFloor);
  const winChance = calcWinChance(playerPower, enemyPower);
  const isActive = phase === 'fighting' || phase === 'wave-transition';
  const wave = currentWave ?? target.waves[0];
  const defaultPlayerHp = Math.floor(playerPower * 5);
  const showPlayerHp = phase === 'ready' ? defaultPlayerHp : playerHp;
  const showPlayerHpMax = phase === 'ready' ? defaultPlayerHp : playerHpMax;
  const showEnemyHp = phase === 'ready' ? wave.hp : enemyHp;
  const showEnemyHpMax = phase === 'ready' ? wave.hp : enemyHpMax;

  return (
    <div className={`battle-screen ${isActive ? 'battle-screen--active' : ''}`}>
      {flash && <div className="battle-screen__flash" />}

      <div className="battle-screen__header">
        <div className="battle-screen__title">{target.title}</div>
        {target.subtitle && <div className="battle-screen__subtitle">{target.subtitle}</div>}

        {phase === 'ready' && (
          <div className="battle-screen__stat-row">
            <span>Tỷ lệ thắng: <strong className="battle-screen__stat--chance">{winChance}%</strong></span>
            {target.waves.length > 1 && <span>{target.waves.length} đợt</span>}
          </div>
        )}

        {isActive && (
          <div className="battle-screen__status-bar">
            <span className="battle-screen__status-pulse meta-stat"><AncientIcon name="sword" size={13} /> ĐANG GIAO ĐẤU</span>
            <span className="battle-screen__status-round">Hiệp {round || 1}</span>
            {target.waves.length > 1 && (
              <span className="battle-screen__status-wave">Đợt {waveIndex + 1}/{target.waves.length}</span>
            )}
          </div>
        )}
      </div>

      <div className="battle-screen__arena">
        {phase !== 'result' && (
          <>
            {waveBanner && (
              <div className="battle-screen__wave-banner">{waveBanner}</div>
            )}

            <div className="battle-screen__arena-bg" />

            <div className="battle-screen__fighters">
              <div className={`battle-screen__fighter ${animSide === 'enemy' ? 'battle-screen__fighter--hit' : ''}`}>
                <div className="battle-screen__avatar-wrap">
                  <div className={`battle-screen__spirit ${animSide === 'player' ? 'battle-screen__avatar--attack' : animSide === 'enemy' ? 'battle-screen__avatar--hit' : ''}`}>
                    <SpiritPortrait gender={player.gender} element={player.element} size="md" paused={false} />
                  </div>
                  {popups.filter((p) => p.side === 'player').map((p) => (
                    <span key={p.id} className="battle-screen__damage battle-screen__damage--player">
                      -{formatNumber(p.value)}
                    </span>
                  ))}
                </div>
                <span className="battle-screen__name">{player.name}</span>
                <span className="battle-screen__power meta-stat"><AncientIcon name="flame" size={11} className="anc-icon--power" /> {formatNumber(playerPower)}</span>
                <div className="battle-screen__hp-bar">
                  <ProgressBar
                    current={showPlayerHp}
                    max={showPlayerHpMax || 1}
                    labelLeft="HP"
                    labelRight={`${formatNumber(showPlayerHp)} / ${formatNumber(showPlayerHpMax)}`}
                    thin
                  />
                </div>
              </div>

              <div className={`battle-screen__vs ${isActive ? 'battle-screen__vs--pulse' : ''}`}>VS</div>

              <div className={`battle-screen__fighter battle-screen__fighter--enemy ${animSide === 'player' ? 'battle-screen__fighter--hit' : ''}`}>
                <div className="battle-screen__avatar-wrap">
                  <span className={`battle-screen__avatar ${animSide === 'enemy' ? 'battle-screen__avatar--attack-enemy' : animSide === 'player' ? 'battle-screen__avatar--hit' : ''}`}>
                    {wave.icon}
                  </span>
                  {popups.filter((p) => p.side === 'enemy').map((p) => (
                    <span key={p.id} className="battle-screen__damage battle-screen__damage--enemy">
                      -{formatNumber(p.value)}
                    </span>
                  ))}
                </div>
                <span className="battle-screen__name">{wave.name}</span>
                <span className="battle-screen__power meta-stat"><AncientIcon name="flame" size={11} className="anc-icon--power" /> {formatNumber(enemyPower)}</span>
                <div className="battle-screen__hp-bar">
                  <ProgressBar
                    current={showEnemyHp}
                    max={showEnemyHpMax || wave.hp}
                    labelLeft="HP"
                    labelRight={`${formatNumber(showEnemyHp)} / ${formatNumber(showEnemyHpMax)}`}
                    thin
                  />
                </div>
              </div>
            </div>

            {target.waves.length > 1 && (
              <div className="battle-screen__wave-dots">
                {target.waves.map((w, i) => (
                  <span
                    key={w.wave}
                    className={`battle-screen__wave-dot ${i < waveIndex ? 'battle-screen__wave-dot--done' : ''} ${i === waveIndex && isActive ? 'battle-screen__wave-dot--current' : ''}`}
                  />
                ))}
              </div>
            )}

            <div className="battle-screen__log" ref={logRef}>
              {phase === 'ready' && logs.length === 0 && (
                <div className="battle-screen__log-line battle-screen__log-line--system">
                  Chuẩn bị chiến đấu với <strong>{wave.name}</strong>
                </div>
              )}
              {logs.map((line, i) => (
                <div
                  key={line.id}
                  className={`battle-screen__log-line battle-screen__log-line--${line.side} ${i === logs.length - 1 ? 'battle-screen__log-line--latest' : ''}`}
                >
                  <span>{line.text}</span>
                  {line.damage != null && line.damage > 0 && (
                    <span className="battle-screen__log-damage">💥 -{formatNumber(line.damage)}</span>
                  )}
                </div>
              ))}
              {isActive && logs.length > 0 && phase === 'fighting' && (
                <div className="battle-screen__log-typing">▌</div>
              )}
            </div>
          </>
        )}

        {phase === 'result' && result && (
          <div className="battle-screen__result">
            <div className={`battle-screen__result-icon ${result.win ? 'battle-screen__result-icon--win' : 'battle-screen__result-icon--lose'}`}>
              {result.win ? '🏆' : '💀'}
            </div>
            <div className={`battle-screen__result-title ${result.win ? 'battle-screen__result-title--win' : 'battle-screen__result-title--lose'}`}>
              {result.win ? 'Chiến thắng!' : 'Thất bại!'}
            </div>
            <div className="battle-screen__result-meta">
              Tổng {result.totalRounds} hiệp · {result.waves.length} đợt
            </div>
            {result.win && (
              <div className="battle-screen__rewards">
                {target.rewards.gold ? <span className="meta-stat"><AncientIcon name="coin" size={13} className="anc-icon--gold" /> +{formatNumber(target.rewards.gold)}</span> : null}
                {target.rewards.crystal ? <span className="meta-stat"><AncientIcon name="gem" size={13} className="anc-icon--crystal" /> +{formatNumber(target.rewards.crystal)}</span> : null}
                {target.rewards.jade ? <span className="meta-stat"><AncientIcon name="jade" size={13} className="anc-icon--jade" /> +{target.rewards.jade}</span> : null}
                {target.rewards.itemId ? <span className="meta-stat"><AncientIcon name="bag" size={13} className="anc-icon--gold" /> Vật phẩm</span> : null}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="battle-screen__footer">
        {phase === 'ready' && (
          <>
            {startError && <div className="battle-screen__error">{startError}</div>}
            <GameButton variant="primary" onClick={startBattle} disabled={!!startError} style={{ minWidth: 160 }}>
              Bắt đầu chiến đấu
            </GameButton>
            <GameButton variant="secondary" onClick={onClose}>Quay lại</GameButton>
          </>
        )}
        {isActive && (
          <div className="battle-screen__fighting-footer">
            <div className="battle-screen__fighting-dots">
              <span /><span /><span />
            </div>
            <span>Đang diễn ra trận chiến...</span>
          </div>
        )}
        {phase === 'result' && (
          <>
            {autoStart && (
              <div className="battle-screen__fighting-footer">
                <span>{result?.win ? 'Tự động lên tầng tiếp...' : 'Dừng tự động...'}</span>
              </div>
            )}
            {!autoStart && (
              <GameButton variant="primary" onClick={onClose} style={{ minWidth: 160 }}>
                Xác nhận
              </GameButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
