import type { Player, PlayerStats } from '@/types/game';
import { AncientIcon } from '../common/AncientIcon';
import { ItemIcon } from '../common/ItemIcon';
import { calcEquipmentStatBreakdown, STAT_META } from '@/utils/stats';
import { formatNumber } from '@/utils/format';

interface EquipmentStatPanelProps {
  player: Player;
  showBreakdown?: boolean;
}

export function EquipmentStatPanel({ player, showBreakdown = true }: EquipmentStatPanelProps) {
  const { total, bySlot } = calcEquipmentStatBreakdown(player);
  const statKeys = Object.keys(total) as (keyof PlayerStats)[];
  const hasStats = statKeys.length > 0;

  return (
    <div className="equip-stats">
      <div className="equip-stats__head">
        <AncientIcon name="shield" size={14} className="anc-icon--gold" />
        <span>Chỉ số trang bị</span>
      </div>

      {!hasStats ? (
        <p className="equip-stats__empty">Chưa có chỉ số từ trang bị</p>
      ) : (
        <>
          <div className="equip-stats__total">
            {statKeys.map((key) => (
              <div key={key} className="equip-stats__row">
                <span className="equip-stats__label">
                  <AncientIcon name={STAT_META[key].icon} size={12} />
                  {STAT_META[key].label}
                </span>
                <span className="equip-stats__value">+{formatNumber(total[key] ?? 0)}</span>
              </div>
            ))}
          </div>

          {showBreakdown && (
            <div className="equip-stats__breakdown">
              {Object.entries(bySlot).map(([slot, entry]) => {
                if (!entry) return null;
                const entries = Object.entries(entry.stats) as [keyof PlayerStats, number][];
                if (entries.length === 0) return null;

                return (
                  <div key={slot} className="equip-stats__slot">
                    <div className="equip-stats__slot-head">
                      <ItemIcon icon={entry.icon} className="equip-stats__slot-icon" />
                      <span>{entry.label}</span>
                    </div>
                    <div className="equip-stats__slot-stats">
                      {entries.map(([k, v]) => (
                        <span key={k} className="equip-stats__chip">
                          {STAT_META[k].label} +{formatNumber(v)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface StatCompareTableProps {
  currentStats: Partial<PlayerStats>;
  nextStats: Partial<PlayerStats>;
  statDeltas: Partial<PlayerStats>;
  currentLevel: number;
  nextLevel: number;
}

export function StatCompareTable({
  currentStats,
  nextStats,
  statDeltas,
  currentLevel,
  nextLevel,
}: StatCompareTableProps) {
  const keys = Object.keys({ ...currentStats, ...nextStats }) as (keyof PlayerStats)[];

  if (keys.length === 0) {
    return <p className="enhance-compare__empty">Trang bị này không có chỉ số</p>;
  }

  return (
    <div className="enhance-compare">
      <div className="enhance-compare__head">
        <span>Cường hóa +{currentLevel}</span>
        <AncientIcon name="bolt" size={14} className="anc-icon--gold" />
        <span>+{nextLevel}</span>
      </div>
      <div className="data-table data-table--enhance">
        <div className="data-table__head">
          <span className="data-table__th data-table__th--left">Chỉ số</span>
          <span className="data-table__th data-table__th--right">Hiện tại</span>
          <span className="data-table__th data-table__th--right">Sau cường hóa</span>
        </div>
        {keys.map((k) => (
          <div key={k} className="data-table__row">
            <span className="data-table__cell data-table__cell--left data-table__stat-name">
              {STAT_META[k].label}
            </span>
            <span className="data-table__cell data-table__cell--right">
              {formatNumber(currentStats[k] ?? 0)}
            </span>
            <span className="data-table__cell data-table__cell--right data-table__cell--next">
              {formatNumber(nextStats[k] ?? 0)}
              {(statDeltas[k] ?? 0) > 0 && (
                <em className="data-table__delta">↑{formatNumber(statDeltas[k] ?? 0)}</em>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
