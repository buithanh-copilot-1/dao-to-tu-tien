import type { CSSProperties } from 'react';

/**
 * Bộ icon cổ phong vẽ bằng SVG (nét bút), thay cho emoji.
 * Dùng currentColor để thừa hưởng màu từ class cha.
 */
export type AncientIconName =
  | 'cycle'
  | 'pause'
  | 'gate'
  | 'gourd'
  | 'sort'
  | 'lock'
  | 'unlock'
  | 'plus'
  | 'minus'
  | 'close'
  | 'check'
  | 'sparkle'
  | 'coin'
  | 'pill'
  | 'gem'
  | 'jade'
  | 'flame'
  | 'play'
  | 'hourglass'
  | 'bag'
  | 'sword'
  | 'shield'
  | 'heart'
  | 'bolt'
  | 'swirl'
  | 'eye';

interface AncientIconProps {
  name: AncientIconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const PATHS: Record<AncientIconName, React.ReactNode> = {
  // Luân chuyển — tự động tu luyện
  cycle: (
    <>
      <path {...S} d="M5 12a7 7 0 0 1 11.9-5" />
      <path {...S} d="M19 12a7 7 0 0 1-11.9 5" />
      <path {...S} d="M17 3v4h-4" />
      <path {...S} d="M7 21v-4h4" />
    </>
  ),
  // Tạm ngưng
  pause: (
    <>
      <path {...S} strokeWidth={2.4} d="M9 6v12" />
      <path {...S} strokeWidth={2.4} d="M15 6v12" />
    </>
  ),
  // Cổng bí cảnh (cổng torii)
  gate: (
    <>
      <path {...S} d="M3 6.5h18" />
      <path {...S} d="M4.5 9h15" />
      <path {...S} d="M7 9v11" />
      <path {...S} d="M17 9v11" />
      <path {...S} d="M5 4.5l1.5 2M19 4.5l-1.5 2" />
    </>
  ),
  // Hồ lô (đan dược / dev)
  gourd: (
    <>
      <path {...S} d="M11 3.5h2" />
      <path {...S} d="M10.5 5.2c0 1.3.6 1.8.6 3-.9.7-2.1 1.9-2.1 3.8 0 2.8 1.8 4.5 4 4.5s4-1.7 4-4.5c0-1.9-1.2-3.1-2.1-3.8 0-1.2.6-1.7.6-3" />
      <path {...S} d="M8.5 12.2h7" />
    </>
  ),
  // Sắp xếp
  sort: (
    <>
      <path {...S} d="M4 7h9" />
      <path {...S} d="M4 12h6" />
      <path {...S} d="M4 17h3" />
      <path {...S} d="M17 5v13" />
      <path {...S} d="M14 15l3 3 3-3" />
    </>
  ),
  // Ngọc tỏa (khóa)
  lock: (
    <>
      <rect {...S} x="6" y="10.5" width="12" height="9" rx="1.2" />
      <path {...S} d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <circle {...S} cx="12" cy="14.5" r="1.3" />
      <path {...S} d="M12 15.8v1.6" />
    </>
  ),
  unlock: (
    <>
      <rect {...S} x="6" y="10.5" width="12" height="9" rx="1.2" />
      <path {...S} d="M8.5 10.5V8a3.5 3.5 0 0 1 6.7-1.4" />
      <circle {...S} cx="12" cy="14.5" r="1.3" />
    </>
  ),
  plus: (
    <>
      <path {...S} strokeWidth={2} d="M12 5.5v13" />
      <path {...S} strokeWidth={2} d="M5.5 12h13" />
    </>
  ),
  minus: <path {...S} strokeWidth={2} d="M5.5 12h13" />,
  close: (
    <>
      <path {...S} strokeWidth={1.8} d="M6.5 6.5l11 11" />
      <path {...S} strokeWidth={1.8} d="M17.5 6.5l-11 11" />
    </>
  ),
  check: <path {...S} strokeWidth={2} d="M5 12.5l4.5 4.5L19 7" />,
  // Tinh quang (linh khí)
  sparkle: (
    <>
      <path {...S} d="M12 3l1.7 6.3L20 11l-6.3 1.7L12 19l-1.7-6.3L4 11l6.3-1.7z" />
      <path {...S} d="M18.5 4.5l.6 2 .6-2 .6 2" opacity={0.7} />
    </>
  ),
  // Đồng tiền cổ (vàng)
  coin: (
    <>
      <circle {...S} cx="12" cy="12" r="8.5" />
      <rect {...S} x="9.2" y="9.2" width="5.6" height="5.6" />
    </>
  ),
  // Đan
  pill: (
    <>
      <circle {...S} cx="12" cy="12" r="8" />
      <path {...S} d="M9 9.5a3.6 3.6 0 0 1 2.5-1.3" opacity={0.8} />
      <circle {...S} cx="12" cy="12" r="2.4" />
    </>
  ),
  // Linh thạch
  gem: (
    <>
      <path {...S} d="M6 5h12l3 4.5-9 11-9-11z" />
      <path {...S} d="M3 9.5h18" />
      <path {...S} d="M9 5l-3 4.5 6 11 6-11L15 5" opacity={0.75} />
    </>
  ),
  // Ngọc bích (璧) — jade
  jade: (
    <>
      <circle {...S} cx="12" cy="12" r="8.5" />
      <circle {...S} cx="12" cy="12" r="3" />
    </>
  ),
  // Ngọn lửa — lực chiến
  flame: (
    <>
      <path {...S} d="M12 3c1 2.6 3.8 4 3.8 7.6a3.8 3.8 0 0 1-7.6 0c0-1.1.4-1.9.9-2.6.3.9.9 1.4 1.7 1.6C10.3 8.4 11 6 12 3z" />
    </>
  ),
  play: <path {...S} d="M8 5.5l10 6.5-10 6.5z" />,
  hourglass: (
    <>
      <path {...S} d="M6.5 4h11" />
      <path {...S} d="M6.5 20h11" />
      <path {...S} d="M8 4c0 4 8 4.4 8 8s-8 4-8 8" />
      <path {...S} d="M16 4c0 4-8 4.4-8 8s8 4 8 8" />
    </>
  ),
  // Túi đồ
  bag: (
    <>
      <path {...S} d="M6.5 8.5h11l1 11.5h-13z" />
      <path {...S} d="M9 8.5a3 3 0 0 1 6 0" />
    </>
  ),
  // Chỉ số
  sword: (
    <>
      <path {...S} d="M12 3v11" />
      <path {...S} d="M9 14h6" />
      <path {...S} d="M12 14v6" />
      <path {...S} d="M10.5 18h3" />
    </>
  ),
  shield: (
    <>
      <path {...S} d="M12 3l7 2.5v5c0 5-3.4 8-7 9.5-3.6-1.5-7-4.5-7-9.5v-5z" />
    </>
  ),
  heart: <path {...S} d="M12 20s-7-4.4-7-9.6A3.4 3.4 0 0 1 12 9a3.4 3.4 0 0 1 7 1.4c0 5.2-7 9.6-7 9.6z" />,
  bolt: <path {...S} d="M13 3L5.5 13H11l-1 8 8.5-11H13z" />,
  swirl: (
    <>
      <path {...S} d="M12 4a8 8 0 1 1-7.5 5.3" />
      <path {...S} d="M12 8a4 4 0 1 0 3.7 2.5" />
    </>
  ),
  eye: (
    <>
      <path {...S} d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle {...S} cx="12" cy="12" r="2.6" />
    </>
  ),
};

export function AncientIcon({ name, size = 20, className = '', style }: AncientIconProps) {
  return (
    <svg
      className={`anc-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      style={style}
    >
      {PATHS[name]}
    </svg>
  );
}
