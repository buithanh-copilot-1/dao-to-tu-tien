/** Trang trí cổ phong — bát quái, mây, sen, góc khung */

export function SceneCornerBrackets() {
  return (
    <>
      <span className="ancient-scene__corner ancient-scene__corner--tl" aria-hidden>卍</span>
      <span className="ancient-scene__corner ancient-scene__corner--tr" aria-hidden>卍</span>
      <span className="ancient-scene__corner ancient-scene__corner--bl" aria-hidden>卍</span>
      <span className="ancient-scene__corner ancient-scene__corner--br" aria-hidden>卍</span>
    </>
  );
}

export function SceneBagua({ active }: { active: boolean }) {
  return (
    <svg
      className={`ancient-scene__bagua ${active ? 'ancient-scene__bagua--spin' : ''}`}
      viewBox="0 0 200 200"
      aria-hidden
    >
      <circle cx="100" cy="100" r="92" fill="none" stroke="var(--gold-primary)" strokeWidth="0.8" opacity="0.25" />
      <circle cx="100" cy="100" r="72" fill="none" stroke="var(--gold-primary)" strokeWidth="0.5" opacity="0.2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="100"
          x2={100 + 88 * Math.cos((deg * Math.PI) / 180)}
          y2={100 + 88 * Math.sin((deg * Math.PI) / 180)}
          stroke="var(--gold-primary)"
          strokeWidth="0.6"
          opacity="0.18"
        />
      ))}
      {/* Càn Khôn — 4 hướng */}
      <rect x="88" y="14" width="24" height="6" rx="1" fill="var(--gold-primary)" opacity="0.35" />
      <rect x="88" y="180" width="24" height="6" rx="1" fill="var(--gold-primary)" opacity="0.35" />
      <rect x="14" y="88" width="6" height="24" rx="1" fill="var(--gold-primary)" opacity="0.35" />
      <rect x="180" y="88" width="6" height="24" rx="1" fill="var(--gold-primary)" opacity="0.35" />
      {/* Âm dương giản lược */}
      <circle cx="100" cy="100" r="22" fill="var(--ink-mid)" stroke="var(--gold-primary)" strokeWidth="0.8" opacity="0.5" />
      <path
        d="M100 78 A22 22 0 0 1 100 122 A11 11 0 0 1 100 100 A11 11 0 0 0 100 78"
        fill="var(--paper)"
        opacity="0.55"
      />
      <circle cx="100" cy="89" r="3.5" fill="var(--ink-mid)" opacity="0.7" />
      <circle cx="100" cy="111" r="3.5" fill="var(--paper)" opacity="0.7" />
    </svg>
  );
}

export function SceneCloud({ className = '' }: { className?: string }) {
  return (
    <svg className={`ancient-scene__cloud ${className}`} viewBox="0 0 80 40" aria-hidden>
      <path
        d="M8 28 Q4 20 14 18 Q12 8 26 10 Q34 2 48 8 Q62 4 68 16 Q78 18 74 28 Q80 34 68 32 L12 32 Q2 34 8 28 Z"
        fill="none"
        stroke="var(--gold-primary)"
        strokeWidth="1"
        opacity="0.22"
      />
    </svg>
  );
}

export function SceneLotus({ active }: { active: boolean }) {
  return (
    <svg
      className={`ancient-scene__lotus ${active ? 'ancient-scene__lotus--glow' : ''}`}
      viewBox="0 0 140 50"
      aria-hidden
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 70 + Math.cos(rad) * 28;
        const cy = 28 + Math.sin(rad) * 10;
        return (
          <ellipse
            key={deg}
            cx={cx}
            cy={cy}
            rx="14"
            ry="22"
            fill="var(--element-glow, rgba(201,168,108,0.15))"
            stroke="var(--gold-primary)"
            strokeWidth="0.6"
            opacity="0.45"
            transform={`rotate(${deg} ${cx} ${cy})`}
          />
        );
      })}
      <ellipse cx="70" cy="30" rx="18" ry="8" fill="var(--gold-primary)" opacity="0.2" />
      <ellipse cx="70" cy="32" rx="10" ry="4" fill="var(--element-color, var(--gold-light))" opacity="0.35" />
    </svg>
  );
}
