import type { CSSProperties } from 'react';
import type { ElementType, Gender } from '@/types/game';

const ELEMENT_COLORS: Record<ElementType, { primary: string; glow: string }> = {
  metal: { primary: '#c8d0dc', glow: 'rgba(200, 208, 220, 0.5)' },
  wood: { primary: '#4ade80', glow: 'rgba(74, 222, 128, 0.5)' },
  water: { primary: '#4da6ff', glow: 'rgba(77, 166, 255, 0.55)' },
  fire: { primary: '#ff6b35', glow: 'rgba(255, 107, 53, 0.55)' },
  earth: { primary: '#d4a574', glow: 'rgba(212, 165, 116, 0.5)' },
};

interface CultivationAvatarProps {
  gender: Gender;
  element: ElementType;
  cultivating: boolean;
  realmId: number;
}

export function CultivationAvatar({ gender, element, cultivating, realmId }: CultivationAvatarProps) {
  const colors = ELEMENT_COLORS[element];
  const avatar = gender === 'male' ? '🧙‍♂️' : '🧙‍♀️';
  const auraScale = 1 + realmId * 0.08;

  return (
    <div
      className={`cultivation-scene ${cultivating ? 'cultivation-scene--active' : 'cultivation-scene--paused'}`}
      style={{
        '--element-color': colors.primary,
        '--element-glow': colors.glow,
        '--aura-scale': auraScale,
      } as CSSProperties}
    >
      <div className="cultivation-scene__bg-glow" />

      <div className="cultivation-scene__aura cultivation-scene__aura--outer" />
      <div className="cultivation-scene__aura cultivation-scene__aura--inner" />

      <div className="cultivation-scene__platform">
        <div className="cultivation-scene__platform-ring" />
        <div className="cultivation-scene__platform-core" />
      </div>

      <div className="cultivation-scene__figure">
        <span className="cultivation-scene__avatar" role="img" aria-label="Đang tu luyện">
          {avatar}
        </span>
        {cultivating && (
          <>
            <span className="cultivation-scene__particle cultivation-scene__particle--1">✦</span>
            <span className="cultivation-scene__particle cultivation-scene__particle--2">✦</span>
            <span className="cultivation-scene__particle cultivation-scene__particle--3">✦</span>
            <span className="cultivation-scene__particle cultivation-scene__particle--4">✦</span>
          </>
        )}
      </div>

      <div className="cultivation-scene__status">
        {cultivating ? 'Đang hấp thụ linh khí...' : 'Tạm ngưng tu luyện'}
      </div>
    </div>
  );
}
