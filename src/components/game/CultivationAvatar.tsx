import type { CSSProperties } from 'react';
import type { ElementType, Gender } from '@/types/game';
import meditationFemale from '@/assets/home/meditation-female.png';
import meditationMale from '@/assets/home/meditation-male.png';
import { ELEMENT_VISUALS } from './SpiritPortrait';

interface CultivationAvatarProps {
  gender: Gender;
  element: ElementType;
  cultivating: boolean;
  realmId: number;
}

export function CultivationAvatar({ gender, element, cultivating, realmId }: CultivationAvatarProps) {
  const colors = ELEMENT_VISUALS[element];
  const auraScale = 1 + realmId * 0.04;
  const meditationImage = gender === 'female' ? meditationFemale : meditationMale;

  return (
    <div
      className={`cultivation-scene cultivation-scene--${gender} ${cultivating ? 'cultivation-scene--active' : 'cultivation-scene--paused'}`}
      style={{
        '--element-color': colors.primary,
        '--element-glow': colors.glow,
        '--aura-scale': auraScale,
      } as CSSProperties}
    >
      <div className="cultivation-scene__scroll" role="img" aria-label="Dang tu luyen">
        <div className="cultivation-scene__figure">
          {cultivating && (
            <div className="cultivation-scene__qi-flows cultivation-scene__qi-flows--back" aria-hidden>
              <span className="cultivation-scene__qi-flow cultivation-scene__qi-flow--shoulder-left" />
              <span className="cultivation-scene__qi-flow cultivation-scene__qi-flow--shoulder-right" />
              <span className="cultivation-scene__qi-flow cultivation-scene__qi-flow--waist-back" />
            </div>
          )}

          <img
            className="cultivation-scene__spirit-img"
            src={meditationImage}
            alt={gender === 'male' ? 'Nam tu si dang ngoi thien' : 'Nhan vat dang ngoi thien'}
            draggable={false}
          />

          {cultivating && (
            <>
              <div className="cultivation-scene__qi-flows cultivation-scene__qi-flows--front" aria-hidden>
                <span className="cultivation-scene__qi-flow cultivation-scene__qi-flow--chest" />
                <span className="cultivation-scene__qi-flow cultivation-scene__qi-flow--knee-left" />
                <span className="cultivation-scene__qi-flow cultivation-scene__qi-flow--knee-right" />
                <span className="cultivation-scene__qi-flow cultivation-scene__qi-flow--ground" />
              </div>

              <div className="cultivation-scene__qi-stream" aria-hidden>
                <span className="cultivation-scene__qi" />
                <span className="cultivation-scene__qi cultivation-scene__qi--2" />
                <span className="cultivation-scene__qi cultivation-scene__qi--3" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
