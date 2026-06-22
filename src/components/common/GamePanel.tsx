import type { ReactNode } from 'react';

interface GamePanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function GamePanel({ title, children, className = '' }: GamePanelProps) {
  return (
    <div className={`game-panel ${className}`}>
      {title && (
        <div className="game-panel__header">
          <span className="game-panel__title">{title}</span>
        </div>
      )}
      <div className="game-panel__body">{children}</div>
    </div>
  );
}
