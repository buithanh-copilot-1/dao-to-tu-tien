import type { GameItem } from '@/types/game';
import { Modal, GameButton } from '@/components';
import { getCategoryLabel, isItemEquipped } from '@/systems/inventory';
import type { Player } from '@/types/game';
import { formatNumber } from '@/utils/format';

interface ItemDetailModalProps {
  item: GameItem;
  player: Player;
  onClose: () => void;
  onEquip: () => void;
  onUnequip: () => void;
  onUse: () => void;
  onSell: () => void;
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

  return (
    <Modal onClose={onClose} footer={
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {item.category === 'equipment' && !equipped && (
          <GameButton variant="primary" onClick={onEquip}>Trang bị</GameButton>
        )}
        {equipped && (
          <GameButton variant="secondary" onClick={onUnequip}>Tháo</GameButton>
        )}
        {item.category === 'pill' && (
          <GameButton variant="primary" onClick={onUse}>Sử dụng</GameButton>
        )}
        {!equipped && !item.locked && (
          <GameButton variant="claim" onClick={onSell}>Bán ({formatNumber((item.sellPrice ?? 0) * item.quantity)})</GameButton>
        )}
        <GameButton variant="secondary" onClick={onToggleLock}>
          {item.locked ? 'Mở khóa' : 'Khóa'}
        </GameButton>
      </div>
    }>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{item.icon}</div>
        <div style={{ fontSize: 16, color: 'var(--text-gold)', marginBottom: 4 }}>{item.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
          {getCategoryLabel(item.category)} · {item.rarity} {item.quantity > 1 && `×${item.quantity}`}
        </div>
        {item.stats && (
          <div style={{ fontSize: 12, textAlign: 'left', marginBottom: 12 }}>
            {Object.entries(item.stats).map(([k, v]) => (
              <div key={k} style={{ color: 'var(--green-stat)' }}>+{v} {k}</div>
            ))}
          </div>
        )}
        {item.enhance !== undefined && item.enhance > 0 && (
          <div style={{ fontSize: 11, color: 'var(--cyan-glow)' }}>Cường hóa +{item.enhance}</div>
        )}
      </div>
    </Modal>
  );
}
