import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  TabBar,
  GameButton,
  AncientIcon,
  ItemIcon,
  CatalogItemButton,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { BattleScreen } from '@/components/game/BattleScreen';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { BOSSES, DUNGEONS } from '@/data/dungeons';
import { getBossRealmLabel } from '@/data/bosses';
import { getMaxRealmId, getRealmShortLabel } from '@/data/realms';
import { calcCombatPower } from '@/utils/stats';
import { calcWinChance } from '@/systems/combat';
import { getDropPreviewItems } from '@/systems/drops';
import { formatNumber } from '@/utils/format';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import type { BattleMode } from '@/types/battle';
import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ActiveBattle {
  mode: BattleMode;
  targetId: string;
}

const BOSS_DAILY_LIMIT = 3;

interface ContentRowProps {
  icon: string;
  title: string;
  badge?: string;
  meta: ReactNode;
  actionLabel: string;
  disabled?: boolean;
  locked?: boolean;
  featured?: boolean;
  onAction: () => void;
  className?: string;
}

function ContentRow({
  icon,
  title,
  badge,
  meta,
  actionLabel,
  disabled,
  locked,
  featured,
  onAction,
  className,
}: ContentRowProps) {
  return (
    <div className={`content-row ${locked ? 'content-row--locked' : ''} ${featured ? 'content-row--featured' : ''} ${className ?? ''}`}>
      <ItemIcon icon={icon} className="content-row__icon" />
      <div className="content-row__body">
        <div className="content-row__title">
          {title}
          {badge && <span className="content-row__badge">{badge}</span>}
        </div>
        <div className="content-row__meta">{meta}</div>
      </div>
      <GameButton variant={featured ? 'primary' : 'secondary'} onClick={onAction} disabled={disabled} className="content-row__btn">
        {actionLabel}
      </GameButton>
    </div>
  );
}

export function DungeonPage() {
  const player = useGameStore((s) => s.player)!;
  const dailyCounters = useGameStore((s) => s.dailyCounters);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(() => (searchParams.get('tab') === 'boss' ? 'boss' : 'dungeon'));
  const [battle, setBattle] = useState<ActiveBattle | null>(null);
  const [showLockedDungeons, setShowLockedDungeons] = useState(false);
  const [showAllBossRealms, setShowAllBossRealms] = useState(false);
  const [bossRealmFilter, setBossRealmFilter] = useState(player.realmId);

  const power = calcCombatPower(player);

  const bossRealms = useMemo(
    () => Array.from(new Set(BOSSES.map((b) => b.minRealmId))).sort((a, b) => a - b),
    [],
  );

  const visibleBossRealms = useMemo(() => {
    if (showAllBossRealms) return bossRealms;
    const min = Math.max(0, player.realmId - 1);
    const max = Math.min(getMaxRealmId(), player.realmId + 1);
    return bossRealms.filter((r) => r >= min && r <= max);
  }, [bossRealms, player.realmId, showAllBossRealms]);

  const bossesInRealm = useMemo(
    () => BOSSES.filter((b) => b.minRealmId === bossRealmFilter),
    [bossRealmFilter],
  );

  const { openDungeons, lockedDungeons, recommendedDungeonId } = useMemo(() => {
    const open = DUNGEONS.filter((d) => player.realmId >= d.minRealmId);
    const locked = DUNGEONS.filter((d) => player.realmId < d.minRealmId);
    const recommended = open.find((d) => (dailyCounters.dungeons[d.id] ?? 0) < d.dailyLimit)?.id
      ?? open[open.length - 1]?.id;
    return { openDungeons: open, lockedDungeons: locked, recommendedDungeonId: recommended };
  }, [player.realmId, dailyCounters.dungeons]);

  const realmFilterIndex = visibleBossRealms.indexOf(bossRealmFilter);
  const canPrevRealm = realmFilterIndex > 0;
  const canNextRealm = realmFilterIndex >= 0 && realmFilterIndex < visibleBossRealms.length - 1;

  const shiftBossRealm = (dir: -1 | 1) => {
    const idx = visibleBossRealms.indexOf(bossRealmFilter);
    if (idx < 0) return;
    const next = visibleBossRealms[idx + dir];
    if (next != null) setBossRealmFilter(next);
  };

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="dungeon-body">
          <PageHead title="Phó Bản" showOrnament onBack={goBack} />
          <p className="dungeon-summary">
            <AncientIcon name="flame" size={13} className="anc-icon--power" />
            Lực chiến <strong>{formatNumber(power)}</strong>
          </p>

          <TabBar
            tabs={[
              { id: 'dungeon', label: 'Phó bản' },
              { id: 'boss', label: 'Boss' },
            ]}
            activeId={tab}
            onChange={setTab}
          />

          {tab === 'dungeon' && (
            <div className="dungeon-section">
              <div className="dungeon-section__head">
                <span className="dungeon-section__label">Có thể vào</span>
                <span className="dungeon-section__count">{openDungeons.length} phó bản</span>
              </div>

              <div className="content-list content-list--compact">
                {openDungeons.map((d) => {
                  const runs = dailyCounters.dungeons[d.id] ?? 0;
                  const winChance = calcWinChance(power, d.enemyPower);
                  const exhausted = runs >= d.dailyLimit;
                  return (
                    <ContentRow
                      key={d.id}
                      icon={d.icon}
                      title={d.name}
                      badge={d.id === recommendedDungeonId ? 'Đề xuất' : undefined}
                      featured={d.id === recommendedDungeonId}
                      meta={(
                        <>
                          <span>{getRealmShortLabel(d.minRealmId)}</span>
                          <span>·</span>
                          <span>{winChance}% thắng</span>
                          <span>·</span>
                          <span>{runs}/{d.dailyLimit} lượt</span>
                          <span>·</span>
                          <span className="meta-stat"><AncientIcon name="coin" size={10} className="anc-icon--gold" />{formatNumber(d.goldReward)}</span>
                          {getDropPreviewItems('dungeon', { dungeon: d }).map((drop) => (
                            <CatalogItemButton
                              key={drop.templateId}
                              templateId={drop.templateId}
                              className="meta-stat item-drop-btn"
                              title={ITEM_TEMPLATES[drop.templateId]?.name}
                            >
                              <ItemIcon icon={ITEM_TEMPLATES[drop.templateId]?.icon ?? '📦'} className="reward-item-icon" />
                            </CatalogItemButton>
                          ))}
                        </>
                      )}
                      actionLabel={exhausted ? 'Hết lượt' : 'Vào'}
                      disabled={exhausted}
                      onAction={() => setBattle({ mode: 'dungeon', targetId: d.id })}
                    />
                  );
                })}
              </div>

              {lockedDungeons.length > 0 && (
                <div className="dungeon-collapsible">
                  <button
                    type="button"
                    className="dungeon-collapsible__toggle"
                    onClick={() => setShowLockedDungeons((v) => !v)}
                  >
                    <AncientIcon name="gate" size={12} />
                    {showLockedDungeons ? 'Ẩn' : 'Xem'} phó bản chưa mở ({lockedDungeons.length})
                    <span className={`dungeon-collapsible__chevron ${showLockedDungeons ? 'dungeon-collapsible__chevron--open' : ''}`}>›</span>
                  </button>
                  {showLockedDungeons && (
                    <div className="content-list content-list--compact">
                      {lockedDungeons.map((d) => (
                        <ContentRow
                          key={d.id}
                          icon={d.icon}
                          title={d.name}
                          locked
                          meta={<span>Cần {getRealmShortLabel(d.minRealmId)}</span>}
                          actionLabel="Khóa"
                          disabled
                          onAction={() => {}}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'boss' && (
            <div className="dungeon-section">
              <div className="boss-realm-nav">
                <button
                  type="button"
                  className="boss-realm-nav__arrow"
                  disabled={!canPrevRealm}
                  onClick={() => shiftBossRealm(-1)}
                  aria-label="Cảnh giới trước"
                >
                  ‹
                </button>
                <div className="boss-realm-nav__center">
                  <span className="boss-realm-nav__realm">{getBossRealmLabel(bossRealmFilter)}</span>
                  <span className="boss-realm-nav__sub">
                    {bossesInRealm.length} boss · {bossRealmFilter <= player.realmId ? 'Đã mở' : 'Chưa đủ cảnh'}
                  </span>
                </div>
                <button
                  type="button"
                  className="boss-realm-nav__arrow"
                  disabled={!canNextRealm}
                  onClick={() => shiftBossRealm(1)}
                  aria-label="Cảnh giới sau"
                >
                  ›
                </button>
              </div>

              {showAllBossRealms ? (
                <div className="boss-realm-chips">
                  {bossRealms.map((realmId) => (
                    <button
                      key={realmId}
                      type="button"
                      className={`boss-realm-chips__item ${bossRealmFilter === realmId ? 'boss-realm-chips__item--active' : ''} ${realmId > player.realmId ? 'boss-realm-chips__item--locked' : ''}`}
                      onClick={() => setBossRealmFilter(realmId)}
                    >
                      {getBossRealmLabel(realmId)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="boss-realm-chips boss-realm-chips--nearby">
                  {visibleBossRealms.map((realmId) => (
                    <button
                      key={realmId}
                      type="button"
                      className={`boss-realm-chips__item ${bossRealmFilter === realmId ? 'boss-realm-chips__item--active' : ''}`}
                      onClick={() => setBossRealmFilter(realmId)}
                    >
                      {getBossRealmLabel(realmId)}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="dungeon-link-btn"
                onClick={() => {
                  setShowAllBossRealms((v) => !v);
                  if (!showAllBossRealms && !visibleBossRealms.includes(bossRealmFilter)) {
                    setBossRealmFilter(player.realmId);
                  }
                }}
              >
                {showAllBossRealms ? 'Thu gọn danh sách cảnh giới' : 'Xem tất cả cảnh giới'}
              </button>

              <div className="content-list content-list--compact">
                {bossesInRealm.map((b) => {
                  const runs = dailyCounters.bosses[b.id] ?? 0;
                  const locked = player.realmId < b.minRealmId;
                  const winChance = calcWinChance(power, b.power);
                  const exhausted = runs >= BOSS_DAILY_LIMIT;
                  const isEndgame = b.minRealmId >= getMaxRealmId() - 1;
                  return (
                    <ContentRow
                      key={b.id}
                      icon={b.icon}
                      title={b.name}
                      badge={isEndgame ? 'BOSS' : undefined}
                      locked={locked}
                      className={`boss-row ${isEndgame ? 'boss-row--heavy' : ''}`}
                      meta={(
                        <>
                          <span className="meta-stat"><AncientIcon name="flame" size={10} className="anc-icon--power" />{formatNumber(b.power)}</span>
                          <span>·</span>
                          <span>{winChance}%</span>
                          <span>·</span>
                          <span>{runs}/{BOSS_DAILY_LIMIT}</span>
                          {!locked && (
                            <>
                              <span>·</span>
                              <span className="meta-stat"><AncientIcon name="coin" size={10} className="anc-icon--gold" />{formatNumber(b.goldReward)}</span>
                              {getDropPreviewItems('boss', { boss: b }).map((drop) => (
                                <CatalogItemButton
                                  key={drop.templateId}
                                  templateId={drop.templateId}
                                  className="meta-stat item-drop-btn"
                                  title={ITEM_TEMPLATES[drop.templateId]?.name}
                                >
                                  <ItemIcon icon={ITEM_TEMPLATES[drop.templateId]?.icon ?? '📦'} className="reward-item-icon" />
                                </CatalogItemButton>
                              ))}
                            </>
                          )}
                        </>
                      )}
                      actionLabel={locked ? 'Khóa' : exhausted ? 'Hết lượt' : 'Đánh'}
                      disabled={locked || exhausted}
                      onAction={() => setBattle({ mode: 'boss', targetId: b.id })}
                    />
                  );
                })}
              </div>

              {bossesInRealm.length === 0 && (
                <p className="dungeon-empty">Không có boss ở cảnh giới này.</p>
              )}
            </div>
          )}
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>

        {battle && (
          <BattleScreen
            mode={battle.mode}
            targetId={battle.targetId}
            onClose={() => setBattle(null)}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
