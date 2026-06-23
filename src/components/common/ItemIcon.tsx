import type { ReactNode } from 'react';
import { AncientIcon, type AncientIconName } from './AncientIcon';

interface ItemIconProps {
  icon: string;
  className?: string;
}

type ItemGlyphName = 'crystal' | 'herb' | 'ore' | 'soul' | 'ring' | 'belt' | 'treasure' | 'box';

const LEGACY_GLYPH_BY_ICON: Record<string, ItemGlyphName> = {
  '💎': 'crystal',
  '🌿': 'herb',
  '🪨': 'ore',
  '👻': 'soul',
  '💍': 'ring',
  '🎗': 'belt',
  '🎗️': 'belt',
  '🔮': 'treasure',
  '📦': 'box',
  '❓': 'box',
};

const LEGACY_ANCIENT_BY_ICON: Record<string, AncientIconName> = {
  '🔑': 'unlock',
  '🏠': 'pagoda',
  '✨': 'sparkle',
  '⚔': 'sword',
  '⚔️': 'sword',
  '🗡': 'sword',
  '🗡️': 'sword',
  '🛡': 'shield',
  '🛡️': 'shield',
  '🔥': 'flame',
  '⚡': 'bolt',
  '🐉': 'flame',
  '🐲': 'flame',
  '🧘': 'meditate',
  '🧘‍♂️': 'meditate',
  '🧘‍♀️': 'meditate',
  '🧙': 'person',
  '🧙‍♂️': 'person',
  '🧙‍♀️': 'person',
  '👴': 'person',
  '👹': 'soul',
  '🏔': 'mountain',
  '🏔️': 'mountain',
  '⛰': 'mountain',
  '⛰️': 'mountain',
  '🌲': 'mountain',
  '❄': 'sparkle',
  '❄️': 'sparkle',
  '🌟': 'sparkle',
  '🌑': 'soul',
  '🌀': 'swirl',
  '☯': 'realm',
  '☯️': 'realm',
  '🏯': 'pagoda',
  '🗼': 'pagoda',
  '⛩': 'gate',
  '⛩️': 'gate',
  '☁': 'swirl',
  '☁️': 'swirl',
  '🦴': 'soul',
  '💧': 'swirl',
  '🎒': 'bag',
  '⏱': 'hourglass',
  '⏱️': 'hourglass',
  '💊': 'pill',
  '♂': 'person',
  '♀': 'person',
  '🪙': 'coin',
  '🏆': 'trophy',
  '👑': 'trophy',
  '💀': 'soul',
  '🎁': 'gift',
  '🎲': 'sparkle',
};

const SVG_PROPS = {
  viewBox: '0 0 48 48',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

const STROKE_PROPS = {
  stroke: 'currentColor',
  strokeWidth: 2.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ITEM_GLYPHS: Record<ItemGlyphName, ReactNode> = {
  crystal: (
    <svg {...SVG_PROPS} className="item-icon-glyph__svg">
      <path {...STROKE_PROPS} d="M14 7h20l8 12-18 23L6 19z" />
      <path {...STROKE_PROPS} d="M6 19h36M14 7l-4 12 14 23 14-23-4-12M18 19l6-12 6 12" opacity={0.72} />
    </svg>
  ),
  herb: (
    <svg {...SVG_PROPS} className="item-icon-glyph__svg">
      <path {...STROKE_PROPS} d="M23 40c.4-10.8 2.4-21 10-31" />
      <path {...STROKE_PROPS} d="M25 25C15 23 9 16 8 8c9 .3 16 5.4 17 17z" />
      <path {...STROKE_PROPS} d="M28 21c7.5-1.6 12.2-6.5 12.8-12.2-7.2.4-11.8 4.3-12.8 12.2z" />
      <path {...STROKE_PROPS} d="M18 33c-5.2-.2-8.9-3.1-10.8-7.8 5.8-.8 9.8 1.9 10.8 7.8z" opacity={0.82} />
    </svg>
  ),
  ore: (
    <svg {...SVG_PROPS} className="item-icon-glyph__svg">
      <path {...STROKE_PROPS} d="M9 32l7-17 15-7 9 13-5 17-18 3z" />
      <path {...STROKE_PROPS} d="M16 15l8 10 16-4M24 25l-7 16M24 25l11 13M31 8l-7 17" opacity={0.72} />
      <path {...STROKE_PROPS} d="M13 31l8 3" opacity={0.5} />
    </svg>
  ),
  soul: (
    <svg {...SVG_PROPS} className="item-icon-glyph__svg">
      <path {...STROKE_PROPS} d="M24 6c8 5 13 11.5 13 20.2C37 34 31.8 41 24 41S11 34 11 26.2C11 17.5 16 11 24 6z" />
      <path {...STROKE_PROPS} d="M17 32c2 2.4 4.2 3.6 7 3.6s5-1.2 7-3.6" opacity={0.72} />
      <path {...STROKE_PROPS} d="M18 22h.1M30 22h.1" />
      <path {...STROKE_PROPS} d="M10 18c2.2 2.8 4.4 4.5 7 5.4M38 18c-2.2 2.8-4.4 4.5-7 5.4" opacity={0.55} />
    </svg>
  ),
  ring: (
    <svg {...SVG_PROPS} className="item-icon-glyph__svg">
      <circle {...STROKE_PROPS} cx="24" cy="28" r="13" />
      <path {...STROKE_PROPS} d="M18 11h12l5 6-11 9-11-9z" />
      <path {...STROKE_PROPS} d="M13 17h22M20 11l4 15 4-15" opacity={0.72} />
    </svg>
  ),
  belt: (
    <svg {...SVG_PROPS} className="item-icon-glyph__svg">
      <path {...STROKE_PROPS} d="M7 18c9.5-5.8 24.5-5.8 34 0" />
      <path {...STROKE_PROPS} d="M9 29c8.5 5.8 21.5 5.8 30 0" />
      <path {...STROKE_PROPS} d="M15 16l4 16M33 16l-4 16" opacity={0.72} />
      <rect {...STROKE_PROPS} x="20" y="17" width="8" height="14" rx="1.5" />
    </svg>
  ),
  treasure: (
    <svg {...SVG_PROPS} className="item-icon-glyph__svg">
      <circle {...STROKE_PROPS} cx="24" cy="25" r="14" />
      <path {...STROKE_PROPS} d="M24 7l2.2 7.2L34 16.5l-7.8 2.2L24 26l-2.2-7.3-7.8-2.2 7.8-2.3z" />
      <path {...STROKE_PROPS} d="M15 36c4.8 2.2 13.2 2.2 18 0" opacity={0.65} />
    </svg>
  ),
  box: (
    <svg {...SVG_PROPS} className="item-icon-glyph__svg">
      <path {...STROKE_PROPS} d="M8 17l16-9 16 9v18l-16 8-16-8z" />
      <path {...STROKE_PROPS} d="M8 17l16 9 16-9M24 26v17M16 12l16 9" opacity={0.72} />
    </svg>
  ),
};

function getGlyphName(icon: string): ItemGlyphName | null {
  if (icon.startsWith('item:')) {
    const name = icon.slice(5);
    return name in ITEM_GLYPHS ? (name as ItemGlyphName) : 'box';
  }
  return LEGACY_GLYPH_BY_ICON[icon] ?? null;
}

function getAncientIconName(icon: string): AncientIconName | null {
  if (icon.startsWith('ancient:')) {
    const name = icon.slice(8);
    return name as AncientIconName;
  }
  return LEGACY_ANCIENT_BY_ICON[icon] ?? null;
}

export function ItemIcon({ icon, className }: ItemIconProps) {
  if (icon.startsWith('/') || icon.startsWith('data:')) {
    return <img className={className} src={icon} alt="" draggable={false} />;
  }

  const glyphName = getGlyphName(icon);
  if (glyphName) {
    return (
      <span className={`${className ?? ''} item-icon-glyph item-icon-glyph--${glyphName}`.trim()}>
        {ITEM_GLYPHS[glyphName]}
      </span>
    );
  }

  const ancientName = getAncientIconName(icon);
  if (ancientName) {
    return (
      <span className={`${className ?? ''} item-icon-glyph item-icon-glyph--ancient item-icon-glyph--${ancientName}`.trim()}>
        <AncientIcon name={ancientName} size={24} />
      </span>
    );
  }

  return <span className={className}>{icon}</span>;
}
