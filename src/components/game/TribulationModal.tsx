import { useState, useEffect } from 'react';
import type { TribulationInfo } from '@/systems/cultivation';
import { useGameStore } from '@/stores/gameStore';

interface TribulationModalProps {
  info: TribulationInfo;
  onComplete: (bonusRate: number) => void;
  onSkip?: (bonusRate: number) => void;
}

export function TribulationModal({ info, onComplete, onSkip }: TribulationModalProps) {
  // stage: -1 = Preparation, 0 = Clouds, 1 = Strike 1, 2 = Strike 2, 3 = Strike 3
  const [stage, setStage] = useState(-1);
  const [statusText, setStatusText] = useState('Lôi vân hội tụ...');
  const [shake, setShake] = useState(false);
  const [strike, setStrike] = useState(false);
  const [bonusRate, setBonusRate] = useState(0);

  const player = useGameStore((s) => s.player);
  const consumeItem = useGameStore((s) => s.consumeItemByTemplate);

  const pillCount = player?.inventory.filter((i) => i.templateId === 'pill_break').reduce((sum, i) => sum + i.quantity, 0) || 0;
  const currentRate = Math.min(100, info.successRate + bonusRate);

  useEffect(() => {
    if (stage === -1) return;

    let timeoutId: number;

    const triggerStrike = (text: string, nextStage: number, delay: number) => {
      timeoutId = window.setTimeout(() => {
        setStatusText(text);
        setShake(true);
        setStrike(true);
        setTimeout(() => {
          setShake(false);
          setStrike(false);
        }, 500); // Animation duration
        setStage(nextStage);
      }, delay);
    };

    if (stage === 0) {
      triggerStrike('Đạo lôi kiếp thứ 1 giáng xuống!', 1, 1500);
    } else if (stage === 1) {
      triggerStrike('Đạo lôi kiếp thứ 2 giáng xuống!', 2, 1000);
    } else if (stage === 2) {
      triggerStrike('Lôi kiếp cuối cùng!', 3, 1000);
    } else if (stage === 3) {
      timeoutId = window.setTimeout(() => {
        onComplete(bonusRate);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [stage, onComplete, bonusRate]);

  const handleUsePill = () => {
    if (currentRate >= 100) return;
    if (consumeItem('pill_break', 1)) {
      setBonusRate((prev) => prev + 10);
    }
  };

  const handleStart = () => {
    setStage(0);
  };

  return (
    <div className={`tribulation-anim ${shake ? 'tribulation-anim__shake' : ''}`}>
      <div className="tribulation-anim__clouds" />
      
      <div className={`tribulation-anim__lightning ${strike ? 'tribulation-anim__lightning--strike' : ''}`} />
      <div className={`tribulation-anim__flash ${strike ? 'tribulation-anim__flash--active' : ''}`} />

      {stage >= 0 && player && (
        <div className="tribulation-anim__avatar">
          <img src="/images/meditating_person.png" alt="Meditating" />
        </div>
      )}

      <div className="tribulation-anim__content">
        <h2 className="tribulation-anim__title">
          Thiên Kiếp - {info.targetLabel}
        </h2>
        
        {stage === -1 ? (
          <div className="tribulation-anim__prep">
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Lôi kiếp sắp sửa giáng xuống, đạo hữu đã chuẩn bị sẵn sàng?</p>
            <div style={{ fontSize: 18, marginBottom: 24 }}>
              Tỷ lệ thành công: <strong style={{ color: currentRate >= 100 ? 'var(--success-base)' : 'var(--text-gold)' }}>{currentRate}%</strong>
            </div>
            
            <div className="tribulation-anim__prep-actions">
              <button 
                className="game-button" 
                onClick={handleUsePill}
                disabled={pillCount === 0 || currentRate >= 100}
                style={{ minWidth: 240 }}
              >
                Dùng Đột Phá Đan (+10%)
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                  (Đang có: {pillCount} viên)
                </div>
              </button>
              
              <button 
                className="game-button game-button--danger" 
                onClick={handleStart}
                style={{ minWidth: 240, marginTop: 12 }}
              >
                Nghênh đón Lôi Kiếp!
              </button>
            </div>
            
            {onSkip && (
              <button 
                onClick={() => onSkip(bonusRate)}
                style={{
                  marginTop: 24,
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-muted)',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Rút lui
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="tribulation-anim__status">
              {statusText}
            </div>
            <div style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
              Tỷ lệ thành công: {currentRate}%
            </div>
          </>
        )}
      </div>
      
      {stage >= 0 && onSkip && (
        <button 
          onClick={() => onSkip(bonusRate)}
          style={{
            position: 'absolute',
            bottom: 40,
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--border-light)',
            color: 'var(--text-muted)',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Bỏ qua
        </button>
      )}
    </div>
  );
}
