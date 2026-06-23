import type { ReactNode } from 'react';
import type { EquipmentMap, GameItem, Player } from '@/types/game';
import { RARITY_META } from '@/data/rarity';
import { EQUIP_SLOTS, EQUIP_SLOT_LABELS } from '@/systems/equipment';
import { getItemByEquipSlot } from '@/utils/stats';
import { ItemSlot } from '../common/ItemSlot';
import { ItemIcon } from '../common/ItemIcon';
import { getRarityStarCount } from '@/data/rarity';

interface EquipmentBoardProps {
  player: Player;
  onSlotClick?: (slot: keyof EquipmentMap, item?: GameItem) => void;
  selectedSlot?: keyof EquipmentMap;
  compact?: boolean;
  center?: ReactNode;
}

const LEFT_SLOTS: (keyof EquipmentMap)[] = ['weapon', 'armor', 'bracer', 'boots'];
const RIGHT_SLOTS: (keyof EquipmentMap)[] = ['treasure', 'belt', 'ring', 'pendant'];

const SLOT_CLASS: Record<keyof EquipmentMap, string> = {
  treasure: 'equip-board__cell--treasure',
  weapon: 'equip-board__cell--weapon',
  armor: 'equip-board__cell--armor',
  bracer: 'equip-board__cell--bracer',
  boots: 'equip-board__cell--boots',
  ring: 'equip-board__cell--ring',
  belt: 'equip-board__cell--belt',
  pendant: 'equip-board__cell--pendant',
};

function renderEquipCell(
  player: Player,
  slot: keyof EquipmentMap,
  onSlotClick: EquipmentBoardProps['onSlotClick'],
  selectedSlot?: keyof EquipmentMap,
) {
  const item = getItemByEquipSlot(player, slot);
  const meta = EQUIP_SLOT_LABELS[slot];
  const active = selectedSlot === slot;

  return (
    <button
      key={slot}
      type="button"
      className={`equip-board__cell ${SLOT_CLASS[slot]} ${active ? 'equip-board__cell--active' : ''} ${item ? 'equip-board__cell--filled' : ''}`}
      onClick={() => onSlotClick?.(slot, item)}
      aria-label={meta.label}
    >
      <span className="equip-board__slot-label">{meta.label}</span>
      {item ? (
        <ItemSlot
          icon={item.icon}
          rarity={item.rarity}
          enhance={item.enhance}
          stars={getRarityStarCount(item.rarity)}
          size="lg"
        />
      ) : (
        <ItemIcon icon={meta.icon} className="equip-board__empty-icon" />
      )}
    </button>
  );
}

export function EquipmentBoard({
  player,
  onSlotClick,
  selectedSlot,
  compact = false,
  center,
}: EquipmentBoardProps) {
  if (center) {
    return (
      <div className={`equip-board equip-board--sides ${compact ? 'equip-board--compact' : ''}`}>
        <div className="equip-board__sides">
          <div className="equip-board__col equip-board__col--left">
            {LEFT_SLOTS.map((slot) => renderEquipCell(player, slot, onSlotClick, selectedSlot))}
          </div>
          <div className="equip-board__center">{center}</div>
          <div className="equip-board__col equip-board__col--right">
            {RIGHT_SLOTS.map((slot) => renderEquipCell(player, slot, onSlotClick, selectedSlot))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`equip-board ${compact ? 'equip-board--compact' : ''}`}>
      <div className="equip-board__frame equip-board__frame--grid">
        {EQUIP_SLOTS.map((slot) => renderEquipCell(player, slot, onSlotClick, selectedSlot))}
        <div className="equip-board__center-placeholder" aria-hidden />
      </div>
    </div>
  );
}

interface EquipItemListProps {
  player: Player;
  selectedId?: string;
  onSelect: (item: GameItem) => void;
}

export function EquipItemList({ player, selectedId, onSelect }: EquipItemListProps) {
  const items = EQUIP_SLOTS
    .map((slot) => getItemByEquipSlot(player, slot))
    .filter((i): i is GameItem => !!i);

  if (items.length === 0) {
    return <p className="equip-list__empty">Chưa trang bị vật phẩm nào</p>;
  }

  return (
    <div className="equip-list">
      {items.map((item) => {
        const slot = item.slot!;
        const meta = EQUIP_SLOT_LABELS[slot];
        const active = item.id === selectedId;

        return (
          <button
            key={item.id}
            type="button"
            className={`equip-list__item ${active ? 'equip-list__item--active' : ''}`}
            onClick={() => onSelect(item)}
          >
            <ItemIcon icon={item.icon} className="equip-list__icon" />
            <div className="equip-list__info">
              <span className={`equip-list__name equip-list__name--${item.rarity}`}>{item.name}</span>
              <span className="equip-list__slot">{meta.label} · {RARITY_META[item.rarity].shortLabel}</span>
            </div>
            <span className="equip-list__level">+{item.enhance ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
