import type { CSSProperties } from 'react';
import type { ElementType, Gender } from '@/types/game';
import { AncientSpiritFigure } from './AncientSpiritFigure';
import { SceneBagua, SceneCloud, SceneCornerBrackets, SceneLotus } from './AncientSceneDecor';
import { ELEMENT_VISUALS } from './SpiritPortrait';

interface CultivationAvatarProps {
  gender: Gender;
  element: ElementType;
  cultivating: boolean;
  realmId: number;
}

export function CultivationAvatar({ gender, element, cultivating, realmId }: CultivationAvatarProps) {
  const colors = ELEMENT_VISUALS[element];
  const auraScale = 1 + realmId * 0.06;

  return (
    <div
      className={`cultivation-scene ${cultivating ? 'cultivation-scene--active' : 'cultivation-scene--paused'}`}
      style={{
        '--element-color': colors.primary,
        '--element-glow': colors.glow,
        '--aura-scale': auraScale,
      } as CSSProperties}
    >
      <div className="cultivation-scene__scroll">
        <SceneCornerBrackets />

        <div className="cultivation-scene__ink-wash" aria-hidden />
        <div className="cultivation-scene__mist cultivation-scene__mist--l" aria-hidden />
        <div className="cultivation-scene__mist cultivation-scene__mist--r" aria-hidden />

        <SceneCloud className="cultivation-scene__cloud cultivation-scene__cloud--tl" />
        <SceneCloud className="cultivation-scene__cloud cultivation-scene__cloud--br" />

        <div className="cultivation-scene__bagua-wrap">
          <SceneBagua active={cultivating} />
        </div>

        <div className="cultivation-scene__lotus-wrap">
          <SceneLotus active={cultivating} />
        </div>

        <div className="cultivation-scene__figure" role="img" aria-label="Đang tu luyện">
          <AncientSpiritFigure
            gender={gender}
            elementColor={colors.primary}
            elementGlow={colors.glow}
            paused={!cultivating}
            size={88}
            className="cultivation-scene__spirit"
          />
          {cultivating && (
            <div className="cultivation-scene__qi-stream" aria-hidden>
              <span className="cultivation-scene__qi">气</span>
              <span className="cultivation-scene__qi cultivation-scene__qi--2">气</span>
              <span className="cultivation-scene__qi cultivation-scene__qi--3">气</span>
            </div>
          )}
        </div>

        <div className="cultivation-scene__seal" aria-hidden>
          {cultivating ? '坐忘' : '凝神'}
        </div>
      </div>

      <div className="cultivation-scene__status">
        <span className="cultivation-scene__status-bracket">〔</span>
        <span className="cultivation-scene__status-text">
          {cultivating ? 'Đang hấp thụ linh khí...' : 'Tạm ngưng tu luyện'}
        </span>
        <span className="cultivation-scene__status-bracket">〕</span>
      </div>

      <p className="cultivation-scene__element-tag">
        {colors.name} linh căn
      </p>
    </div>
  );
}
