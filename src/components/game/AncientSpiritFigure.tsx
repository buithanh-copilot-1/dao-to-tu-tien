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
    height: size * 1.18,
  } as CSSProperties;

  const isMale = gender === 'male';

  return (
    <svg
      className={`ancient-spirit ${paused ? 'ancient-spirit--paused' : ''} ${className}`}
      style={style}
      viewBox="0 0 180 212"
      aria-hidden
    >
      <defs>
        <radialGradient id="spirit-aura" cx="50%" cy="46%" r="58%">
          <stop offset="0%" stopColor={elementGlow} stopOpacity={paused ? 0.2 : 0.6} />
          <stop offset="55%" stopColor={elementGlow} stopOpacity={paused ? 0.08 : 0.24} />
          <stop offset="100%" stopColor={elementGlow} stopOpacity="0" />
        </radialGradient>

        <radialGradient id="spirit-core" cx="48%" cy="44%" r="58%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#bfe8ff" />
          <stop offset="75%" stopColor={elementColor} />
          <stop offset="100%" stopColor={elementColor} stopOpacity="0" />
        </radialGradient>

        <linearGradient id="spirit-robe-white" x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor="#dce9fb" />
          <stop offset="72%" stopColor="#809bc2" />
          <stop offset="100%" stopColor="#24324e" />
        </linearGradient>

        <linearGradient id="spirit-robe-blue" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#f5fbff" />
          <stop offset="42%" stopColor="#5f84b8" />
          <stop offset="100%" stopColor="#14213a" />
        </linearGradient>

        <linearGradient id="spirit-skin" x1="18%" y1="8%" x2="80%" y2="92%">
          <stop offset="0%" stopColor="#fff0df" />
          <stop offset="48%" stopColor="#e8cbb6" />
          <stop offset="100%" stopColor="#b78671" />
        </linearGradient>

        <linearGradient id="spirit-hair" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#2d3039" />
          <stop offset="40%" stopColor="#121722" />
          <stop offset="100%" stopColor="#05070d" />
        </linearGradient>

        <linearGradient id="spirit-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff1ba" />
          <stop offset="42%" stopColor="#d5a84c" />
          <stop offset="100%" stopColor="#6e4217" />
        </linearGradient>

        <filter id="spirit-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="90" cy="112" rx="74" ry="92" fill="url(#spirit-aura)" />
      <ellipse cx="90" cy="184" rx="70" ry="15" fill="#020813" opacity="0.55" />

      {/* Flowing hair behind the robe. */}
      <path
        d="M80 43 C48 68 35 108 31 158 C48 141 58 126 62 101 C66 78 74 62 86 48 Z"
        fill="url(#spirit-hair)"
        opacity={paused ? 0.55 : 0.88}
      />
      <path
        d="M99 44 C132 66 145 111 149 160 C130 140 119 124 116 100 C113 76 108 61 94 48 Z"
        fill="url(#spirit-hair)"
        opacity={paused ? 0.45 : 0.76}
      />
      <path
        d="M64 58 C42 85 28 114 22 154 M116 57 C140 82 153 112 158 154"
        fill="none"
        stroke="#87b9ff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={paused ? 0.16 : 0.34}
      />

      {/* Cross-legged robe mass. */}
      <path
        d="M19 168 C34 137 58 126 83 137 C88 140 92 140 97 137 C123 124 148 138 162 169 C138 183 109 187 90 177 C70 187 43 183 19 168 Z"
        fill="url(#spirit-robe-blue)"
        stroke="rgba(232, 212, 168, 0.42)"
        strokeWidth="1.1"
      />
      <path
        d="M31 160 C49 153 67 154 86 170 C61 177 43 174 31 160 Z"
        fill="#101a33"
        opacity="0.65"
      />
      <path
        d="M149 160 C130 153 112 154 94 170 C118 177 137 174 149 160 Z"
        fill="#101a33"
        opacity="0.64"
      />

      {/* Main torso and robe folds. */}
      <path
        d="M55 81 C63 64 78 55 90 56 C103 55 118 65 126 82 C126 112 115 139 91 153 C66 139 54 113 55 81 Z"
        fill="url(#spirit-robe-white)"
        stroke="rgba(255, 245, 215, 0.52)"
        strokeWidth="1"
      />
      <path
        d="M90 61 C81 78 77 99 78 145 C85 151 94 151 102 145 C102 100 99 78 90 61 Z"
        fill="#233a66"
        opacity="0.9"
      />
      <path
        d="M66 82 C77 91 83 110 84 146 M113 81 C103 93 97 112 96 146"
        fill="none"
        stroke="rgba(255, 255, 255, 0.64)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d="M70 119 C82 124 98 124 110 119"
        fill="none"
        stroke="url(#spirit-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M72 125 C82 129 98 129 108 125"
        fill="none"
        stroke="#091122"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Arms resting on knees. */}
      <path
        d="M58 88 C39 104 28 126 34 142 C43 147 51 143 55 134 C59 121 65 108 76 97"
        fill="url(#spirit-robe-white)"
        stroke="rgba(232, 212, 168, 0.38)"
        strokeWidth="1"
      />
      <path
        d="M122 88 C141 104 152 126 146 142 C137 147 129 143 125 134 C121 121 115 108 104 97"
        fill="url(#spirit-robe-white)"
        stroke="rgba(232, 212, 168, 0.38)"
        strokeWidth="1"
      />
      <ellipse cx="41" cy="141" rx="8.5" ry="5.2" fill="url(#spirit-skin)" transform="rotate(-8 41 141)" />
      <ellipse cx="139" cy="141" rx="8.5" ry="5.2" fill="url(#spirit-skin)" transform="rotate(8 139 141)" />

      {/* Shoulders and ornaments. */}
      <path
        d="M54 85 C61 76 69 73 77 75 C73 84 67 90 58 93 Z"
        fill="url(#spirit-gold)"
        opacity="0.86"
      />
      <path
        d="M126 85 C119 76 111 73 103 75 C107 84 113 90 122 93 Z"
        fill="url(#spirit-gold)"
        opacity="0.86"
      />
      <circle cx="90" cy="124" r="6" fill="url(#spirit-core)" filter="url(#spirit-soft-glow)" opacity={paused ? 0.48 : 0.95} />

      {/* Face, hair and crown. */}
      <path
        d="M72 52 C73 40 80 32 90 31 C101 32 108 40 109 52 C107 68 101 78 90 79 C79 78 73 68 72 52 Z"
        fill="url(#spirit-skin)"
      />
      <path
        d="M70 52 C72 37 80 29 91 29 C104 31 112 40 111 56 C101 47 88 46 72 54 Z"
        fill="url(#spirit-hair)"
      />
      <path
        d="M77 54 C85 58 96 58 104 54"
        fill="none"
        stroke="#1b1620"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.52"
      />
      <path
        d="M83 63 C87 65 93 65 97 63"
        fill="none"
        stroke="#7c4f42"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.46"
      />

      {isMale ? (
        <>
          <ellipse cx="90" cy="24" rx="9" ry="11" fill="url(#spirit-hair)" />
          <path
            d="M78 28 C83 20 97 20 103 28"
            fill="none"
            stroke="url(#spirit-gold)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M90 12 L94 24 L86 24 Z"
            fill="url(#spirit-gold)"
            opacity="0.88"
          />
        </>
      ) : (
        <>
          <ellipse cx="90" cy="24" rx="13" ry="10" fill="url(#spirit-hair)" />
          <path
            d="M64 62 C67 98 62 126 48 148 M116 62 C113 99 118 126 132 148"
            fill="none"
            stroke="url(#spirit-hair)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.84"
          />
          <circle cx="78" cy="28" r="2.4" fill="#f5d7e6" />
          <circle cx="102" cy="28" r="2.4" fill="#f5d7e6" />
          <path
            d="M78 30 C85 23 96 23 103 30"
            fill="none"
            stroke="url(#spirit-gold)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Qi ribbons. */}
      <g opacity={paused ? 0.2 : 0.74} filter="url(#spirit-soft-glow)">
        <path
          d="M19 124 C49 96 74 96 91 119 C109 143 139 136 163 111"
          fill="none"
          stroke="#9fd6ff"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M17 150 C47 165 69 153 87 135 C108 114 135 105 164 120"
          fill="none"
          stroke="#6eb8ff"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.76"
        />
        <path
          d="M48 92 C65 107 77 113 91 112 C106 111 119 103 132 88"
          fill="none"
          stroke={elementColor}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.74"
        />
      </g>

      {!paused && (
        <g>
          <circle cx="54" cy="116" r="1.8" fill="#dff5ff">
            <animate attributeName="cy" values="116;92;116" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="128" cy="104" r="1.5" fill="#dff5ff">
            <animate attributeName="cy" values="104;82;104" dur="2.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0" dur="2.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="91" cy="126" r="2.2" fill="#ffffff">
            <animate attributeName="r" values="2;5;2" dur="1.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.35;0.9" dur="1.9s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
}
