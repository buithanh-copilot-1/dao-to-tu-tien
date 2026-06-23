import { formatNumber } from '@/utils/format';

interface BattleHpBarProps {
  current: number;
  max: number;
  variant?: 'player' | 'enemy';
}

export function BattleHpBar({ current, max, variant = 'player' }: BattleHpBarProps) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.min((current / safeMax) * 100, 100);
  const low = percent <= 25 && percent > 0;
  const pctLabel = `${Math.round(percent)}%`;

  return (
    <div
      className={`battle-hp battle-hp--${variant}${low ? ' battle-hp--low' : ''}`}
      title={`${formatNumber(current)} / ${formatNumber(safeMax)}`}
    >
      <div className="battle-hp__track">
        <div className="battle-hp__fill" style={{ width: `${percent}%` }} />
        <span className="battle-hp__pct">{pctLabel}</span>
        <div className="battle-hp__shine" aria-hidden />
      </div>
      <div className="battle-hp__value">{formatNumber(current)}</div>
    </div>
  );
}
