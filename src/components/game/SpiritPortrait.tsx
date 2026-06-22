import type { ElementType, Gender } from '@/types/game';
import { AncientSpiritFigure } from './AncientSpiritFigure';

export const ELEMENT_VISUALS: Record<ElementType, { primary: string; glow: string; name: string }> = {
  metal: { primary: '#c8d0dc', glow: 'rgba(200, 208, 220, 0.45)', name: 'Kim' },
  wood: { primary: '#5a9a6a', glow: 'rgba(90, 154, 106, 0.45)', name: 'Mộc' },
  water: { primary: '#5a8ab0', glow: 'rgba(90, 138, 176, 0.5)', name: 'Thủy' },
  fire: { primary: '#c94a30', glow: 'rgba(201, 74, 48, 0.5)', name: 'Hỏa' },
  earth: { primary: '#b89050', glow: 'rgba(184, 144, 80, 0.45)', name: 'Thổ' },
};

const SIZE_MAP = { sm: 36, md: 54, lg: 64 } as const;

interface SpiritPortraitProps {
  gender: Gender;
  element?: ElementType;
  size?: keyof typeof SIZE_MAP;
  paused?: boolean;
  className?: string;
}

/** Khung chân dung cổ phong — dùng ở header, nhân vật, tạo nhân vật */
export function SpiritPortrait({
  gender,
  element = 'water',
  size = 'md',
  paused = true,
  className = '',
}: SpiritPortraitProps) {
  const colors = ELEMENT_VISUALS[element];

  return (
    <div className={`spirit-portrait spirit-portrait--${size} ${className}`}>
      <AncientSpiritFigure
        gender={gender}
        elementColor={colors.primary}
        elementGlow={colors.glow}
        paused={paused}
        size={SIZE_MAP[size]}
      />
    </div>
  );
}
