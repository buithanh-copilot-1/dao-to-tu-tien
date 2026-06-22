import { useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageTitle,
  TabBar,
  ItemGrid,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { ItemDetailModal } from '@/components/game/ItemDetailModal';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { filterInventory, countUsedSlots } from '@/systems/inventory';
import type { GameItem } from '@/types/game';

const INVENTORY_TABS = [
  { id: 'all', label: 'Toàn bộ' },
  { id: 'equip', label: 'Trang bị' },
  { id: 'item', label: 'Vật phẩm' },
  { id: 'pill', label: 'Đan dược' },
  { id: 'other', label: 'Khác' },
];

export function InventoryPage() {
  const player = useGameStore((s) => s.player)!;
  const sortInventory = useGameStore((s) => s.sortInventory);
  const expandInventory = useGameStore((s) => s.expandInventory);
  const equipItem = useGameStore((s) => s.equipItem);
  const unequipItem = useGameStore((s) => s.unequipItem);
  const useItem = useGameStore((s) => s.useItem);
  const sellItem = useGameStore((s) => s.sellItem);
  const toggleItemLock = useGameStore((s) => s.toggleItemLock);
  const { activeNav, navItems, handleNav } = useGameNav();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);

  const filtered = filterInventory(player, activeTab);
  const used = countUsedSlots(player);
  const capacityPct = Math.min(100, Math.round((used / player.inventoryCapacity) * 100));
  const emptySlots = Math.max(0, player.inventoryCapacity - used);
  const gridItems = [
    ...filtered.map((item) => ({
      icon: item.icon,
      rarity: item.rarity,
      enhance: item.enhance,
      quantity: item.quantity,
      locked: item.locked,
      onClick: () => setSelectedItem(item),
    })),
    ...Array.from({ length: Math.min(emptySlots, 30) }, () => ({ empty: true as const })),
  ];

  const handleUnequip = () => {
    if (!selectedItem?.slot) return;
    unequipItem(selectedItem.slot);
    setSelectedItem(null);
  };

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageTitle title="Túi đồ" showOrnament />

          <TabBar tabs={INVENTORY_TABS} activeId={activeTab} onChange={setActiveTab} variant="category" />

          <div className="inv-scroll">
            <ItemGrid items={gridItems} columns={6} />
          </div>

          <div className="inv-toolbar">
            <div className="inv-capacity">
              <div className="inv-capacity__head">
                <span className="inv-capacity__label">
                  <AncientIcon name="bag" size={13} /> Càn Khôn Túi
                </span>
                <span className="inv-capacity__count">{used}/{player.inventoryCapacity}</span>
              </div>
              <div className="inv-capacity__bar">
                <div className="inv-capacity__fill" style={{ width: `${capacityPct}%` }} />
              </div>
            </div>

            <button type="button" className="icon-seal inv-tool" onClick={sortInventory} title="Sắp xếp">
              <AncientIcon name="sort" size={18} />
            </button>
            <button type="button" className="icon-seal inv-tool" onClick={expandInventory} title="Mở rộng +10 ô">
              <AncientIcon name="plus" size={18} />
            </button>
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>

        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            player={player}
            onClose={() => setSelectedItem(null)}
            onEquip={() => { equipItem(selectedItem.id); setSelectedItem(null); }}
            onUnequip={handleUnequip}
            onUse={() => { useItem(selectedItem.id); setSelectedItem(null); }}
            onSell={(qty) => { sellItem(selectedItem.id, qty); setSelectedItem(null); }}
            onToggleLock={() => toggleItemLock(selectedItem.id)}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
