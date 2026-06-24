import { useEffect, type ReactNode } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useGameTick } from '@/hooks/useGameTick';
import { Modal, GameButton, AncientIcon, GameToastBanner, ItemCatalogHost } from '@/components';
import { TribulationResultModal } from '@/components/game/TribulationResultModal';
import { TribulationSceneModal } from '@/components/game/TribulationSceneModal';
import { formatDurationShort, formatNumber } from '@/utils/format';

interface GameShellProps {
  children: ReactNode;
}

export function GameShell({ children }: GameShellProps) {
  useGameTick();

  const showOfflineReward = useGameStore((s) => s.showOfflineReward);
  const pendingOffline = useGameStore((s) => s.pendingOffline);
  const settings = useGameStore((s) => s.settings);
  const claimOfflineRewards = useGameStore((s) => s.claimOfflineRewards);
  const dismissOfflineRewards = useGameStore((s) => s.dismissOfflineRewards);
  const breakthroughMessage = useGameStore((s) => s.breakthroughMessage);
  const breakthroughPowerDelta = useGameStore((s) => s.breakthroughPowerDelta);
  const breakthroughTribulation = useGameStore((s) => s.breakthroughTribulation);
  const clearBreakthroughMessage = useGameStore((s) => s.clearBreakthroughMessage);
  const tribulationScene = useGameStore((s) => s.tribulationScene);
  const finishTribulationScene = useGameStore((s) => s.finishTribulationScene);
  const player = useGameStore((s) => s.player);

  useEffect(() => {
    document.documentElement.classList.toggle('game-reduced-motion', settings.reducedMotion);
    document.documentElement.dataset.battleSpeed = settings.battleSpeed;

    return () => {
      document.documentElement.classList.remove('game-reduced-motion');
      delete document.documentElement.dataset.battleSpeed;
    };
  }, [settings.battleSpeed, settings.reducedMotion]);

  useEffect(() => {
    if (settings.autoClaimOffline && showOfflineReward && pendingOffline) {
      claimOfflineRewards();
    }
  }, [claimOfflineRewards, pendingOffline, settings.autoClaimOffline, showOfflineReward]);

  return (
    <>
      {children}
      <GameToastBanner />
      <ItemCatalogHost />

      {showOfflineReward && pendingOffline && !settings.autoClaimOffline && (
        <Modal
          onClose={dismissOfflineRewards}
          footer={
            <GameButton variant="primary" onClick={claimOfflineRewards}>
              Nhận thưởng
            </GameButton>
          }
        >
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 18, color: 'var(--text-gold)', marginBottom: 12 }}>
              Phần thưởng offline
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Bạn đã offline {formatDurationShort(pendingOffline.durationMs)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {pendingOffline.cultivation > 0 && (
                <div className="meta-stat" style={{ justifyContent: 'center' }}><AncientIcon name="swirl" size={14} className="anc-icon--crystal" /> Tu vi: <strong style={{ color: 'var(--cyan-glow)' }}>+{formatNumber(pendingOffline.cultivation)}</strong></div>
              )}
              {pendingOffline.crystal > 0 && (
                <div className="meta-stat" style={{ justifyContent: 'center' }}><AncientIcon name="gem" size={14} className="anc-icon--crystal" /> Linh thạch: <strong style={{ color: 'var(--text-gold)' }}>+{formatNumber(pendingOffline.crystal)}</strong></div>
              )}
              {pendingOffline.silver > 0 && (
                <div className="meta-stat" style={{ justifyContent: 'center' }}><AncientIcon name="coin" size={14} className="anc-icon--gold" /> Bạc: <strong>+{formatNumber(pendingOffline.silver)}</strong></div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {tribulationScene && player && (
        <TribulationSceneModal
          info={tribulationScene}
          gender={player.gender}
          element={player.element}
          realmId={player.realmId}
          onComplete={finishTribulationScene}
        />
      )}

      {!tribulationScene && (
        breakthroughTribulation ? (
          <TribulationResultModal
            notice={breakthroughTribulation}
            showPowerDelta={settings.showPowerDelta}
            onClose={clearBreakthroughMessage}
          />
        ) : breakthroughMessage && (
          <Modal
            onClose={clearBreakthroughMessage}
            footer={
              <GameButton variant="primary" onClick={clearBreakthroughMessage}>
                Tiếp tục tu luyện
              </GameButton>
            }
          >
            <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 15, color: 'var(--text-gold)' }}>
              <div>{breakthroughMessage}</div>
              {settings.showPowerDelta && breakthroughPowerDelta !== null && breakthroughPowerDelta !== 0 && (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    color: breakthroughPowerDelta > 0 ? '#7ee07a' : '#f08080',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <AncientIcon name="flame" size={16} />
                  {breakthroughPowerDelta > 0 ? '+' : ''}
                  {formatNumber(breakthroughPowerDelta)} lực chiến
                </div>
              )}
            </div>
          </Modal>
        )
      )}
    </>
  );
}
