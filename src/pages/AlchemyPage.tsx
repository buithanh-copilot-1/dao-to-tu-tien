import { useState, useEffect, useRef } from 'react';
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

const RECIPE_DURATIONS: Record<string, number> = {
  recipe_qi: 3000,
  recipe_spirit: 5000,
  recipe_break: 8000,
};

export function AlchemyPage() {
  const player = useGameStore((s) => s.player)!;
  const craftPill = useGameStore((s) => s.craftPill);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  // Local crafting state
  const [craftingRecipeId, setCraftingRecipeId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  useEffect(() => {
    if (craftingRecipeId) {
      const duration = RECIPE_DURATIONS[craftingRecipeId] || 3000;
      durationRef.current = duration;
      startTimeRef.current = Date.now();
      setProgress(0);
      setTimeLeft(duration / 1000);

      const tick = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const currentProgress = Math.min((elapsed / durationRef.current) * 100, 100);
        setProgress(currentProgress);

        const remaining = Math.max((durationRef.current - elapsed) / 1000, 0);
        setTimeLeft(remaining);

        if (elapsed >= durationRef.current) {
          // Finish crafting
          if (timerRef.current) clearInterval(timerRef.current);
          craftPill(craftingRecipeId);
          setCraftingRecipeId(null);
          setProgress(0);
        }
      };

      timerRef.current = setInterval(tick, 100);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [craftingRecipeId, craftPill]);

  const startCrafting = (recipeId: string) => {
    if (craftingRecipeId) return; // Already crafting
    setCraftingRecipeId(recipeId);
  };

  const isCrafting = craftingRecipeId !== null;

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="alchemy-body">
          <PageHead title="Đan Dược" showOrnament onBack={goBack} />

          {/* Đan Lô Panel */}
          <section className={`alchemy-cauldron-panel ${isCrafting ? 'cooking' : ''}`}>
            <h3 className="alchemy-cauldron-title">ĐAN LÔ</h3>
            
            <div className="alchemy-cauldron-platform">
              <div className="alchemy-cauldron-container">
                <div className="alchemy-cauldron-rune-ring" />
                <div className="alchemy-cauldron-glow" />
                <div className="alchemy-cauldron-fire">🔥</div>
                {/* Cauldron SVG */}
                <svg className="alchemy-cauldron-svg" viewBox="0 0 24 24">
                  <path d="M19,10 C19,5.58 15.87,2 12,2 C8.13,2 5,5.58 5,10 C5,13.7 7.18,16.89 10.25,17.7 C9.5,19.3 8.3,20.5 7,21 L17,21 C15.7,20.5 14.5,19.3 13.75,17.7 C16.82,16.89 19,13.7 19,10 Z M12,4 C14.76,4 17,6.24 17,9 L7,9 C7,6.24 9.24,4 12,4 Z M12,15 C9.79,15 8,13.21 8,11 L16,11 C16,13.21 14.21,15 12,15 Z" />
                </svg>
              </div>
            </div>
            
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 8 }}>
              {isCrafting 
                ? 'Lửa hỏa diễm đang bốc cháy! Đang luyện đan dược...'
                : 'Đan lô trống. Chọn một công thức phía dưới để bắt đầu luyện đan.'}
            </div>

            <div className="alchemy-progress-bar-wrap">
              <div 
                className="alchemy-progress-bar-fill" 
                style={{ width: `${progress}%` }} 
              />
              <span className="alchemy-progress-text">
                {isCrafting 
                  ? `ĐANG LUYỆN CHẾ (${timeLeft.toFixed(1)}s)` 
                  : 'ĐAN LÔ SẴN SÀNG'}
              </span>
            </div>
          </section>

          {/* Recipes List */}
          <div className="alchemy-recipes-list">
            {ALCHEMY_RECIPES.map((r) => {
              const err = canCraft(player, r);
              const recipeDuration = RECIPE_DURATIONS[r.id] || 3000;
              const isThisCrafting = craftingRecipeId === r.id;

              return (
                <div key={r.id} className="alchemy-recipe-row">
                  {/* Recipe Information */}
                  <div className="alchemy-recipe-info">
                    <CatalogItemButton
                      templateId={r.resultId}
                      className="alchemy-pill-icon-wrap"
                      aria-label={getTemplateName(r.resultId)}
                    >
                      <ItemIcon icon={getTemplateIcon(r.resultId)} />
                    </CatalogItemButton>
                    <div className="alchemy-pill-details">
                      <div className="alchemy-pill-name">{getTemplateName(r.resultId)}</div>
                      <div className="alchemy-pill-desc">{r.description}</div>
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                      ⏱️ {recipeDuration / 1000}s
                    </div>
                  </div>

                  {/* Ingredients Chips */}
                  <div className="alchemy-ingredients-wrap">
                    {r.ingredients.map((ing) => {
                      const have = countByTemplate(player, ing.templateId);
                      const ok = have >= ing.quantity;
                      return (
                        <CatalogItemButton
                          key={ing.templateId}
                          templateId={ing.templateId}
                          className={`alchemy-ing-chip ${ok ? 'ok' : 'fail'}`}
                        >
                          <ItemIcon icon={getTemplateIcon(ing.templateId)} />
                          {getTemplateName(ing.templateId)} {have}/{ing.quantity}
                        </CatalogItemButton>
                      );
                    })}
                    {r.goldCost > 0 && (
                      <span className={`alchemy-ing-chip ${player.gold >= r.goldCost ? 'ok' : 'fail'}`}>
                        <AncientIcon name="coin" size={10} className="anc-icon--gold" />
                        {formatNumber(r.goldCost)}
                      </span>
                    )}
                    {r.crystalCost > 0 && (
                      <span className={`alchemy-ing-chip ${player.crystal >= r.crystalCost ? 'ok' : 'fail'}`}>
                        <AncientIcon name="gem" size={10} className="anc-icon--crystal" />
                        {formatNumber(r.crystalCost)}
                      </span>
                    )}
                  </div>

                  {/* Craft Button */}
                  <div className="alchemy-craft-action">
                    <GameButton
                      variant={isThisCrafting ? 'hex' : 'primary'}
                      disabled={isCrafting || !!err}
                      onClick={() => startCrafting(r.id)}
                    >
                      {isThisCrafting ? 'Đang luyện...' : err ?? 'Luyện đan'}
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
