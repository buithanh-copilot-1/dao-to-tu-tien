import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameButton, AncientIcon, ItemIcon } from '@/components';
import { useUiStore } from '@/stores/uiStore';
import { SpiritPortrait } from '@/components/game/SpiritPortrait';
import { BattleHpBar } from '@/components/game/BattleHpBar';
import { BattleArenaFx } from '@/components/game/BattleArenaFx';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import { useGameStore } from '@/stores/gameStore';
import { buildBattleTarget } from '@/systems/battleConfig';
import { rollBattleLootForTarget } from '@/systems/drops';
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
  const lastBattleLoot = useGameStore((s) => s.lastBattleLoot);
  const battleSpeed = useGameStore((s) => s.settings.battleSpeed);

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
  const [shake, setShake] = useState(false);
  const openItemCatalog = useUiStore((s) => s.openItemCatalog);
  const logRef = useRef<HTMLDivElement>(null);
  const battleResultRef = useRef<FullBattleResult | null>(null);
  const pendingLootRef = useRef<ReturnType<typeof rollBattleLootForTarget> | null>(null);
  const playerHpRef = useRef(0);
  const battleResolvedRef = useRef(false);
  const resolveBattleRef = useRef(resolveBattle);
  const waveAnnouncedRef = useRef(-1);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  resolveBattleRef.current = resolveBattle;

  const playerPower = calcCombatPower(player);
  const playbackMs = fastPlayback ? 220 : battleSpeed === 'fast' ? 320 : battleSpeed === 'slow' ? 760 : 520;
  const currentWave = target?.waves[waveIndex];
  const enemyPower = currentWave?.power ?? target?.waves[0]?.power ?? 0;
  const battleLootItems = lastBattleLoot?.items ?? [];

  const appendLog = useCallback((text: string, side: BattleLogEntry['side'], damage?: number) => {
    setLogs((prev) => [...prev, { id: ++logIdSeq, text, side, damage }]);
  }, []);

  const resolveBattleOnce = useCallback((win: boolean) => {
    if (battleResolvedRef.current) return;
    battleResolvedRef.current = true;
    if (win) {
      resolveBattleRef.current(mode, targetId, true, towerFloor, {
        loot: pendingLootRef.current ?? undefined,
      });
    } else {
      resolveBattleRef.current(mode, targetId, false, towerFloor);
    }
  }, [mode, targetId, towerFloor]);

  const finishToResult = useCallback((full: FullBattleResult) => {
    setWaveBanner('');
    setResult(full);
    setPhase('result');
    resolveBattleOnce(full.win);
  }, [resolveBattleOnce]);

  const skipBattle = useCallback(() => {
    const full = battleResultRef.current;
    if (!full || phase === 'result') return;
    finishToResult(full);
  }, [finishToResult, phase]);

  const skipAutoResult = useCallback(() => {
    if (!result) return;
    onCompleteRef.current?.(result.win);
    if (!onCompleteRef.current) onClose();
  }, [result, onClose]);

  const showDamage = useCallback((value: number, side: 'player' | 'enemy') => {
    if (value <= 0) return;
    const id = ++logIdSeq;
    setPopups((prev) => [...prev, { id, value, side }]);
    setFlash(true);
    setShake(true);
    setTimeout(() => setFlash(false), 120);
    setTimeout(() => setShake(false), 320);
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
    pendingLootRef.current = rollBattleLootForTarget(mode, targetId, towerFloor);
    battleResolvedRef.current = false;
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
    appendLog('Bắt đầu giao đấu!', 'system');
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
            finishToResult(full);
            return;
          }
          const loot = pendingLootRef.current;
          if (loot?.summary) {
            appendLog(`Quái vật rơi: ${loot.summary}`, 'system');
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
            finishToResult(full);
          }
        }, 500);
        return;
      }

      const entry = waveResult.log[lineIdx];
      if (entry.round > 0) setRound(entry.round);

      appendLog(entry.text, entry.side, entry.damage);

      if (entry.side === 'player' || entry.side === 'enemy') {
        setAnimSide(entry.side === 'player' ? 'player' : 'enemy');
        setTimeout(() => setAnimSide(null), 580);
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
  }, [phase, waveIndex, target, appendLog, showDamage, playbackMs, finishToResult]);

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

  const rewardDrops = battleLootItems;

  const startError = canStartBattle(mode, targetId, towerFloor);
  const winChance = calcWinChance(playerPower, enemyPower);
  const isActive = phase === 'fighting' || phase === 'wave-transition';
  const isFighting = phase === 'fighting';
  const isClashing = isFighting && animSide !== null;
  const wave = currentWave ?? target.waves[0];
  const defaultPlayerHp = Math.floor(playerPower * 5);
  const showPlayerHp = phase === 'ready' ? defaultPlayerHp : playerHp;
  const showPlayerHpMax = phase === 'ready' ? defaultPlayerHp : playerHpMax;
  const showEnemyHp = phase === 'ready' ? wave.hp : enemyHp;
  const showEnemyHpMax = phase === 'ready' ? wave.hp : enemyHpMax;
  const visibleLogs = logs.slice(-8);

  return (
    <div className={`battle-screen ${isActive ? 'battle-screen--active' : ''} ${isFighting ? 'battle-screen--fighting' : ''}`}>
      {flash && <div className="battle-screen__flash" />}
      {isFighting && <div className="battle-screen__combat-overlay" aria-hidden />}

      <div className="battle-screen__header">
        {isFighting && (
          <div className="battle-screen__combat-banner">
            <AncientIcon name="sword" size={14} className="battle-screen__combat-banner-icon" />
            <span className="battle-screen__combat-banner-text">ĐANG GIAO CHIẾN</span>
            <AncientIcon name="sword" size={14} className="battle-screen__combat-banner-icon battle-screen__combat-banner-icon--flip" />
          </div>
        )}

        <div className="battle-screen__title">{target.title}</div>
        {target.subtitle && <div className="battle-screen__subtitle">{target.subtitle}</div>}

        {phase === 'ready' && (
          <>
            <div className="battle-screen__stat-row">
              <span>Tỷ lệ thắng: <strong className="battle-screen__stat--chance">{winChance}%</strong></span>
              {target.waves.length > 1 && <span>{target.waves.length} đợt</span>}
            </div>
            {target.rewards.items && target.rewards.items.length > 0 && (
              <div className="battle-screen__drop-preview">
                <span className="battle-screen__drop-preview-label">Có thể rơi:</span>
                <div className="battle-screen__drop-preview-list">
                  {target.rewards.items.map((drop) => {
                    const template = ITEM_TEMPLATES[drop.templateId];
                    return (
                      <button
                        key={drop.templateId}
                        type="button"
                        className="battle-screen__drop-chip"
                        title={template?.name ?? drop.templateId}
                        onClick={() => openItemCatalog(drop.templateId)}
                      >
                        <ItemIcon icon={template?.icon ?? '📦'} className="reward-item-icon" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {isActive && (
          <div className="battle-screen__status-bar">
            <span className="battle-screen__status-pulse meta-stat"><AncientIcon name="sword" size={13} /> Hiệp {round || 1}</span>
            {target.waves.length > 1 && (
              <span className="battle-screen__status-wave">Đợt {waveIndex + 1}/{target.waves.length}</span>
            )}
            <span className="battle-screen__status-live">
              <span className="battle-screen__status-live-dot" />
              LIVE
            </span>
          </div>
        )}
      </div>

      <div className={`battle-screen__arena ${shake ? 'battle-screen__arena--shake' : ''}`}>
        {phase !== 'result' && (
          <>
            {waveBanner && (
              <div className="battle-screen__wave-banner">{waveBanner}</div>
            )}

            <div className="battle-screen__stage">
              <div className="battle-screen__arena-bg" />
              <BattleArenaFx active={isFighting} clashing={isClashing} />

              <div className="battle-screen__fighters">
              <div
                className={[
                  'battle-screen__fighter-card',
                  'battle-screen__fighter-card--player',
                  isFighting && 'battle-screen__fighter-card--combat',
                  animSide === 'player' && 'battle-screen__fighter-card--charge-right',
                  animSide === 'enemy' && 'battle-screen__fighter-card--knockback-left',
                ].filter(Boolean).join(' ')}
              >
                <div className="battle-screen__avatar-wrap">
                  {isFighting && <span className="battle-screen__combat-aura battle-screen__combat-aura--player" />}
                  <div className="battle-screen__spirit">
                    <SpiritPortrait gender={player.gender} element={player.element} size="md" paused={false} />
                  </div>
                  {popups.filter((p) => p.side === 'player').map((p) => (
                    <span key={p.id} className="battle-screen__damage battle-screen__damage--player">
                      -{formatNumber(p.value)}
                    </span>
                  ))}
                </div>
                <span className="battle-screen__name">{player.name}</span>
                <span className="battle-screen__power meta-stat">
                  <AncientIcon name="flame" size={11} className="anc-icon--power" /> {formatNumber(playerPower)}
                </span>
                <BattleHpBar current={showPlayerHp} max={showPlayerHpMax || 1} variant="player" />
              </div>

              <div className={`battle-screen__vs ${isFighting ? 'battle-screen__vs--combat' : ''} ${isClashing ? 'battle-screen__vs--clash' : ''}`}>
                {isFighting && isClashing && <span className="battle-screen__impact-flash" aria-hidden />}
                {isFighting ? (
                  <AncientIcon name="sword" size={22} className="battle-screen__vs-clash" />
                ) : (
                  <span className="battle-screen__vs-text">VS</span>
                )}
              </div>

              <div
                className={[
                  'battle-screen__fighter-card',
                  'battle-screen__fighter-card--enemy',
                  isFighting && 'battle-screen__fighter-card--combat',
                  animSide === 'enemy' && 'battle-screen__fighter-card--charge-left',
                  animSide === 'player' && 'battle-screen__fighter-card--knockback-right',
                ].filter(Boolean).join(' ')}
              >
                <div className="battle-screen__avatar-wrap">
                  {isFighting && <span className="battle-screen__combat-aura battle-screen__combat-aura--enemy" />}
                  <ItemIcon icon={wave.icon} className="battle-screen__enemy-icon" />
                  {popups.filter((p) => p.side === 'enemy').map((p) => (
                    <span key={p.id} className="battle-screen__damage battle-screen__damage--enemy">
                      -{formatNumber(p.value)}
                    </span>
                  ))}
                </div>
                <span className="battle-screen__name">{wave.name}</span>
                <span className="battle-screen__power meta-stat">
                  <AncientIcon name="flame" size={11} className="anc-icon--power" /> {formatNumber(enemyPower)}
                </span>
                <BattleHpBar current={showEnemyHp} max={showEnemyHpMax || wave.hp} variant="enemy" />
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

            <div className="battle-screen__log-wrap">
              <div className="battle-screen__log" ref={logRef}>
                {phase === 'ready' && logs.length === 0 && (
                  <div className="battle-screen__log-line battle-screen__log-line--system">
                    Chuẩn bị chiến đấu với <strong>{wave.name}</strong>
                  </div>
                )}
                {visibleLogs.map((line, i) => (
                  <div
                    key={line.id}
                    className={`battle-screen__log-line battle-screen__log-line--${line.side} ${i === visibleLogs.length - 1 ? 'battle-screen__log-line--latest' : ''}`}
                  >
                    <span className="battle-screen__log-text">{line.text}</span>
                    {line.damage != null && line.damage > 0 && (
                      <span className="battle-screen__log-damage">-{formatNumber(line.damage)}</span>
                    )}
                  </div>
                ))}
                {isActive && logs.length > 0 && phase === 'fighting' && (
                  <div className="battle-screen__log-typing">▌</div>
                )}
              </div>
            </div>
            </div>
          </>
        )}

        {phase === 'result' && result && (
          <div className="battle-screen__result">
            <div className={`battle-screen__result-icon ${result.win ? 'battle-screen__result-icon--win' : 'battle-screen__result-icon--lose'}`}>
              <AncientIcon name={result.win ? 'trophy' : 'soul'} size={48} />
            </div>
            <div className={`battle-screen__result-title ${result.win ? 'battle-screen__result-title--win' : 'battle-screen__result-title--lose'}`}>
              {result.win ? 'Chiến thắng!' : 'Thất bại!'}
            </div>
            <div className="battle-screen__result-meta">
              Tổng {result.totalRounds} hiệp · {result.waves.length} đợt
            </div>
            {result.win && (
              <>
                <div className="battle-screen__rewards">
                  {target.rewards.gold ? <span className="meta-stat"><AncientIcon name="coin" size={13} className="anc-icon--gold" /> +{formatNumber(target.rewards.gold)}</span> : null}
                  {target.rewards.crystal ? <span className="meta-stat"><AncientIcon name="gem" size={13} className="anc-icon--crystal" /> +{formatNumber(target.rewards.crystal)}</span> : null}
                  {target.rewards.jade ? <span className="meta-stat"><AncientIcon name="jade" size={13} className="anc-icon--jade" /> +{target.rewards.jade}</span> : null}
                </div>
                {rewardDrops.length > 0 && (
                  <div className="battle-screen__loot">
                    <div className="battle-screen__loot-head">
                      <AncientIcon name="gift" size={12} />
                      <span>Vật phẩm rơi</span>
                    </div>
                    <div className="battle-screen__loot-list">
                      {rewardDrops.map((drop, i) => {
                        const template = ITEM_TEMPLATES[drop.templateId];
                        return (
                          <button
                            key={`${drop.templateId}-${i}`}
                            type="button"
                            className="reward-row reward-row--clickable"
                            onClick={() => openItemCatalog(drop.templateId)}
                          >
                            <div className="reward-row__icon">
                              <ItemIcon icon={template?.icon ?? '📦'} className="reward-item-icon" />
                            </div>
                            <div className="reward-row__info">
                              <div className="reward-row__title">{template?.name ?? drop.templateId}</div>
                              <div className="reward-row__desc">Rơi ra sau chiến thắng</div>
                            </div>
                            <div className="reward-row__value">x{drop.quantity}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
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
          <>
            <div className="battle-screen__fighting-footer">
              <div className="battle-screen__fighting-dots">
                <span /><span /><span />
              </div>
              <span className="battle-screen__fighting-label">
                {phase === 'wave-transition' ? 'Chuẩn bị đợt tiếp theo...' : 'Linh lực va chạm, trận chiến đang diễn ra'}
              </span>
            </div>
            <GameButton variant="secondary" onClick={skipBattle} style={{ minWidth: 140 }}>
              Bỏ qua
            </GameButton>
          </>
        )}
        {phase === 'result' && (
          <>
            {autoStart && (
              <>
                <div className="battle-screen__fighting-footer">
                  <span>{result?.win ? 'Tự động lên tầng tiếp...' : 'Dừng tự động...'}</span>
                </div>
                <GameButton variant="secondary" onClick={skipAutoResult} style={{ minWidth: 140 }}>
                  Bỏ qua
                </GameButton>
              </>
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
