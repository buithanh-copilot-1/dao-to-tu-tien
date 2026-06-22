import type { CSSProperties } from 'react';
import type { Gender } from '@/types/game';

interface AncientSpiritFigureProps {
  gender: Gender;
  elementColor?: string;
  elementGlow?: string;
  paused?: boolean;
  size?: number;
  className?: string;
}

/** Hình tu sĩ cổ phong — thay emoji, dùng SVG mực tàu */
export function AncientSpiritFigure({
  gender,
  elementColor = 'var(--gold-primary)',
  elementGlow = 'rgba(201, 168, 108, 0.45)',
  paused = false,
  size = 100,
  className = '',
}: AncientSpiritFigureProps) {
  const style = {
    '--spirit-color': elementColor,
    '--spirit-glow': elementGlow,
    width: size,
    height: size * 1.2,
  } as CSSProperties;

  return (
    <svg
      className={`ancient-spirit ${paused ? 'ancient-spirit--paused' : ''} ${className}`}
      style={style}
      viewBox="0 0 100 120"
      aria-hidden
    >
      <defs>
        <radialGradient id="spirit-aura" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={elementGlow} stopOpacity={paused ? 0.15 : 0.55} />
          <stop offset="100%" stopColor={elementGlow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="spirit-robe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={elementColor} stopOpacity={paused ? 0.35 : 0.85} />
          <stop offset="100%" stopColor="#1a1410" stopOpacity={paused ? 0.6 : 0.95} />
        </linearGradient>
        <linearGradient id="spirit-skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8d4c0" />
          <stop offset="100%" stopColor="#c4a888" />
        </linearGradient>
        <filter id="spirit-ink">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" />
        </filter>
      </defs>

      <ellipse cx="50" cy="62" rx="38" ry="42" fill="url(#spirit-aura)" />

      {/* Vạt áo trải — tư thế đả tọa */}
      <path
        d="M18 78 Q50 58 82 78 L88 108 Q50 118 12 108 Z"
        fill="url(#spirit-robe)"
        filter="url(#spirit-ink)"
      />
      <path
        d="M28 76 Q50 68 72 76 L76 100 Q50 108 24 100 Z"
        fill="none"
        stroke={elementColor}
        strokeWidth="0.6"
        opacity={paused ? 0.25 : 0.5}
      />

      {/* Thân & tay ấn */}
      <path
        d="M38 62 L38 78 M62 62 L62 78"
        stroke={elementColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={paused ? 0.4 : 0.75}
      />
      <ellipse cx="50" cy="72" rx="14" ry="8" fill="url(#spirit-robe)" opacity="0.9" />
      <path
        d="M42 74 Q50 78 58 74"
        fill="none"
        stroke={elementColor}
        strokeWidth="1.2"
        opacity="0.6"
      />

      {/* Đầu */}
      <circle cx="50" cy="38" r="11" fill="url(#spirit-skin)" opacity={paused ? 0.55 : 1} />
      <ellipse cx="50" cy="42" rx="9" ry="5" fill="#2a1810" opacity="0.15" />

      {gender === 'male' ? (
        <>
          <ellipse cx="50" cy="28" rx="7" ry="5" fill="#2a1810" opacity={paused ? 0.5 : 0.85} />
          <path d="M43 28 Q50 22 57 28" fill="none" stroke={elementColor} strokeWidth="1" opacity="0.5" />
        </>
      ) : (
        <>
          <path
            d="M39 34 Q35 50 38 68 M61 34 Q65 50 62 68"
            fill="none"
            stroke="#2a1810"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={paused ? 0.45 : 0.8}
          />
          <path
            d="M41 30 Q50 24 59 30"
            fill="none"
            stroke={elementColor}
            strokeWidth="1.2"
            opacity="0.55"
          />
        </>
      )}

      {/* Linh khí quanh thân */}
      {!paused && (
        <>
          <circle cx="22" cy="55" r="2" fill={elementColor} opacity="0.7">
            <animate attributeName="cy" values="55;42;55" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="78" cy="50" r="1.5" fill={elementColor} opacity="0.6">
            <animate attributeName="cy" values="50;38;50" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.7;0" dur="2.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}
