import { AncientIcon } from './AncientIcon';
import { ItemIcon } from './ItemIcon';
import type { Rarity } from '@/types/game';
import { getRarityStarCount } from '@/data/rarity';
import frameCommon from '@/assets/items/frame_common.png';
import frameUncommon from '@/assets/items/frame_uncommon.png';
import frameRare from '@/assets/items/frame_rare.png';
import frameEpic from '@/assets/items/frame_epic.png';
import frameLegendary from '@/assets/items/frame_legendary.png';
import frameMythic from '@/assets/items/frame_mythic.png';

export const RARITY_FRAMES: Record<Rarity, string> = {
  common: frameCommon,
  uncommon: frameUncommon,
  rare: frameRare,
  epic: frameEpic,
  legendary: frameLegendary,
  mythic: frameMythic,
};

interface ItemSlotProps {
  icon?: string;
  rarity?: Rarity;
  enhance?: number;
  quantity?: number;
  locked?: boolean;
  equipped?: boolean;
  stars?: number;
  empty?: boolean;
  size?: 'sm' | 'lg';
  onClick?: () => void;
}

export function ItemSlot({
  icon,
  rarity = 'common',
  enhance,
  quantity,
  locked,
  equipped,
  stars,
  empty,
  size = 'sm',
  onClick,
}: ItemSlotProps) {
  const starCount = stars ?? (size === 'lg' && !empty ? getRarityStarCount(rarity) : 0);

  return (
    <div
      className={[
        'item-slot',
        `item-slot--${size}`,
        empty ? 'item-slot--empty' : `item-slot--${rarity}`,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {!empty && icon && <ItemIcon icon={icon} className="item-slot__icon" />}
      {!empty && <img className="item-slot__frame" src={RARITY_FRAMES[rarity]} alt="" aria-hidden draggable={false} />}
      {enhance !== undefined && enhance > 0 && (
        <span className="item-slot__enhance">+{enhance}</span>
      )}
      {quantity !== undefined && quantity > 1 && (
        <span className="item-slot__quantity">{quantity}</span>
      )}
      {locked && (
        <span className="item-slot__lock">
          <AncientIcon name="lock" size={10} />
        </span>
      )}
      {equipped && (
        <span className="item-slot__equipped">
          <AncientIcon name="shield" size={8} />
          <span>Mặc</span>
        </span>
      )}
      {starCount > 0 && (
        <div className="item-slot__stars">
          {Array.from({ length: starCount }).map((_, i) => (
            <span key={i} className="item-slot__star" />
          ))}
        </div>
      )}
    </div>
  );
}

interface ItemGridProps {
  items: ItemSlotProps[];
  columns?: 4 | 5 | 6;
}

export function ItemGrid({ items, columns = 6 }: ItemGridProps) {
  return (
    <div className={`item-grid item-grid--${columns}`}>
      {items.map((item, i) => (
        <ItemSlot key={i} {...item} />
      ))}
    </div>
  );
}

interface EquipSlotProps {
  label: string;
  icon: string;
  enhance?: number;
  stars?: number;
}

export function EquipSlot({ label, icon, enhance, stars }: EquipSlotProps) {
  return (
    <div className="equip-slot">
      <span className="equip-slot__label">{label}</span>
      <ItemIcon icon={icon} className="equip-slot__icon" />
      {enhance !== undefined && enhance > 0 && <span className="equip-slot__enhance">+{enhance}</span>}
      {stars !== undefined && stars > 0 && (
        <div className="equip-slot__stars">
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i} className="equip-slot__star" />
          ))}
        </div>
      )}
    </div>
  );
}
