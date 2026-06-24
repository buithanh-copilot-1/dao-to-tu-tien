import { useEffect, useRef, useState } from 'react';
import { GameButton } from '@/components/common/GameButton';
import { Modal } from '@/components/common/MiscComponents';
import type { TribulationInfo } from '@/systems/cultivation';
import type { ElementType, Gender } from '@/types/game';
import { CultivationAvatar } from './CultivationAvatar';

interface TribulationSceneModalProps {
  info: TribulationInfo;
  gender: Gender;
  element: ElementType;
  realmId: number;
  onComplete: () => void;
}

const INTRO_LINE = 'Thiên lôi cuồn cuộn, vận khí toàn thân nghênh kiếp...';
const STRIKE_LINES = [
  'Sét đầu giáng xuống, kinh mạch run lên!',
  'Sét thứ hai xuyên thấu đan điền!',
  'Sét thứ ba bao trùm thiên địa!',
  'Khoảnh khắc sinh tử — kiếp số định đoạt!',
];

const STRIKE_INTERVAL_MS = 700;
const FLASH_DURATION_MS = 220;
const FINISH_DELAY_MS = 600;

export function TribulationSceneModal({ info, gender, element, realmId, onComplete }: TribulationSceneModalProps) {
  const [strikeIndex, setStrikeIndex] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STRIKE_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setStrikeIndex(i + 1);
          setFlashing(true);
          timers.push(setTimeout(() => setFlashing(false), FLASH_DURATION_MS));
        }, STRIKE_INTERVAL_MS * (i + 1)),
      );
    });

    timers.push(setTimeout(finish, STRIKE_INTERVAL_MS * STRIKE_LINES.length + FINISH_DELAY_MS));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentLine = strikeIndex === 0 ? INTRO_LINE : STRIKE_LINES[strikeIndex - 1];

  return (
    <Modal
      panelClassName="modal-panel--tribulation-scene"
      footer={
        <GameButton variant="secondary" onClick={finish}>
          Bỏ qua
        </GameButton>
      }
    >
      <div className={`tribulation-scene ${flashing ? 'tribulation-scene--flash' : ''}`}>
        <div className="tribulation-scene__stage">
          <div className="tribulation-modal__sky" aria-hidden>
            <span className="tribulation-modal__bolt tribulation-modal__bolt--left" />
            <span className="tribulation-modal__bolt tribulation-modal__bolt--right" />
            <span className="tribulation-modal__ring" />
          </div>
          <CultivationAvatar gender={gender} element={element} cultivating realmId={realmId} />
        </div>

        <div className="tribulation-scene__eyebrow">Thiên Kiếp Giáng Lâm</div>

        <div className="tribulation-scene__dots" aria-hidden>
          {STRIKE_LINES.map((_, i) => (
            <span
              key={i}
              className={`tribulation-scene__dot ${i < strikeIndex ? 'tribulation-scene__dot--hit' : ''}`}
            />
          ))}
        </div>

        <p className="tribulation-scene__line">{currentLine}</p>

        <div className="tribulation-scene__meter" aria-label={`Tỷ lệ độ kiếp ${info.successRate}%`}>
          <span style={{ width: `${info.successRate}%` }} />
        </div>
        <div className="tribulation-scene__rate">
          Tỷ lệ thành công: <strong>{info.successRate}%</strong>
        </div>
      </div>
    </Modal>
  );
}
