import type { ReactNode } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useGameTick } from '@/hooks/useGameTick';
import { Modal, GameButton, AncientIcon } from '@/components';
import { formatDurationShort, formatNumber } from '@/utils/format';

interface GameShellProps {
  children: ReactNode;
}

export function GameShell({ children }: GameShellProps) {
  useGameTick();

  const showOfflineReward = useGameStore((s) => s.showOfflineReward);
  const pendingOffline = useGameStore((s) => s.pendingOffline);
  const claimOfflineRewards = useGameStore((s) => s.claimOfflineRewards);
  const dismissOfflineRewards = useGameStore((s) => s.dismissOfflineRewards);
  const breakthroughMessage = useGameStore((s) => s.breakthroughMessage);
  const clearBreakthroughMessage = useGameStore((s) => s.clearBreakthroughMessage);
  const toastMessage = useGameStore((s) => s.toastMessage);
  const clearToast = useGameStore((s) => s.clearToast);

  return (
    <>
      {children}

      {showOfflineReward && pendingOffline && (
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

      {breakthroughMessage && (
        <Modal
          onClose={clearBreakthroughMessage}
          footer={
            <GameButton variant="primary" onClick={clearBreakthroughMessage}>
              Tiếp tục tu luyện
            </GameButton>
          }
        >
          <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 15, color: 'var(--text-gold)' }}>
            {breakthroughMessage}
          </div>
        </Modal>
      )}

      {toastMessage && (
        <Modal onClose={clearToast} footer={
          <GameButton variant="primary" onClick={clearToast}>OK</GameButton>
        }>
          <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
            {toastMessage}
          </div>
        </Modal>
      )}
    </>
  );
}
