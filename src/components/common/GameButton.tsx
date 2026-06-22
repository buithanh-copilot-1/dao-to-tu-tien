import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { NotifyDot } from './NotifyDot';

type ButtonVariant = 'primary' | 'secondary' | 'light' | 'claim' | 'go' | 'banner' | 'hex';

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string;
  notify?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export function GameButton({
  variant = 'primary',
  icon,
  notify,
  fullWidth,
  children,
  className = '',
  ...props
}: GameButtonProps) {
  return (
    <button
      className={`game-btn game-btn--${variant} ${fullWidth ? 'game-btn--full' : ''} ${className}`}
      type="button"
      {...props}
    >
      {icon && <span className="game-btn__icon">{icon}</span>}
      {children}
      {notify && <NotifyDot className="game-btn__badge" size="sm" />}
    </button>
  );
}
