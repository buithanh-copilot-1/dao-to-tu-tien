type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

interface ItemSlotProps {
  icon?: string;
  rarity?: Rarity;
  enhance?: number;
  quantity?: number;
  locked?: boolean;
  stars?: number;
  empty?: boolean;
  onClick?: () => void;
}

export function ItemSlot({
  icon,
  rarity = 'common',
  enhance,
  quantity,
  locked,
  stars,
  empty,
  onClick,
}: ItemSlotProps) {
  return (
    <div
      className={`item-slot ${empty ? 'item-slot--empty' : `item-slot--${rarity}`}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {!empty && icon && <span className="item-slot__icon">{icon}</span>}
      {enhance !== undefined && enhance > 0 && (
        <span className="item-slot__enhance">+{enhance}</span>
      )}
      {quantity !== undefined && quantity > 1 && (
        <span className="item-slot__quantity">{quantity}</span>
      )}
      {locked && <span className="item-slot__lock">🔒</span>}
      {stars !== undefined && stars > 0 && (
        <div className="item-slot__stars">
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i}>⭐</span>
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
      <span className="equip-slot__icon">{icon}</span>
      {enhance !== undefined && <span className="equip-slot__enhance">+{enhance}</span>}
      {stars !== undefined && (
        <div className="equip-slot__stars">
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </div>
      )}
    </div>
  );
}
