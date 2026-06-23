import { useEffect, useState } from 'react';
import type { GameItem, Player, PlayerStats } from '@/types/game';
import { Modal, GameButton, AncientIcon, ItemIcon, RARITY_FRAMES } from '@/components';
import { EquipCompareModal } from '@/components/game/EquipCompareModal';
import { getCategoryLabel, isItemEquipped } from '@/systems/inventory';
import { getEnhancePreview, getMaxEnhanceLevel } from '@/data/enhancement';
import { getRarityTierLabel } from '@/data/rarity';
import { calcEquipPowerDelta, getItemEnhancedStats, STAT_META } from '@/utils/stats';
import { formatNumber } from '@/utils/format';
import { EQUIP_SLOT_LABELS } from '@/systems/equipment';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import { ItemSourcePanel } from '@/components/game/ItemSourcePanel';

interface ItemDetailModalProps {
  item: GameItem;
  player: Player;
  onClose: () => void;
  onEquip: () => void;
  onUnequip: () => void;
  onUse: () => void;
  onSell: (qty: number) => void;
  onToggleLock: () => void;
  onEnhance?: () => void;
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
  onEnhance,
}: ItemDetailModalProps) {
  const equipped = isItemEquipped(player, item.id);
  const [showCompare, setShowCompare] = useState(false);
  const [sellQty, setSellQty] = useState(1);
  const enhanceLevel = item.enhance ?? 0;
  const enhancedStats = getItemEnhancedStats(item);
  const preview = item.category === 'equipment' ? getEnhancePreview(item) : null;
  const maxLevel = item.category === 'equipment' ? getMaxEnhanceLevel(item) : 0;
  const atMaxEnhance = enhanceLevel >= maxLevel;
  const powerDelta = item.category === 'equipment' && !equipped ? calcEquipPowerDelta(player, item) : 0;
  const templateDesc = ITEM_TEMPLATES[item.templateId]?.description;

  const sellable = !equipped && !item.locked;
  const maxQty = item.quantity;
  const clamp = (q: number) => Math.max(1, Math.min(maxQty, q));
  const unitPrice = item.sellPrice ?? 0;
  const sellBlockReason = equipped
    ? 'Tháo trang bị trước khi bán.'
    : item.locked
      ? 'Mở khóa vật phẩm trước khi bán.'
      : null;

  useEffect(() => {
    setSellQty((q) => Math.max(1, Math.min(item.quantity, q)));
  }, [item.id, item.quantity]);

  const statKeys = item.stats
    ? (Object.keys(item.stats) as (keyof PlayerStats)[]).filter((k) => (item.stats![k] ?? 0) > 0)
    : [];

  const handleEquipClick = () => {
    if (item.category === 'equipment' && !equipped) {
      setShowCompare(true);
      return;
    }
    onEquip();
  };

  if (showCompare && item.category === 'equipment') {
    return (
      <EquipCompareModal
        player={player}
        item={item}
        onCancel={() => setShowCompare(false)}
        onConfirm={() => {
          onEquip();
          onClose();
        }}
      />
    );
  }

  return (
    <Modal
      onClose={onClose}
      panelClassName="modal-panel--item-scroll"
      footer={
        <div className="item-modal__actions">
          {item.category === 'equipment' && !equipped && (
            <GameButton variant="primary" onClick={handleEquipClick}>Trang bị</GameButton>
          )}
          {equipped && (
            <GameButton variant="secondary" onClick={onUnequip}>Tháo xuống</GameButton>
          )}
          {item.category === 'equipment' && onEnhance && !atMaxEnhance && (
            <GameButton variant="claim" onClick={onEnhance}>
              Cường hóa +{enhanceLevel}
            </GameButton>
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
      }
    >
      <div className="item-modal item-modal--scroll">
        <div className={`item-modal__portrait item-modal__portrait--${item.rarity}`}>
          <ItemIcon icon={item.icon} className="item-modal__icon" />
          <img className="item-modal__frame" src={RARITY_FRAMES[item.rarity]} alt="" aria-hidden draggable={false} />
          {enhanceLevel > 0 && (
            <span className="item-modal__enhance">+{enhanceLevel}</span>
          )}
        </div>

        <div className={`item-modal__name item-modal__name--${item.rarity}`}>{item.name}</div>
        <div className="item-modal__meta">
          <span className={`item-modal__rarity item-modal__rarity--${item.rarity}`}>
            {getRarityTierLabel(item.rarity)}
          </span>
          <span className="item-modal__dot">·</span>
          <span>{getCategoryLabel(item.category)}</span>
          {item.slot && (
            <><span className="item-modal__dot">·</span><span>{EQUIP_SLOT_LABELS[item.slot].label}</span></>
          )}
          {item.quantity > 1 && <><span className="item-modal__dot">·</span><span>×{item.quantity}</span></>}
          {item.category === 'equipment' && (
            <><span className="item-modal__dot">·</span><span>+{enhanceLevel}/{maxLevel}</span></>
          )}
        </div>

        {powerDelta !== 0 && !equipped && (
          <p className={`item-modal__power-delta ${powerDelta > 0 ? 'item-modal__power-delta--up' : 'item-modal__power-delta--down'}`}>
            <AncientIcon name="flame" size={13} className="anc-icon--power" />
            Lực chiến {powerDelta > 0 ? '+' : ''}{formatNumber(powerDelta)}
          </p>
        )}

        {templateDesc && (
          <p className="item-modal__desc">{templateDesc}</p>
        )}

        {(equipped || item.locked) && (
          <div className="item-modal__badges">
            {equipped && <span className="item-modal__status">Đang mặc</span>}
            {item.locked && <span className="item-modal__status item-modal__status--locked">Đã khóa</span>}
          </div>
        )}

        {statKeys.length > 0 && (
          <div className="item-modal__stats">
            <div className="item-modal__stats-head">Chỉ số {enhanceLevel > 0 ? 'đã cường hóa' : 'cơ bản'}</div>
            {statKeys.map((k) => {
              const base = item.stats![k] ?? 0;
              const current = enhancedStats[k] ?? base;
              const next = preview?.nextStats[k];

              return (
                <div key={k} className="item-modal__stat">
                  <span className="item-modal__stat-name">
                    <AncientIcon name={STAT_META[k].icon} size={13} /> {STAT_META[k].label}
                  </span>
                  <span className="item-modal__stat-val">
                    +{formatNumber(current)}
                    {enhanceLevel > 0 && base !== current && (
                      <em className="item-modal__stat-base"> ({formatNumber(base)})</em>
                    )}
                    {!atMaxEnhance && next !== undefined && next > current && (
                      <em className="item-modal__stat-next"> → +{formatNumber(next)}</em>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {preview && !atMaxEnhance && (
          <div className="item-modal__enhance-info">
            Cường hóa tiếp: {preview.successRate}% thành công ·
            {' '}{formatNumber(preview.cost.gold)} vàng · {formatNumber(preview.cost.crystal)} linh thạch
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

        {sellBlockReason && (
          <p className="item-modal__hint">{sellBlockReason}</p>
        )}

        <ItemSourcePanel templateId={item.templateId} onNavigate={onClose} />
      </div>
    </Modal>
  );
}
