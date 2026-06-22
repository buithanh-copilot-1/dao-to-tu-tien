import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  SideMenu,
  LEFT_MENU_ITEMS,
  RIGHT_MENU_ITEMS,
  GamePanel,
  GameButton,
  ProgressBar,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { CultivationAvatar } from '@/components/game/CultivationAvatar';
import { useGameStore, hasClaimableQuests } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { canBreakthrough, isAtPeak } from '@/systems/cultivation';
import { getBreakthroughCost, getRealmLabel, getNextRealmLabel } from '@/data/realms';
import { formatNumber } from '@/utils/format';

export function HomePage() {
  const player = useGameStore((s) => s.player)!;
  const toggleAutoCultivate = useGameStore((s) => s.toggleAutoCultivate);
  const devFastBreakthrough = useGameStore((s) => s.devFastBreakthrough);
  const toggleDevFastBreakthrough = useGameStore((s) => s.toggleDevFastBreakthrough);
  const doBreakthrough = useGameStore((s) => s.doBreakthrough);
  const { activeNav, navItems, handleNav, handleSideMenu } = useGameNav();

  const breakthroughCost = getBreakthroughCost(player.realmId, player.tier);
  const realmLabel = getRealmLabel(player.realmId, player.tier);
  const nextRealmLabel = getNextRealmLabel(player.realmId, player.tier);
  const readyToBreakthrough = canBreakthrough(player);
  const atPeak = isAtPeak(player);
  const claimableQuests = hasClaimableQuests(player);

  const rightMenu = RIGHT_MENU_ITEMS.map((item) => ({
    ...item,
    notify: item.id === 'events' ? claimableQuests : item.notify,
  }));

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <SideMenu items={LEFT_MENU_ITEMS} position="left" onItemClick={handleSideMenu} />
        <SideMenu items={rightMenu} position="right" onItemClick={handleSideMenu} />

        <GameBody className="home-body">
          <CultivationAvatar
            gender={player.gender}
            element={player.element}
            cultivating={player.autoCultivate || devFastBreakthrough}
            realmId={player.realmId}
          />

          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={toggleDevFastBreakthrough}
              style={{
                alignSelf: 'center',
                marginBottom: 4,
                padding: '4px 10px',
                fontSize: 10,
                borderRadius: 4,
                border: `1px solid ${devFastBreakthrough ? 'var(--green-stat)' : 'var(--text-muted)'}`,
                background: devFastBreakthrough ? 'rgba(74, 222, 128, 0.15)' : 'rgba(10,20,40,0.6)',
                color: devFastBreakthrough ? 'var(--green-stat)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              🧪 Test: {devFastBreakthrough ? 'Đột phá/giây ON' : 'Đột phá/giây OFF'}
            </button>
          )}

          <GamePanel title="Đang tu luyện">
            <div className="cultivation-panel">
              <div className="cultivation-panel__rate">
                Tu vi: <span className="cultivation-panel__rate-value">{formatNumber(player.cultivationRate)}/giây</span>
              </div>

              <ProgressBar
                current={player.cultivation}
                max={atPeak ? player.cultivation || 1 : breakthroughCost}
                labelLeft={realmLabel}
                labelRight={atPeak ? 'Đỉnh Phong' : nextRealmLabel}
              />

              <div className="cultivation-panel__actions">
                <button
                  type="button"
                  className="cultivation-panel__side-btn"
                  onClick={toggleAutoCultivate}
                  style={{
                    opacity: player.autoCultivate ? 1 : 0.5,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                  }}
                >
                  <div className="cultivation-panel__side-icon">🔄</div>
                  <span className="cultivation-panel__side-label">
                    {player.autoCultivate ? 'Tự động' : 'Tạm dừng'}
                  </span>
                </button>

                <GameButton
                  variant="primary"
                  notify={readyToBreakthrough && !atPeak}
                  style={{ padding: '12px 40px', fontSize: 16 }}
                  onClick={doBreakthrough}
                  disabled={atPeak}
                >
                  {atPeak ? 'Đỉnh Phong' : 'Đột phá'}
                </GameButton>

                <button
                  type="button"
                  className="cultivation-panel__side-btn"
                  onClick={() => handleSideMenu('secret')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                >
                  <div className="cultivation-panel__side-icon">✨</div>
                  <span className="cultivation-panel__side-label">Bí Cảnh</span>
                </button>
              </div>
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
