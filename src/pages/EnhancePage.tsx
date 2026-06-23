import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  GameButton,
  AncientIcon,
  ItemIcon,
  RARITY_FRAMES,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { EquipItemList } from '@/components/game/EquipmentBoard';
import { StatCompareTable } from '@/components/game/EquipmentStatPanel';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useRedirectBack } from '@/hooks/useRedirectBack';
import { getEnhancePreview, getMaxEnhanceLevel } from '@/data/enhancement';
import { RARITY_META, getRarityTierLabel } from '@/data/rarity';
import { canEnhanceItem, countMaterial, getEnhanceableItems } from '@/systems/enhancement';
import { findItem } from '@/systems/inventory';
import { formatNumber } from '@/utils/format';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';

export function EnhancePage() {
  const player = useGameStore((s) => s.player)!;
  const enhanceItem = useGameStore((s) => s.enhanceItem);
  const { activeNav, navItems, handleNav, goWithFrom } = useGameNav();
  const { goBack } = useRedirectBack('/character?tab=equip');
  const [searchParams] = useSearchParams();

  const enhanceable = useMemo(() => getEnhanceableItems(player), [player]);
  const initialId = searchParams.get('item') ?? enhanceable[0]?.id;
  const [selectedId, setSelectedId] = useState(initialId ?? '');

  const selected = findItem(player, selectedId) ?? enhanceable[0];
  const preview = selected ? getEnhancePreview(selected) : null;
  const maxLevel = selected ? getMaxEnhanceLevel(selected) : 0;
  const atMax = selected ? (selected.enhance ?? 0) >= maxLevel : true;
  const enhanceError = selected ? canEnhanceItem(player, selected.id) : 'Chọn trang bị';

  const oreOwned = countMaterial(player, 'ore_mithril');
  const shardOwned = countMaterial(player, 'crystal_shard');
  const bagItems = enhanceable.filter((i) => !Object.values(player.equipment).includes(i.id));

  const handleEnhance = () => {
    if (!selected) return;
    enhanceItem(selected.id);
  };

  return (
    <GameFrame>
      <GameScreen className="game-screen--enhance">
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Cường Hóa" showOrnament onBack={goBack} />

          <div className="enhance-layout">
            <aside className="enhance-sidebar">
              <div className="enhance-sidebar__title">Trang bị đang mặc</div>
              <EquipItemList
                player={player}
                selectedId={selected?.id}
                onSelect={(item) => setSelectedId(item.id)}
              />

              {bagItems.length > 0 && (
                <>
                  <div className="enhance-sidebar__title">Trong túi</div>
                  <div className="enhance-bag-list">
                    {bagItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`equip-list__item ${selected?.id === item.id ? 'equip-list__item--active' : ''}`}
                          onClick={() => setSelectedId(item.id)}
                        >
                          <ItemIcon icon={item.icon} className="equip-list__icon" />
                          <div className="equip-list__info">
                            <span className={`equip-list__name equip-list__name--${item.rarity}`}>{item.name}</span>
                            <span className="equip-list__slot">Túi đồ · {RARITY_META[item.rarity].shortLabel}</span>
                          </div>
                          <span className="equip-list__level">+{item.enhance ?? 0}</span>
                        </button>
                      ))}
                  </div>
                </>
              )}
            </aside>

            <section className="enhance-main">
              {selected && preview ? (
                <>
                  <div className={`enhance-preview enhance-preview--${selected.rarity}`}>
                    <ItemIcon icon={selected.icon} className="enhance-preview__icon" />
                    <img className="enhance-preview__frame" src={RARITY_FRAMES[selected.rarity]} alt="" aria-hidden draggable={false} />
                    {selected.enhance !== undefined && selected.enhance > 0 && (
                      <span className="enhance-preview__level">+{selected.enhance}</span>
                    )}
                  </div>

                  <div className="enhance-item-info">
                    <h2 className={`enhance-item-info__name enhance-item-info__name--${selected.rarity}`}>
                      {selected.name}
                    </h2>
                    <p className="enhance-item-info__meta">
                      {getRarityTierLabel(selected.rarity)} · Cường hóa +{preview.currentLevel}/{maxLevel}
                    </p>
                  </div>

                  {!atMax ? (
                    <>
                      <StatCompareTable
                        currentStats={preview.currentStats}
                        nextStats={preview.nextStats}
                        statDeltas={preview.statDeltas}
                        currentLevel={preview.currentLevel}
                        nextLevel={preview.nextLevel}
                      />

                      <div className="enhance-rate">
                        Tỷ lệ thành công: <strong>{preview.successRate}%</strong>
                      </div>

                      <div className="enhance-materials">
                        <div className="enhance-materials__title">Nguyên liệu cần</div>
                        <div className="enhance-materials__grid">
                          <div className="enhance-mat">
                            <AncientIcon name="coin" size={18} className="enhance-mat__icon anc-icon--gold" />
                            <span className="enhance-mat__name">Vàng</span>
                            <span className={`enhance-mat__count ${player.gold >= preview.cost.gold ? 'enhance-mat__count--ok' : 'enhance-mat__count--bad'}`}>
                              {formatNumber(player.gold)}/{formatNumber(preview.cost.gold)}
                            </span>
                          </div>
                          <div className="enhance-mat">
                            <AncientIcon name="gem" size={18} className="enhance-mat__icon anc-icon--crystal" />
                            <span className="enhance-mat__name">Linh thạch</span>
                            <span className={`enhance-mat__count ${player.crystal >= preview.cost.crystal ? 'enhance-mat__count--ok' : 'enhance-mat__count--bad'}`}>
                              {formatNumber(player.crystal)}/{formatNumber(preview.cost.crystal)}
                            </span>
                          </div>
                          <div className="enhance-mat">
                            <ItemIcon icon={ITEM_TEMPLATES.ore_mithril.icon} className="enhance-mat__icon" />
                            <span className="enhance-mat__name">{ITEM_TEMPLATES.ore_mithril.name}</span>
                            <span className={`enhance-mat__count ${oreOwned >= preview.cost.ore ? 'enhance-mat__count--ok' : 'enhance-mat__count--bad'}`}>
                              {oreOwned}/{preview.cost.ore}
                            </span>
                          </div>
                          <div className="enhance-mat">
                            <ItemIcon icon={ITEM_TEMPLATES.crystal_shard.icon} className="enhance-mat__icon" />
                            <span className="enhance-mat__name">{ITEM_TEMPLATES.crystal_shard.name}</span>
                            <span className={`enhance-mat__count ${shardOwned >= preview.cost.shards ? 'enhance-mat__count--ok' : 'enhance-mat__count--bad'}`}>
                              {shardOwned}/{preview.cost.shards}
                            </span>
                          </div>
                        </div>
                      </div>

                      <GameButton
                        variant="primary"
                        className="enhance-btn"
                        onClick={handleEnhance}
                        disabled={!!enhanceError}
                      >
                        <AncientIcon name="sparkle" size={16} /> Cường Hóa
                      </GameButton>
                      <p className="enhance-hint enhance-hint--muted">
                        Cường hóa thất bại vẫn tiêu hao nguyên liệu.
                      </p>
                      {enhanceError && (
                        <p className="enhance-hint">{enhanceError}</p>
                      )}
                    </>
                  ) : (
                    <div className="enhance-max">
                      <AncientIcon name="check" size={24} className="anc-icon--gold" />
                      <p>Đã đạt cấp cường hóa tối đa (+{maxLevel})</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="enhance-empty">
                  <AncientIcon name="bag" size={32} className="anc-icon--gold" />
                  <p>Chưa có trang bị để cường hóa</p>
                  <GameButton variant="secondary" onClick={() => goWithFrom('/inventory')}>
                    Mở túi đồ
                  </GameButton>
                </div>
              )}
            </section>
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
