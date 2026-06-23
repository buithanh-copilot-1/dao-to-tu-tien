import { Modal, GameButton, AncientIcon, ItemIcon, RARITY_FRAMES } from '@/components';
import type { GameItem, Player } from '@/types/game';
import { buildEquipCompare } from '@/utils/stats';
import { getRarityTierLabel } from '@/data/rarity';
import { EQUIP_SLOT_LABELS } from '@/systems/equipment';
import { formatNumber } from '@/utils/format';

interface EquipCompareModalProps {
  player: Player;
  item: GameItem;
  onConfirm: () => void;
  onCancel: () => void;
}

function formatDelta(value: number): string {
  if (value === 0) return '—';
  return `${value > 0 ? '+' : ''}${formatNumber(value)}`;
}

export function EquipCompareModal({ player, item, onConfirm, onCancel }: EquipCompareModalProps) {
  const data = buildEquipCompare(player, item);
  if (!data || !item.slot) return null;

  const slotMeta = EQUIP_SLOT_LABELS[item.slot];
  const powerUp = data.powerDelta >= 0;

  return (
    <Modal
      onClose={onCancel}
      panelClassName="modal-panel--equip-compare"
      footer={
        <div className="equip-compare__actions">
          <GameButton variant="secondary" onClick={onCancel}>Hủy</GameButton>
          <GameButton variant="primary" onClick={onConfirm}>Trang bị</GameButton>
        </div>
      }
    >
      <div className="equip-compare">
        <h2 className="equip-compare__title">So sánh trang bị</h2>
        <p className="equip-compare__slot">
          <ItemIcon icon={slotMeta.icon} className="equip-compare__slot-icon" />
          {slotMeta.label}
        </p>

        <div className={`equip-compare__power ${powerUp ? 'equip-compare__power--up' : 'equip-compare__power--down'}`}>
          <div className="equip-compare__power-block">
            <span className="equip-compare__power-label">Lực chiến hiện tại</span>
            <strong>{formatNumber(data.powerBefore)}</strong>
          </div>
          <span className="equip-compare__power-arrow" aria-hidden>→</span>
          <div className="equip-compare__power-block equip-compare__power-block--after">
            <span className="equip-compare__power-label">Sau khi mặc</span>
            <strong>{formatNumber(data.powerAfter)}</strong>
          </div>
          <div className={`equip-compare__power-delta ${powerUp ? 'equip-compare__power-delta--up' : 'equip-compare__power-delta--down'}`}>
            <AncientIcon name="flame" size={14} className="anc-icon--power" />
            {formatDelta(data.powerDelta)}
          </div>
        </div>

        <div className="equip-compare__items">
          <div className="equip-compare__item-card equip-compare__item-card--old">
            <span className="equip-compare__item-tag">Đang mặc</span>
            {data.equipped ? (
              <>
                <div className={`equip-compare__portrait equip-compare__portrait--${data.equipped.rarity}`}>
                  <ItemIcon icon={data.equipped.icon} className="equip-compare__portrait-icon" />
                  <img className="equip-compare__portrait-frame" src={RARITY_FRAMES[data.equipped.rarity]} alt="" aria-hidden draggable={false} />
                  {(data.equipped.enhance ?? 0) > 0 && (
                    <span className="equip-compare__portrait-enhance">+{data.equipped.enhance}</span>
                  )}
                </div>
                <p className={`equip-compare__item-name equip-compare__item-name--${data.equipped.rarity}`}>
                  {data.equipped.name}
                </p>
                <p className="equip-compare__item-meta">{getRarityTierLabel(data.equipped.rarity)}</p>
              </>
            ) : (
              <div className="equip-compare__empty">
                <ItemIcon icon={slotMeta.icon} className="equip-compare__empty-icon" />
                <p>Chưa trang bị</p>
              </div>
            )}
          </div>

          <div className="equip-compare__item-card equip-compare__item-card--new">
            <span className="equip-compare__item-tag equip-compare__item-tag--new">Mới</span>
            <div className={`equip-compare__portrait equip-compare__portrait--${item.rarity}`}>
              <ItemIcon icon={item.icon} className="equip-compare__portrait-icon" />
              <img className="equip-compare__portrait-frame" src={RARITY_FRAMES[item.rarity]} alt="" aria-hidden draggable={false} />
              {(item.enhance ?? 0) > 0 && (
                <span className="equip-compare__portrait-enhance">+{item.enhance}</span>
              )}
            </div>
            <p className={`equip-compare__item-name equip-compare__item-name--${item.rarity}`}>{item.name}</p>
            <p className="equip-compare__item-meta">{getRarityTierLabel(item.rarity)}</p>
          </div>
        </div>

        <div className="equip-compare__table-wrap">
          <table className="equip-compare__table">
            <thead>
              <tr>
                <th>Chỉ số</th>
                <th>Đang mặc</th>
                <th>Mới</th>
                <th>Tổng ±</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const itemDelta = row.newValue - row.equippedValue;
                const up = row.playerDelta > 0;
                const down = row.playerDelta < 0;

                return (
                  <tr key={row.key} className={up ? 'equip-compare__row--up' : down ? 'equip-compare__row--down' : ''}>
                    <td className="equip-compare__stat-name">
                      <AncientIcon name={row.icon} size={12} /> {row.label}
                    </td>
                    <td className="equip-compare__val equip-compare__val--old">
                      {row.equippedValue > 0 ? `+${formatNumber(row.equippedValue)}` : '—'}
                    </td>
                    <td className="equip-compare__val equip-compare__val--new">
                      {row.newValue > 0 ? `+${formatNumber(row.newValue)}` : '—'}
                      {itemDelta !== 0 && (
                        <small className={itemDelta > 0 ? 'equip-compare__item-delta--up' : 'equip-compare__item-delta--down'}>
                          ({formatDelta(itemDelta)})
                        </small>
                      )}
                    </td>
                    <td className={`equip-compare__val equip-compare__val--delta ${up ? 'equip-compare__val--up' : down ? 'equip-compare__val--down' : ''}`}>
                      {formatDelta(row.playerDelta)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="equip-compare__hint">
          Cột <strong>Tổng ±</strong> là thay đổi chỉ số nhân vật sau khi mặc (đã tính cảnh giới &amp; buff).
        </p>
      </div>
    </Modal>
  );
}
