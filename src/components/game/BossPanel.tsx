import { useEffect, useMemo, useState } from 'react';
import { AncientIcon, GameButton, ItemIcon } from '@/components';
import { ProgressBar } from '@/components/common/ProgressBar';
import { BOSSES } from '@/data/dungeons';
import type { BossDef } from '@/data/dungeons';
import { getBossRealmLabel } from '@/data/bosses';
import { getMaxRealmId } from '@/data/realms';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import { getDropPreviewItems } from '@/systems/drops';
import { calcWinChance } from '@/systems/combat';
import { formatNumber } from '@/utils/format';

const BOSS_DAILY_LIMIT = 3;

interface BossPanelProps {
  playerRealmId: number;
  playerPower: number;
  bossKills: number;
  dailyBossRuns: Record<string, number>;
  bossRealmFilter: number;
  visibleBossRealms: number[];
  showAllBossRealms: boolean;
  bossRealms: number[];
  canPrevRealm: boolean;
  canNextRealm: boolean;
  onRealmFilterChange: (realmId: number) => void;
  onToggleShowAllRealms: () => void;
  onShiftRealm: (dir: -1 | 1) => void;
  onChallenge: (bossId: string) => void;
}

function getBossStatus(
  boss: BossDef,
  playerRealmId: number,
  runs: number,
): 'active' | 'locked' | 'exhausted' {
  if (playerRealmId < boss.minRealmId) return 'locked';
  if (runs >= BOSS_DAILY_LIMIT) return 'exhausted';
  return 'active';
}

function pickDefaultBoss(bosses: BossDef[], playerRealmId: number, runs: Record<string, number>): string | null {
  const active = bosses.find((b) => getBossStatus(b, playerRealmId, runs[b.id] ?? 0) === 'active');
  if (active) return active.id;
  const unlocked = bosses.find((b) => playerRealmId >= b.minRealmId);
  return unlocked?.id ?? bosses[0]?.id ?? null;
}

export function BossPanel({
  playerRealmId,
  playerPower,
  bossKills,
  dailyBossRuns,
  bossRealmFilter,
  visibleBossRealms,
  showAllBossRealms,
  bossRealms,
  canPrevRealm,
  canNextRealm,
  onRealmFilterChange,
  onToggleShowAllRealms,
  onShiftRealm,
  onChallenge,
}: BossPanelProps) {
  const bossesInRealm = useMemo(
    () => BOSSES.filter((b) => b.minRealmId === bossRealmFilter),
    [bossRealmFilter],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(pickDefaultBoss(bossesInRealm, playerRealmId, dailyBossRuns));
  }, [bossesInRealm, playerRealmId, dailyBossRuns]);

  const selected = bossesInRealm.find((b) => b.id === selectedId) ?? bossesInRealm[0];
  if (!selected) {
    return <p className="boss-empty">Không có boss ở cảnh giới này.</p>;
  }

  const runs = dailyBossRuns[selected.id] ?? 0;
  const status = getBossStatus(selected, playerRealmId, runs);
  const winChance = calcWinChance(playerPower, selected.power);
  const maxPower = Math.max(playerPower, selected.power, 1);
  const playerPowerPct = (playerPower / maxPower) * 100;
  const bossPowerPct = (selected.power / maxPower) * 100;
  const isEndgame = selected.minRealmId >= getMaxRealmId() - 1;
  const drops = getDropPreviewItems('boss', { boss: selected });

  const canFight = status === 'active';

  return (
    <div className="boss-panel">
      <div className="boss-panel__realm-nav">
        <button
          type="button"
          className="boss-panel__realm-arrow"
          disabled={!canPrevRealm}
          onClick={() => onShiftRealm(-1)}
          aria-label="Cảnh giới trước"
        >
          ‹
        </button>
        <div className="boss-panel__realm-center">
          <span className="boss-panel__realm-title">{getBossRealmLabel(bossRealmFilter)}</span>
          <span className="boss-panel__realm-sub">
            {bossesInRealm.length} boss · {bossRealmFilter <= playerRealmId ? 'Đã mở' : 'Chưa đủ cảnh'}
          </span>
        </div>
        <button
          type="button"
          className="boss-panel__realm-arrow"
          disabled={!canNextRealm}
          onClick={() => onShiftRealm(1)}
          aria-label="Cảnh giới sau"
        >
          ›
        </button>
      </div>

      <div className={`boss-panel__chips ${showAllBossRealms ? 'boss-panel__chips--all' : ''}`}>
        {(showAllBossRealms ? bossRealms : visibleBossRealms).map((realmId) => (
          <button
            key={realmId}
            type="button"
            className={[
              'boss-panel__chip',
              bossRealmFilter === realmId && 'boss-panel__chip--active',
              realmId > playerRealmId && 'boss-panel__chip--locked',
            ].filter(Boolean).join(' ')}
            onClick={() => onRealmFilterChange(realmId)}
          >
            {getBossRealmLabel(realmId)}
          </button>
        ))}
      </div>

      <button type="button" className="boss-panel__link" onClick={onToggleShowAllRealms}>
        {showAllBossRealms ? 'Thu gọn danh sách cảnh giới' : 'Xem tất cả cảnh giới'}
      </button>

      <div className="boss-roster">
        {bossesInRealm.map((boss) => {
          const bossRuns = dailyBossRuns[boss.id] ?? 0;
          const bossStatus = getBossStatus(boss, playerRealmId, bossRuns);
          const isSelected = boss.id === selected.id;
          return (
            <button
              key={boss.id}
              type="button"
              className={[
                'boss-roster__item',
                isSelected && 'boss-roster__item--selected',
                bossStatus === 'locked' && 'boss-roster__item--locked',
                bossStatus === 'exhausted' && 'boss-roster__item--exhausted',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelectedId(boss.id)}
            >
              <ItemIcon icon={boss.icon} className="boss-roster__thumb" />
              <span className="boss-roster__name">{boss.name}</span>
              {bossStatus === 'active' && (
                <span className="boss-roster__tag boss-roster__tag--live">Đang xuất hiện</span>
              )}
              {bossStatus === 'locked' && (
                <span className="boss-roster__tag boss-roster__tag--lock">Chưa mở</span>
              )}
              {bossStatus === 'exhausted' && (
                <span className="boss-roster__tag boss-roster__tag--done">Hết lượt</span>
              )}
            </button>
          );
        })}
      </div>

      <div className={`boss-showcase ${status === 'locked' ? 'boss-showcase--locked' : ''}`}>
        <div className="boss-showcase__fx" aria-hidden />
        <div className="boss-showcase__glow" aria-hidden />

        <div className="boss-showcase__portrait">
          <ItemIcon icon={selected.icon} className="boss-showcase__icon" />
          {isEndgame && <ItemIcon icon="👑" className="boss-showcase__crown" />}
        </div>

        <div className="boss-showcase__info">
          <div className="boss-showcase__title-row">
            <h3 className="boss-showcase__name">{selected.name}</h3>
            <span className="boss-showcase__realm-badge">{getBossRealmLabel(selected.minRealmId)}</span>
          </div>
          <p className="boss-showcase__desc">{selected.description}</p>

          <div className="boss-showcase__hp">
            <span className="boss-showcase__hp-label">Khí huyết</span>
            <ProgressBar
              current={selected.hp}
              max={selected.hp}
              thin
              displayText={`${formatNumber(selected.hp)} / ${formatNumber(selected.hp)}`}
            />
          </div>

          <div className="boss-showcase__compare">
            <div className="boss-compare">
              <span className="boss-compare__label">Lực chiến</span>
              <div className="boss-compare__bars">
                <div className="boss-compare__row">
                  <span>Bạn</span>
                  <div className="boss-compare__track">
                    <div
                      className="boss-compare__fill boss-compare__fill--player"
                      style={{ width: `${playerPowerPct}%` }}
                    />
                  </div>
                  <strong>{formatNumber(playerPower)}</strong>
                </div>
                <div className="boss-compare__row">
                  <span>Boss</span>
                  <div className="boss-compare__track">
                    <div
                      className="boss-compare__fill boss-compare__fill--boss"
                      style={{ width: `${bossPowerPct}%` }}
                    />
                  </div>
                  <strong>{formatNumber(selected.power)}</strong>
                </div>
              </div>
            </div>
            <div className={`boss-showcase__chance ${winChance >= 50 ? 'boss-showcase__chance--good' : 'boss-showcase__chance--low'}`}>
              <span className="boss-showcase__chance-val">{winChance}%</span>
              <span className="boss-showcase__chance-label">Tỷ lệ thắng</span>
            </div>
          </div>
        </div>
      </div>

      <div className="boss-rewards">
        <div className="boss-rewards__head">
          <AncientIcon name="gift" size={12} />
          <span>Thưởng hạ boss</span>
        </div>
        <div className="boss-rewards__track">
          <div className="boss-rewards__line" />
          {[
            { type: 'ancient' as const, icon: 'coin' as const, label: formatNumber(selected.goldReward), cls: 'anc-icon--gold' },
            { type: 'ancient' as const, icon: 'gem' as const, label: formatNumber(selected.crystalReward), cls: 'anc-icon--crystal' },
            { type: 'ancient' as const, icon: 'jade' as const, label: String(selected.jadeReward), cls: 'anc-icon--jade' },
            ...drops.map((d) => ({
              type: 'item' as const,
              icon: ITEM_TEMPLATES[d.templateId]?.icon ?? '📦',
              label: ITEM_TEMPLATES[d.templateId]?.name ?? d.templateId,
            })),
          ].map((node, i) => (
            <div key={`${node.label}-${i}`} className="boss-rewards__node">
              <span className="boss-rewards__orb">
                {node.type === 'item' ? (
                  <ItemIcon icon={node.icon} className="reward-item-icon" />
                ) : (
                  <AncientIcon name={node.icon} size={14} className={node.cls} />
                )}
              </span>
              <span className="boss-rewards__node-label">{node.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="boss-stats">
        <div className="boss-stats__item">
          <span>Hạ boss (tổng)</span>
          <strong>{bossKills}</strong>
        </div>
        <div className="boss-stats__item">
          <span>Lượt hôm nay</span>
          <strong>{runs}/{BOSS_DAILY_LIMIT}</strong>
        </div>
        <div className="boss-stats__item boss-stats__item--highlight">
          <span>Trạng thái</span>
          <strong>
            {status === 'active' && 'Có thể đánh'}
            {status === 'locked' && 'Chưa mở'}
            {status === 'exhausted' && 'Hết lượt'}
          </strong>
        </div>
      </div>

      <div className="boss-action">
        <p className="boss-action__attempts">
          Số lần khiêu chiến: <strong>{runs}/{BOSS_DAILY_LIMIT}</strong>
        </p>
        <GameButton
          variant="primary"
          className="boss-action__btn"
          disabled={!canFight}
          onClick={() => onChallenge(selected.id)}
        >
          <AncientIcon name="sword" size={16} />
          {status === 'locked' ? 'Chưa đủ cảnh' : status === 'exhausted' ? 'Hết lượt hôm nay' : 'Khiêu chiến'}
        </GameButton>
      </div>
    </div>
  );
}
