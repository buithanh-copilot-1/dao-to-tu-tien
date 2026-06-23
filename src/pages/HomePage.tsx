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
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { CultivationAvatar } from '@/components/game/CultivationAvatar';
import { useGameStore, hasClaimableQuests } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { canBreakthrough, getTribulationInfo, isAtPeak } from '@/systems/cultivation';
import { getBreakthroughCost, getRealmLabel, getNextRealmLabel } from '@/data/realms';
import { formatNumber } from '@/utils/format';

function formatRealmStage(label: string): string {
  return label.replace(' - ', ' · ');
}

export function HomePage() {
  const player = useGameStore((s) => s.player)!;
  const toggleAutoCultivate = useGameStore((s) => s.toggleAutoCultivate);
  const devFastBreakthrough = useGameStore((s) => s.devFastBreakthrough);
  const toggleDevFastBreakthrough = useGameStore((s) => s.toggleDevFastBreakthrough);
  const doBreakthrough = useGameStore((s) => s.doBreakthrough);
  const { activeNav, navItems, handleNav, handleSideMenu } = useGameNav();

  const breakthroughCost = getBreakthroughCost(player.realmId, player.tier);
  const atPeak = isAtPeak(player);
  const realmLabel = formatRealmStage(getRealmLabel(player.realmId, player.tier));
  const nextRealmLabel = atPeak
    ? 'Đỉnh Phong'
    : formatRealmStage(getNextRealmLabel(player.realmId, player.tier));
  const readyToBreakthrough = canBreakthrough(player);
  const tribulationInfo = readyToBreakthrough ? getTribulationInfo(player) : null;
  const claimableQuests = hasClaimableQuests(player);

  const rightMenu = RIGHT_MENU_ITEMS.map((item) => ({
    ...item,
    notify: item.id === 'events' ? claimableQuests : item.notify,
  }));

  return (
    <GameFrame>
      <GameScreen className="game-screen--home">
        <GameHeader><PlayerHeader /></GameHeader>

        <SideMenu items={LEFT_MENU_ITEMS} position="left" onItemClick={handleSideMenu} />
        <SideMenu items={rightMenu} position="right" onItemClick={handleSideMenu} />

        <GameBody className="home-body">
          <div className="home-stage">
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
                className="dev-rune home-stage__dev"
                style={{
                  color: devFastBreakthrough ? 'var(--jade-glow)' : 'var(--text-muted)',
                  borderColor: devFastBreakthrough ? 'var(--jade-glow)' : 'var(--text-muted)',
                }}
              >
                <AncientIcon name="gourd" size={14} />
                Luyện đan: {devFastBreakthrough ? 'Đột phá/giây ON' : 'OFF'}
              </button>
            )}
          </div>

          <GamePanel title="Đang tu luyện" className="cultivation-panel-wrap">
            <div className="cultivation-panel">
              <div className="cultivation-panel__stats">
                <p className="cultivation-panel__rate">
                  Tu vi:{' '}
                  <span className="cultivation-panel__rate-value">
                    {formatNumber(player.cultivationRate)}
                  </span>
                  /giây
                </p>
                <button type="button" className="cultivation-panel__boost" aria-label="Tăng tốc tu luyện">
                  <span className="cultivation-panel__boost-icon" aria-hidden="true">
                    !
                  </span>
                  <span className="cultivation-panel__boost-label">Tăng tốc</span>
                </button>
              </div>

              <ProgressBar
                variant="cultivation"
                current={player.cultivation}
                max={atPeak ? player.cultivation || 1 : breakthroughCost}
                labelLeft={realmLabel}
                labelRight={nextRealmLabel}
                displayText={atPeak ? 'Đã đạt đỉnh' : undefined}
              />

              {tribulationInfo && (
                <div className="cultivation-panel__tribulation">
                  <AncientIcon name="bolt" size={14} className="anc-icon--power" />
                  <span>Thiên kiếp: {tribulationInfo.successRate}%</span>
                  <span>Uy áp {formatNumber(tribulationInfo.difficulty)}</span>
                </div>
              )}

              <div className="cultivation-panel__actions">
                <button
                  type="button"
                  className="cultivation-panel__side"
                  onClick={toggleAutoCultivate}
                >
                  <span
                    className={`cultivation-panel__side-icon ${player.autoCultivate ? 'cultivation-panel__side-icon--active' : ''}`}
                  >
                    <AncientIcon name={player.autoCultivate ? 'cycle' : 'pause'} size={24} />
                  </span>
                  <span className="cultivation-panel__side-label">
                    {player.autoCultivate ? 'Tự động' : 'Tạm dừng'}
                  </span>
                </button>

                <GameButton
                  variant="hex"
                  notify={readyToBreakthrough && !atPeak}
                  className={`cultivation-panel__breakthrough ${atPeak ? 'cultivation-panel__breakthrough--peak' : ''}`}
                  onClick={doBreakthrough}
                  disabled={atPeak}
                >
                  {atPeak ? 'Đỉnh Phong' : tribulationInfo ? 'Độ kiếp' : 'Đột phá'}
                </GameButton>

                <button type="button" className="cultivation-panel__side" aria-label="Mảnh Hồn">
                  <span className="cultivation-panel__side-icon">
                    <AncientIcon name="soul" size={24} />
                  </span>
                  <span className="cultivation-panel__side-label">Mảnh Hồn</span>
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
