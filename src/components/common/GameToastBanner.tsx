import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { AncientIcon } from './AncientIcon';
import { formatNumber } from '@/utils/format';

const AUTO_DISMISS_MS = 3500;

export function GameToastBanner() {
  const toast = useGameStore((s) => s.toast);
  const showPowerDelta = useGameStore((s) => s.settings.showPowerDelta);
  const clearToast = useGameStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  const { message, powerDelta, variant } = toast;
  const showPower = showPowerDelta && powerDelta !== null && powerDelta !== 0;

  return (
    <div className="game-toast-layer" role="status" aria-live="polite">
      <button
        type="button"
        className={`game-toast game-toast--${variant}`}
        onClick={clearToast}
      >
        <span className="game-toast__message">{message}</span>
        {showPower && (
          <span
            className={`game-toast__power ${powerDelta > 0 ? 'game-toast__power--up' : 'game-toast__power--down'}`}
          >
            <AncientIcon name="flame" size={14} />
            {powerDelta > 0 ? '+' : ''}
            {formatNumber(powerDelta)} lực chiến
          </span>
        )}
      </button>
    </div>
  );
}
