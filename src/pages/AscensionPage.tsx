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
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { getRealmLabel } from '@/data/realms';
import { canAscend } from '@/systems/ascension';

export function AscensionPage() {
  const player = useGameStore((s) => s.player)!;
  const ascend = useGameStore((s) => s.ascend);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  const count = player.ascensionCount ?? 0;
  const ready = canAscend(player);

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Phi Thăng" showOrnament onBack={goBack} />

          <GamePanel title="Đạo cơ phi thăng">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="entity-icon">
                <AncientIcon name="realm" size={28} className="anc-icon--power" />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text-gold)' }}>Số lần phi thăng: {count}</div>
                <div style={{ fontSize: 11, color: 'var(--green-stat)' }}>
                  Sức mạnh hiện tại +{count * 10}% vĩnh viễn
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  Sau phi thăng: +{(count + 1) * 10}%
                </div>
              </div>
            </div>
          </GamePanel>

          <GamePanel title="Thiên kiếp">
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Khi đạt đỉnh cảnh giới tối cao, đạo hữu có thể nghênh tiếp thiên kiếp, phá vỡ
              phàm thai mà phi thăng. Cảnh giới trở về <b style={{ color: 'var(--text-gold)' }}>Luyện Khí Kỳ</b>,
              nhưng nhận thêm <b style={{ color: 'var(--green-stat)' }}>+10% toàn bộ chỉ số vĩnh viễn</b>.
              Trang bị, tài nguyên, tông môn, công pháp, thiên phú, linh thú và tọa kỵ đều được giữ nguyên.
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
              Cảnh giới hiện tại: <span style={{ color: 'var(--text-gold)' }}>{getRealmLabel(player.realmId, player.tier)}</span>
            </div>

            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <GameButton variant="hex" disabled={!ready} onClick={ascend}>
                {ready ? 'Nghênh kiếp phi thăng' : 'Chưa đạt đỉnh cảnh giới'}
              </GameButton>
            </div>
          </GamePanel>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
