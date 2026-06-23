import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  GamePanel,
  GameButton,
  DEFAULT_ELEMENTS,
  ItemIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useRedirectBack } from '@/hooks/useRedirectBack';
import type { ElementType } from '@/types/game';
import { SECTS } from '@/data/sects';
import {
  getSpiritRootStatMultiplier,
  getSpiritRootUpgradeCost,
  SPIRIT_ROOT_MAX,
} from '@/data/spiritRoot';
import { getSpiritRootLevel } from '@/systems/spiritRoot';
import { formatNumber } from '@/utils/format';

const ELEMENT_NAME: Record<ElementType, string> = {
  metal: 'Kim', wood: 'Mộc', water: 'Thủy', fire: 'Hỏa', earth: 'Thổ',
};

const GENERATES: Record<ElementType, ElementType> = {
  metal: 'water', water: 'wood', wood: 'fire', fire: 'earth', earth: 'metal',
};

const OVERCOMES: Record<ElementType, ElementType> = {
  metal: 'wood', wood: 'earth', earth: 'water', water: 'fire', fire: 'metal',
};

export function SpiritRootPage() {
  const player = useGameStore((s) => s.player)!;
  const upgradeSpiritRoot = useGameStore((s) => s.upgradeSpiritRoot);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useRedirectBack('/character');

  const el = player.element;
  const info = DEFAULT_ELEMENTS.find((e) => e.id === el);
  const matchedSect = SECTS.find((s) => s.element === el);
  const level = getSpiritRootLevel(player);
  const atMax = level >= SPIRIT_ROOT_MAX;
  const cost = getSpiritRootUpgradeCost(level);
  const elemBonus = Math.round((getSpiritRootStatMultiplier(level) - 1) * 100);

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Linh Căn" showOrnament onBack={goBack} />

          <GamePanel title="Linh căn của ngươi">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {info?.icon && <ItemIcon icon={info.icon} className="spirit-root__icon" />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, color: 'var(--gold-light)' }}>
                  {ELEMENT_NAME[el]} Linh Căn · Cấp {level}/{SPIRIT_ROOT_MAX}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {info?.description}
                </div>
                <div style={{ fontSize: 11, color: 'var(--green-stat)', marginTop: 6 }}>
                  +{elemBonus}% chỉ số ngũ hành
                </div>
              </div>
            </div>
          </GamePanel>

          <GamePanel title="Tu luyện linh căn">
            {atMax ? (
              <div style={{ fontSize: 12, color: 'var(--text-gold)', textAlign: 'center' }}>
                Linh căn đã viên mãn, ngũ hành hội tụ đỉnh phong.
              </div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.7 }}>
                  Nâng cấp linh căn tăng chỉ số hệ {ELEMENT_NAME[el]} vĩnh viễn, đồng thời tăng lực chiến.
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                  Chi phí: {formatNumber(cost.gold)} vàng · {formatNumber(cost.crystal)} linh thạch
                </div>
                <GameButton variant="primary" fullWidth onClick={upgradeSpiritRoot}>
                  Nâng cấp linh căn
                </GameButton>
              </>
            )}
          </GamePanel>

          <GamePanel title="Ngũ hành tương sinh tương khắc">
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
              <div>
                <span style={{ color: 'var(--green-stat)' }}>Tương sinh:</span>{' '}
                {ELEMENT_NAME[el]} sinh {ELEMENT_NAME[GENERATES[el]]} — tu luyện cùng đạo hữu hệ{' '}
                {ELEMENT_NAME[GENERATES[el]]} sẽ tương trợ.
              </div>
              <div>
                <span style={{ color: 'var(--red-alert)' }}>Tương khắc:</span>{' '}
                {ELEMENT_NAME[el]} khắc {ELEMENT_NAME[OVERCOMES[el]]} — chiếm thượng phong khi
                đối đầu hệ {ELEMENT_NAME[OVERCOMES[el]]}.
              </div>
            </div>
          </GamePanel>

          {matchedSect && (
            <GamePanel title="Tông môn tương hợp">
              <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>{matchedSect.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                Cùng hệ {ELEMENT_NAME[el]} — bái nhập sẽ phát huy phúc lợi tối đa. {matchedSect.description}
              </div>
            </GamePanel>
          )}
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
