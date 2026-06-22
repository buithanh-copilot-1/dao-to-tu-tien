import { useState } from 'react';
import type { GameItem, Player, PlayerStats } from '@/types/game';
import { Modal, GameButton, AncientIcon } from '@/components';
import { getCategoryLabel, getRarityLabel, isItemEquipped } from '@/systems/inventory';
import { STAT_META } from '@/utils/stats';
import { formatNumber } from '@/utils/format';

interface ItemDetailModalProps {
  item: GameItem;
  player: Player;
  onClose: () => void;
  onEquip: () => void;
  onUnequip: () => void;
  onUse: () => void;
  onSell: (qty: number) => void;
  onToggleLock: () => void;
}

export function ItemDetailModal({
  item,
  player,
  onClose,
  onEquip,
  onUnequip,
  onUse,
  onSell,
  onToggleLock,
}: ItemDetailModalProps) {
  const equipped = isItemEquipped(player, item.id);
  const [sellQty, setSellQty] = useState(1);

  const sellable = !equipped && !item.locked;
  const maxQty = item.quantity;
  const clamp = (q: number) => Math.max(1, Math.min(maxQty, q));
  const unitPrice = item.sellPrice ?? 0;

  return (
    <Modal onClose={onClose} footer={
      <div className="item-modal__actions">
        {item.category === 'equipment' && !equipped && (
          <GameButton variant="primary" onClick={onEquip}>Trang bị</GameButton>
        )}
        {equipped && (
          <GameButton variant="secondary" onClick={onUnequip}>Tháo xuống</GameButton>
        )}
        {item.category === 'pill' && (
          <GameButton variant="primary" onClick={onUse}>Phục dụng</GameButton>
        )}
        {sellable && (
          <GameButton variant="claim" onClick={() => onSell(sellQty)}>
            Bán ({formatNumber(unitPrice * sellQty)})
          </GameButton>
        )}
        <button
          type="button"
          className={`icon-seal ${item.locked ? 'icon-seal--cinnabar' : ''}`}
          onClick={onToggleLock}
          title={item.locked ? 'Mở khóa' : 'Khóa'}
        >
          <AncientIcon name={item.locked ? 'lock' : 'unlock'} size={18} />
        </button>
      </div>
    }>
      <div className="item-modal">
        <div className={`item-modal__portrait item-modal__portrait--${item.rarity}`}>
          <span className="item-modal__icon">{item.icon}</span>
          {item.enhance !== undefined && item.enhance > 0 && (
            <span className="item-modal__enhance">+{item.enhance}</span>
          )}
        </div>

        <div className={`item-modal__name item-modal__name--${item.rarity}`}>{item.name}</div>
        <div className="item-modal__meta">
          <span className={`item-modal__rarity item-modal__rarity--${item.rarity}`}>
            {getRarityLabel(item.rarity)}
          </span>
          <span className="item-modal__dot">·</span>
          <span>{getCategoryLabel(item.category)}</span>
          {item.quantity > 1 && <><span className="item-modal__dot">·</span><span>×{item.quantity}</span></>}
        </div>

        {item.stats && (
          <div className="item-modal__stats">
            {(Object.entries(item.stats) as [keyof PlayerStats, number][]).map(([k, v]) => (
              <div key={k} className="item-modal__stat">
                <span className="item-modal__stat-name">
                  <AncientIcon name={STAT_META[k].icon} size={13} /> {STAT_META[k].label}
                </span>
                <span className="item-modal__stat-val">+{formatNumber(v)}</span>
              </div>
            ))}
          </div>
        )}

        {sellable && maxQty > 1 && (
          <div className="item-modal__stepper">
            <span className="item-modal__stepper-label">Số lượng bán</span>
            <div className="item-modal__stepper-ctrl">
              <button type="button" className="icon-seal" onClick={() => setSellQty((q) => clamp(q - 1))}>
                <AncientIcon name="minus" size={16} />
              </button>
              <span className="item-modal__stepper-val">{sellQty}</span>
              <button type="button" className="icon-seal" onClick={() => setSellQty((q) => clamp(q + 1))}>
                <AncientIcon name="plus" size={16} />
              </button>
              <button type="button" className="item-modal__stepper-max" onClick={() => setSellQty(maxQty)}>
                Tất cả
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
