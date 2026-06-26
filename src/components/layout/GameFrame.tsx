import type { ReactNode, CSSProperties } from 'react';

interface GameFrameProps {
  children: ReactNode;
  bordered?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function GameFrame({ children, bordered = true, className = '', style }: GameFrameProps) {
  return (
    <div className={`game-frame ${bordered ? 'game-frame--bordered' : ''} ${className}`} style={style}>
      {bordered && (
        <div className="game-frame__ornaments" aria-hidden>
          <span className="game-frame__corner game-frame__corner--tl" />
          <span className="game-frame__corner game-frame__corner--tr" />
          <span className="game-frame__corner game-frame__corner--bl" />
          <span className="game-frame__corner game-frame__corner--br" />
        </div>
      )}
      {children}
    </div>
  );
}

interface GameScreenProps {
  children: ReactNode;
  className?: string;
}

export function GameScreen({ children, className = '' }: GameScreenProps) {
  return (
    <div className={`game-screen ${className}`}>
      <div className="game-screen__stars" aria-hidden />
      <div className="game-screen__mist" aria-hidden />
      <div className="game-screen__motes" aria-hidden>
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="qi-mote" />
        ))}
      </div>
      <div className="game-screen__content">{children}</div>
    </div>
  );
}

export function GameHeader({ children }: { children: ReactNode }) {
  return <div className="game-screen__header">{children}</div>;
}

export function GameBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`game-screen__body ${className}`}>{children}</div>;
}

export function GameFooter({ children }: { children: ReactNode }) {
  return <div className="game-screen__footer">{children}</div>;
}
