import type { CSSProperties } from 'react';

interface BattleArenaFxProps {
  active: boolean;
  clashing: boolean;
}

const SPARK_COUNT = 10;

export function BattleArenaFx({ active, clashing }: BattleArenaFxProps) {
  if (!active) return null;

  return (
    <div className={`battle-fx ${clashing ? 'battle-fx--clash' : ''}`} aria-hidden>
      <div className="battle-fx__vignette" />

      <div className="battle-fx__particles">
        {Array.from({ length: SPARK_COUNT }, (_, i) => (
          <span
            key={i}
            className="battle-fx__spark"
            style={{ '--spark-i': i } as CSSProperties}
          />
        ))}
      </div>

      <div className="battle-fx__energy battle-fx__energy--player" />
      <div className="battle-fx__energy battle-fx__energy--enemy" />
    </div>
  );
}
