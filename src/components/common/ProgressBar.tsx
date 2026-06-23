import { formatProgressValue } from '@/utils/format';

interface ProgressBarProps {
  current: number;
  max: number;
  labelLeft?: string;
  labelRight?: string;
  showText?: boolean;
  thin?: boolean;
  variant?: 'default' | 'cultivation';
  displayText?: string;
}

export function ProgressBar({
  current,
  max,
  labelLeft,
  labelRight,
  showText,
  thin = false,
  variant = 'default',
  displayText,
}: ProgressBarProps) {
  const showBarText = displayText != null ? true : (showText ?? !thin);
  const percent = Math.min((current / max) * 100, 100);
  const barText = displayText ?? `${formatProgressValue(current)}/${formatProgressValue(max)}`;

  return (
    <div
      className={`progress-bar ${thin ? 'progress-bar--thin' : ''} ${variant === 'cultivation' ? 'progress-bar--cultivation' : ''}`}
    >
      {(labelLeft || labelRight) && (
        <div className="progress-bar__labels">
          <span>{labelLeft}</span>
          <span>{labelRight}</span>
        </div>
      )}
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
        {showBarText && <span className="progress-bar__text">{barText}</span>}
      </div>
    </div>
  );
}

export function XpBar({ percent }: { percent: number }) {
  return (
    <div className="xp-bar">
      <div className="xp-bar__fill" style={{ width: `${Math.min(percent, 100)}%` }} />
    </div>
  );
}
