import { AncientIcon } from '@/components/common/AncientIcon';
import { GameButton } from '@/components/common/GameButton';
import { Modal } from '@/components/common/MiscComponents';
import type { BreakthroughTribulationNotice } from '@/stores/gameStore';
import { formatNumber } from '@/utils/format';

interface TribulationResultModalProps {
  notice: BreakthroughTribulationNotice;
  showPowerDelta: boolean;
  onClose: () => void;
}

export function TribulationResultModal({ notice, showPowerDelta, onClose }: TribulationResultModalProps) {
  const { info, success, message, powerDelta } = notice;
  const retainedPct = Math.round(info.retainedCultivationPct * 100);

  return (
    <Modal
      onClose={onClose}
      panelClassName="modal-panel--tribulation"
      footer={
        <GameButton variant={success ? 'hex' : 'secondary'} onClick={onClose}>
          {success ? 'Ổn định cảnh giới' : 'Tụ khí thử lại'}
        </GameButton>
      }
    >
      <div className={`tribulation-modal ${success ? 'tribulation-modal--success' : 'tribulation-modal--fail'}`}>
        <div className="tribulation-modal__sky" aria-hidden>
          <span className="tribulation-modal__bolt tribulation-modal__bolt--left" />
          <span className="tribulation-modal__bolt tribulation-modal__bolt--right" />
          <span className="tribulation-modal__ring" />
        </div>

        <div className="tribulation-modal__seal">
          <AncientIcon name={success ? 'realm' : 'bolt'} size={42} />
        </div>

        <div className="tribulation-modal__eyebrow">
          {success ? 'Độ kiếp thành công' : 'Độ kiếp thất bại'}
        </div>
        <h2 className="tribulation-modal__title">
          {success ? 'Thiên môn khai mở' : 'Kiếp lôi phản phệ'}
        </h2>
        <p className="tribulation-modal__message">{message}</p>

        <div className="tribulation-modal__meter" aria-label={`Tỷ lệ độ kiếp ${info.successRate}%`}>
          <span style={{ width: `${info.successRate}%` }} />
        </div>

        <div className="tribulation-modal__stats">
          <div className="tribulation-modal__stat">
            <small>Tỷ lệ</small>
            <strong>{info.successRate}%</strong>
          </div>
          <div className="tribulation-modal__stat">
            <small>Chiến lực</small>
            <strong>{formatNumber(info.combatPower)}</strong>
          </div>
          <div className="tribulation-modal__stat">
            <small>Uy áp</small>
            <strong>{formatNumber(info.difficulty)}</strong>
          </div>
          <div className="tribulation-modal__stat">
            <small>{success ? 'Cảnh giới mới' : 'Tu vi giữ lại'}</small>
            <strong>{success ? info.targetLabel : `${retainedPct}%`}</strong>
          </div>
        </div>

        {showPowerDelta && powerDelta !== null && powerDelta !== 0 && (
          <div className={`tribulation-modal__power ${powerDelta > 0 ? 'tribulation-modal__power--up' : 'tribulation-modal__power--down'}`}>
            <AncientIcon name="flame" size={16} />
            {powerDelta > 0 ? '+' : ''}
            {formatNumber(powerDelta)} lực chiến
          </div>
        )}
      </div>
    </Modal>
  );
}
