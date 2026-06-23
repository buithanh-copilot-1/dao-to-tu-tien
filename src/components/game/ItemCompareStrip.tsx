import { AncientIcon, ItemIcon } from '@/components';
import type { GameItem, Player } from '@/types/game';
import { getItemByEquipSlot, calcEquipPowerDelta } from '@/utils/stats';
import { formatNumber } from '@/utils/format';

interface ItemCompareStripProps {
  player: Player;
  item: GameItem;
}

export function ItemCompareStrip({ player, item }: ItemCompareStripProps) {
  if (item.category !== 'equipment' || !item.slot) return null;

  const equipped = getItemByEquipSlot(player, item.slot);
  if (!equipped || equipped.id === item.id) return null;

  const delta = calcEquipPowerDelta(player, item);
  const positive = delta >= 0;

  return (
    <div className="item-compare">
      <div className="item-compare__side">
        <span className="item-compare__tag">Đang mặc</span>
        <ItemIcon icon={equipped.icon} className="item-compare__icon" />
        <span className="item-compare__name">{equipped.name}</span>
        <span className="item-compare__enhance">+{equipped.enhance ?? 0}</span>
      </div>

      <div className={`item-compare__delta ${positive ? 'item-compare__delta--up' : 'item-compare__delta--down'}`}>
        <AncientIcon name="flame" size={14} className="anc-icon--power" />
        <span>{positive ? '+' : ''}{formatNumber(delta)}</span>
      </div>

      <div className="item-compare__side item-compare__side--new">
        <span className="item-compare__tag">Mới</span>
        <ItemIcon icon={item.icon} className="item-compare__icon" />
        <span className="item-compare__name">{item.name}</span>
        <span className="item-compare__enhance">+{item.enhance ?? 0}</span>
      </div>
    </div>
  );
}
