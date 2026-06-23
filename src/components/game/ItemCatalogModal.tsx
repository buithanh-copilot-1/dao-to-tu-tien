import { useMemo } from 'react';
import type { PlayerStats } from '@/types/game';
import { Modal, GameButton, AncientIcon, ItemIcon, RARITY_FRAMES } from '@/components';
import { ItemSourcePanel } from '@/components/game/ItemSourcePanel';
import { getCategoryLabel } from '@/systems/inventory';
import { EQUIP_SLOT_LABELS } from '@/systems/equipment';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import { getRarityTierLabel } from '@/data/rarity';
import { STAT_META } from '@/utils/stats';
import { formatNumber } from '@/utils/format';

interface ItemCatalogModalProps {
  templateId: string;
  onClose: () => void;
  quantity?: number;
}

export function ItemCatalogModal({ templateId, onClose, quantity }: ItemCatalogModalProps) {
  const template = ITEM_TEMPLATES[templateId];

  const statKeys = useMemo(() => {
    if (!template?.stats) return [];
    return (Object.keys(template.stats) as (keyof PlayerStats)[]).filter(
      (k) => (template.stats![k] ?? 0) > 0,
    );
  }, [template]);

  if (!template) {
    return (
      <Modal onClose={onClose} footer={<GameButton variant="primary" onClick={onClose}>Đóng</GameButton>}>
        <p style={{ textAlign: 'center', padding: 16 }}>Không tìm thấy vật phẩm</p>
      </Modal>
    );
  }

  return (
    <Modal
      onClose={onClose}
      panelClassName="modal-panel--item-scroll"
      footer={<GameButton variant="primary" onClick={onClose}>Đóng</GameButton>}
    >
      <div className="item-modal item-modal--scroll">
        <div className={`item-modal__portrait item-modal__portrait--${template.rarity}`}>
          <ItemIcon icon={template.icon} className="item-modal__icon" />
          <img className="item-modal__frame" src={RARITY_FRAMES[template.rarity]} alt="" aria-hidden draggable={false} />
        </div>

        <div className={`item-modal__name item-modal__name--${template.rarity}`}>{template.name}</div>
        <div className="item-modal__meta">
          <span className={`item-modal__rarity item-modal__rarity--${template.rarity}`}>
            {getRarityTierLabel(template.rarity)}
          </span>
          <span className="item-modal__dot">·</span>
          <span>{getCategoryLabel(template.category)}</span>
          {template.slot && (
            <><span className="item-modal__dot">·</span><span>{EQUIP_SLOT_LABELS[template.slot].label}</span></>
          )}
          {quantity !== undefined && quantity > 0 && (
            <><span className="item-modal__dot">·</span><span>×{quantity}</span></>
          )}
        </div>

        <p className="item-modal__desc">{template.description}</p>

        {statKeys.length > 0 && (
          <div className="item-modal__stats">
            <div className="item-modal__stats-head">Chỉ số cơ bản</div>
            {statKeys.map((k) => (
              <div key={k} className="item-modal__stat">
                <span className="item-modal__stat-name">
                  <AncientIcon name={STAT_META[k].icon} size={13} /> {STAT_META[k].label}
                </span>
                <span className="item-modal__stat-val">+{formatNumber(template.stats![k] ?? 0)}</span>
              </div>
            ))}
          </div>
        )}

        <ItemSourcePanel templateId={templateId} onNavigate={onClose} />
      </div>
    </Modal>
  );
}
