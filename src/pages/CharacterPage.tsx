import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageTitle,
  TabBar,
  GamePanel,
  GameButton,
  AncientIcon,
  ItemIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { SpiritPortrait } from '@/components/game/SpiritPortrait';
import { EquipmentBoard } from '@/components/game/EquipmentBoard';
import { EquipmentStatPanel } from '@/components/game/EquipmentStatPanel';
import { ItemDetailModal } from '@/components/game/ItemDetailModal';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { DEFAULT_ELEMENTS } from '@/components';
import { calcDisplayStats, calcCombatPower, STAT_META } from '@/utils/stats';
import type { EquipmentMap, GameItem, PlayerStats } from '@/types/game';
import { formatNumber } from '@/utils/format';

export function CharacterPage() {
  const player = useGameStore((s) => s.player)!;
  const unequipItem = useGameStore((s) => s.unequipItem);
  const equipItem = useGameStore((s) => s.equipItem);
  const sellItem = useGameStore((s) => s.sellItem);
  const useItem = useGameStore((s) => s.useItem);
  const toggleItemLock = useGameStore((s) => s.toggleItemLock);
  const { activeNav, navItems, handleNav, goWithFrom } = useGameNav();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') ?? 'stats');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const elementInfo = DEFAULT_ELEMENTS.find((e) => e.id === player.element);
  const displayStats = calcDisplayStats(player);
  const combatPower = calcCombatPower(player);
  const selectedItem = selectedItemId ? player.inventory.find((item) => item.id === selectedItemId) ?? null : null;

  const handleSlotClick = (_slot: keyof EquipmentMap, item?: GameItem) => {
    if (item) setSelectedItemId(item.id);
  };

  const handleUnequip = () => {
    if (!selectedItem?.slot) return;
    unequipItem(selectedItem.slot);
    setSelectedItemId(null);
  };

  return (
    <GameFrame>
      <GameScreen className="game-screen--character">
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="character-body">
          <PageTitle title="Nhân vật" showOrnament />

          {tab === 'stats' && (
            <div className="char-hero">
              <SpiritPortrait gender={player.gender} element={player.element} size="md" />
              <div className="char-hero__info">
                <div className="char-hero__name">{player.name}</div>
                <div className="char-hero__meta">
                  {elementInfo?.icon && <ItemIcon icon={elementInfo.icon} className="char-element-icon" />}
                  Linh căn {elementInfo?.name}
                </div>
                <div className="char-hero__power">
                  <AncientIcon name="flame" size={14} className="anc-icon--power" />
                  {formatNumber(combatPower)}
                </div>
              </div>
            </div>
          )}

          <TabBar
            tabs={[
              { id: 'stats', label: 'Thông tin' },
              { id: 'equip', label: 'Trang bị' },
            ]}
            activeId={tab}
            onChange={setTab}
          />

          {tab === 'stats' && (
            <GamePanel title="Thuộc tính" className="char-stats-panel">
              <div className="character-stats">
                <div className="character-stats__power">
                  <span className="character-stats__power-label">
                    <AncientIcon name="flame" size={15} className="anc-icon--power" /> Lực chiến
                  </span>
                  <span className="character-stats__power-value glow-orange">{formatNumber(combatPower)}</span>
                </div>
                <div className="character-stats__grid">
                  {(Object.entries(displayStats) as [keyof PlayerStats, number][]).map(([key, val]) => (
                    <div key={key} className="character-stats__row">
                      <span className="character-stats__label">
                        <AncientIcon name={STAT_META[key].icon} size={13} /> {STAT_META[key].label}
                      </span>
                      <span className="character-stats__value">{formatNumber(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="char-stats-panel__links">
                <GameButton variant="secondary" onClick={() => goWithFrom('/realm')}>
                  <AncientIcon name="realm" size={14} className="anc-icon--gold" /> Cảnh giới
                </GameButton>
                <GameButton variant="secondary" onClick={() => goWithFrom('/spirit-root')}>
                  <AncientIcon name="sparkle" size={14} className="anc-icon--jade" /> Linh căn
                </GameButton>
                <GameButton variant="secondary" onClick={() => goWithFrom('/mount')}>
                  <AncientIcon name="mountain" size={14} className="anc-icon--gold" /> Tọa kỵ
                </GameButton>
                <GameButton variant="secondary" disabled title="Sắp ra mắt">
                  <AncientIcon name="heart" size={14} /> Tiên duyên
                </GameButton>
                <GameButton variant="secondary" disabled title="Sắp ra mắt">
                  <AncientIcon name="gem" size={14} /> Pháp bảo
                </GameButton>
              </div>
            </GamePanel>
          )}

          {tab === 'equip' && (
            <div className="char-equip">
              <EquipmentBoard
                player={player}
                onSlotClick={handleSlotClick}
                center={
                  <div className="char-equip__center">
                    <div className="char-equip__power">
                      <span className="char-equip__power-label">Lực chiến</span>
                      <span className="char-equip__power-value">{formatNumber(combatPower)}</span>
                    </div>
                    <SpiritPortrait gender={player.gender} element={player.element} size="lg" paused />
                    <div className="char-equip__name">{player.name}</div>
                    <div className="char-equip__meta">
                      {elementInfo?.icon && <ItemIcon icon={elementInfo.icon} className="char-element-icon" />}
                      Linh căn {elementInfo?.name}
                    </div>
                    <div className="char-equip__quick">
                      <button type="button" className="char-equip__quick-btn" disabled>
                        Ngoại hình · Sắp ra
                      </button>
                      <button type="button" className="char-equip__quick-btn" disabled>
                        Danh hiệu · Sắp ra
                      </button>
                      <button type="button" className="char-equip__quick-btn" disabled>
                        Trận pháp · Sắp ra
                      </button>
                    </div>
                  </div>
                }
              />

              <EquipmentStatPanel player={player} />

              <div className="char-equip__actions">
                <GameButton variant="primary" onClick={() => goWithFrom('/enhance')}>
                  <AncientIcon name="sparkle" size={15} /> Cường hóa
                </GameButton>
                <GameButton variant="secondary" onClick={() => goWithFrom('/inventory')}>
                  <AncientIcon name="bag" size={15} /> Túi đồ
                </GameButton>
              </div>
            </div>
          )}
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>

        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            player={player}
            onClose={() => setSelectedItemId(null)}
            onEquip={() => { equipItem(selectedItem.id); setSelectedItemId(null); }}
            onUnequip={handleUnequip}
            onUse={() => { useItem(selectedItem.id); setSelectedItemId(null); }}
            onSell={(qty) => { sellItem(selectedItem.id, qty); setSelectedItemId(null); }}
            onToggleLock={() => toggleItemLock(selectedItem.id)}
            onEnhance={() => {
              setSelectedItemId(null);
              goWithFrom(`/enhance?item=${selectedItem.id}`);
            }}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
