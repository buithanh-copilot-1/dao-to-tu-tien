import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {

  GameFrame,

  GameScreen,

  GameHeader,

  GameBody,

  GameFooter,

  BottomNav,

  PageTitle,
  PageHead,
  TabBar,

  ItemGrid,

  AncientIcon,

} from '@/components';

import { PlayerHeader } from '@/components/game/PlayerHeader';

import { ItemDetailModal } from '@/components/game/ItemDetailModal';

import { useGameStore } from '@/stores/gameStore';

import { useGameNav } from '@/hooks/useGameNav';
import { useRedirectBack } from '@/hooks/useRedirectBack';
import type { RedirectLocationState } from '@/hooks/useRedirectBack';

import { filterInventory, countUsedSlots, isItemEquipped } from '@/systems/inventory';
import { EQUIP_SLOTS } from '@/systems/equipment';
import { getItemByEquipSlot } from '@/utils/stats';



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

  const { activeNav, navItems, handleNav, goWithFrom } = useGameNav();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectFrom = (location.state as RedirectLocationState | null)?.from;
  const { goBack } = useRedirectBack('/character?tab=equip');



  const [activeTab, setActiveTab] = useState('all');

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);



  const filtered = filterInventory(player, activeTab);

  const selectedItem = selectedItemId ? player.inventory.find((item) => item.id === selectedItemId) ?? null : null;

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

      equipped: isItemEquipped(player, item.id),

      onClick: () => setSelectedItemId(item.id),

    })),

    ...Array.from({ length: Math.min(emptySlots, 30) }, () => ({ empty: true as const })),

  ];



  const handleUnequip = () => {

    if (!selectedItem?.slot) return;

    unequipItem(selectedItem.slot);

    setSelectedItemId(null);

  };

  const equippedItems = EQUIP_SLOTS.map((slot) => {
    const item = getItemByEquipSlot(player, slot);
    if (!item) return { empty: true as const };
    return {
      icon: item.icon,
      rarity: item.rarity,
      enhance: item.enhance,
      onClick: () => setSelectedItemId(item.id),
    };
  });



  return (

    <GameFrame>

      <GameScreen className="game-screen--inventory">

        <GameHeader><PlayerHeader /></GameHeader>



        <GameBody className="inventory-body">

          {redirectFrom ? (
            <PageHead title="Túi đồ" showOrnament onBack={goBack} />
          ) : (
            <PageTitle title="Túi đồ" showOrnament />
          )}



          <TabBar tabs={INVENTORY_TABS} activeId={activeTab} onChange={setActiveTab} variant="category" />



          <div className="inv-bag">

            <div className="inv-bag__head">

              <AncientIcon name="bag" size={14} className="anc-icon--gold" />

              <span>Càn Khôn Túi</span>

            </div>



            <div className="inv-equipped">

              <span className="inv-equipped__label">Đang trang bị</span>

              <ItemGrid items={equippedItems} columns={6} />

            </div>



            <div className="inv-bag__scroll">

              <ItemGrid items={gridItems} columns={6} />

            </div>



            <div className="inv-bag__footer">

              <div className="inv-bag__capacity">

                <div className="inv-bag__capacity-row">

                  <span className="inv-bag__capacity-label">Số lượng: {used}/{player.inventoryCapacity}</span>

                  <button

                    type="button"

                    className="inv-bag__expand"

                    onClick={expandInventory}

                    title="Mở rộng +10 ô"

                  >

                    <AncientIcon name="plus" size={12} />

                  </button>

                </div>

                <div className="inv-bag__capacity-bar">

                  <div className="inv-bag__capacity-fill" style={{ width: `${capacityPct}%` }} />

                </div>

              </div>



              <button type="button" className="inv-bag__sort" onClick={sortInventory}>

                <AncientIcon name="sort" size={14} />

                Sắp xếp

              </button>

            </div>

          </div>



          <div className="inv-dock">

            <button

              type="button"

              className="inv-dock__btn"

              disabled

              title="Kho — Sắp ra mắt"

            >

              <AncientIcon name="pagoda" size={16} className="anc-icon--gold" />

              <span>Kho</span>

            </button>

            <button type="button" className="inv-dock__btn" onClick={() => (redirectFrom ? goBack() : navigate('/character?tab=equip'))}>

              <AncientIcon name="shield" size={16} className="anc-icon--jade" />

              <span>Trang bị</span>

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


