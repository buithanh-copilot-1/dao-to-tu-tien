import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  GamePanel,
  GameButton,
  AncientIcon,
  ItemIcon,
  CatalogItemButton,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { STAT_META } from '@/utils/stats';
import { formatNumber } from '@/utils/format';
import type { PlayerStats } from '@/types/game';
import { FORGE_RECIPES, getTemplateName, getTemplateIcon, getTemplateStats } from '@/data/forge';
import { canForge } from '@/systems/forge';
import { countByTemplate } from '@/systems/inventory';

export function ForgePage() {
  const player = useGameStore((s) => s.player)!;
  const forgeEquipment = useGameStore((s) => s.forgeEquipment);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Luyện Khí" showOrnament onBack={goBack} />

          <GamePanel title="Luyện Khí Lô">
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Dùng huyền thiết và linh thạch rèn đúc pháp khí, trang bị tăng cường lực chiến.
            </div>
          </GamePanel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FORGE_RECIPES.map((r) => {
              const err = canForge(player, r);
              const stats = getTemplateStats(r.resultId) ?? {};
              const statKeys = Object.keys(stats) as (keyof PlayerStats)[];
              return (
                <div key={r.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CatalogItemButton
                      templateId={r.resultId}
                      className="entity-icon entity-icon--sm catalog-chip-btn"
                      aria-label={getTemplateName(r.resultId)}
                    >
                      <ItemIcon icon={getTemplateIcon(r.resultId)} className="reward-item-icon" />
                    </CatalogItemButton>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>{getTemplateName(r.resultId)}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.description}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                    {statKeys.map((k) => (
                      <span key={k} className="meta-stat" style={{ fontSize: 10, color: 'var(--green-stat)' }}>
                        <AncientIcon name={STAT_META[k].icon} size={12} className="anc-icon--jade" />
                        {STAT_META[k].label} +{formatNumber(stats[k] ?? 0)}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                    {r.ingredients.map((ing) => {
                      const have = countByTemplate(player, ing.templateId);
                      const ok = have >= ing.quantity;
                      return (
                        <CatalogItemButton
                          key={ing.templateId}
                          templateId={ing.templateId}
                          className="meta-stat catalog-chip-btn"
                          style={{ fontSize: 10, color: ok ? 'var(--green-stat)' : 'var(--red-alert)' }}
                        >
                          <ItemIcon icon={getTemplateIcon(ing.templateId)} className="reward-item-icon" />
                          {getTemplateName(ing.templateId)} {have}/{ing.quantity}
                        </CatalogItemButton>
                      );
                    })}
                    {r.goldCost > 0 && (
                      <span className="meta-stat" style={{ fontSize: 10, color: player.gold >= r.goldCost ? 'var(--green-stat)' : 'var(--red-alert)' }}>
                        <AncientIcon name="coin" size={12} className="anc-icon--gold" /> {formatNumber(r.goldCost)}
                      </span>
                    )}
                    {r.crystalCost > 0 && (
                      <span className="meta-stat" style={{ fontSize: 10, color: player.crystal >= r.crystalCost ? 'var(--green-stat)' : 'var(--red-alert)' }}>
                        <AncientIcon name="gem" size={12} className="anc-icon--crystal" /> {formatNumber(r.crystalCost)}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <GameButton variant="primary" style={{ fontSize: 11 }} disabled={!!err} onClick={() => forgeEquipment(r.id)}>
                      {err ?? 'Luyện khí'}
                    </GameButton>
                  </div>
                </div>
              );
            })}
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
