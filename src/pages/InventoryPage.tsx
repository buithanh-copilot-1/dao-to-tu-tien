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
  GameButton,
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
  const emptySlots = Math.max(0, player.inventoryCapacity - countUsedSlots(player));
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

          <div style={{ marginTop: 4 }}>
            <ItemGrid items={gridItems} columns={6} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 4px',
            fontSize: 11,
            color: 'var(--text-secondary)',
          }}>
            <span>
              Số lượng: <strong style={{ color: 'var(--text-gold)' }}>{countUsedSlots(player)}/{player.inventoryCapacity}</strong>
              <button type="button" className="currency-item__add" style={{ marginLeft: 6, width: 16, height: 16, fontSize: 12 }} onClick={expandInventory}>+</button>
            </span>
            <GameButton variant="claim" icon="💠" onClick={sortInventory}>
              Sắp xếp
            </GameButton>
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
            onSell={() => { sellItem(selectedItem.id); setSelectedItem(null); }}
            onToggleLock={() => toggleItemLock(selectedItem.id)}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
