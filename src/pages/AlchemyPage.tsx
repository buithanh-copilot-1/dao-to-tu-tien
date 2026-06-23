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
import { formatNumber } from '@/utils/format';
import { ALCHEMY_RECIPES, getTemplateName, getTemplateIcon } from '@/data/alchemy';
import { canCraft } from '@/systems/alchemy';
import { countByTemplate } from '@/systems/inventory';

export function AlchemyPage() {
  const player = useGameStore((s) => s.player)!;
  const craftPill = useGameStore((s) => s.craftPill);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Đan Dược" showOrnament onBack={goBack} />

          <GamePanel title="Đan Lô">
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Dùng linh dược và linh thạch để luyện chế đan dược, hỗ trợ tu luyện và đột phá.
            </div>
          </GamePanel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ALCHEMY_RECIPES.map((r) => {
              const err = canCraft(player, r);
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
                    <GameButton
                      variant="primary"
                      style={{ fontSize: 11 }}
                      disabled={!!err}
                      onClick={() => craftPill(r.id)}
                    >
                      {err ?? 'Luyện đan'}
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
