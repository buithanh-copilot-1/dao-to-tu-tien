interface ProgressBarProps {
  current: number;
  max: number;
  labelLeft?: string;
  labelRight?: string;
  showText?: boolean;
  thin?: boolean;
}

export function ProgressBar({
  current,
  max,
  labelLeft,
  labelRight,
  showText = true,
  thin = false,
}: ProgressBarProps) {
  const percent = Math.min((current / max) * 100, 100);
  const formatNum = (n: number) => {
    if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
    return n.toString();
  };

  return (
    <div className={`progress-bar ${thin ? 'progress-bar--thin' : ''}`}>
      {(labelLeft || labelRight) && (
        <div className="progress-bar__labels">
          <span>{labelLeft}</span>
          <span>{labelRight}</span>
        </div>
      )}
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
        {showText && (
          <span className="progress-bar__text">
            {formatNum(current)}/{formatNum(max)}
          </span>
        )}
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
