import type { Player } from '@/types/game';
import { createItem } from '@/data/itemTemplates';
import { getRecipe, type AlchemyRecipe } from '@/data/alchemy';
import { addItem, countByTemplate, removeByTemplate } from '@/systems/inventory';

type AlchemyResult = { player: Player; error?: string; message?: string };

/** Kiểm tra đủ điều kiện luyện đan (không đổi player). */
export function canCraft(player: Player, recipe: AlchemyRecipe): string | null {
  if (player.gold < recipe.goldCost) return 'Không đủ vàng';
  if (player.crystal < recipe.crystalCost) return 'Không đủ linh thạch';
  for (const ing of recipe.ingredients) {
    if (countByTemplate(player, ing.templateId) < ing.quantity) return 'Thiếu nguyên liệu';
  }
  return null;
}

/** Luyện đan: tiêu nguyên liệu + tài nguyên, thêm đan dược vào túi. */
export function craftPill(player: Player, recipeId: string): AlchemyResult {
  const recipe = getRecipe(recipeId);
  if (!recipe) return { player, error: 'Không tìm thấy đan phương' };

  const err = canCraft(player, recipe);
  if (err) return { player, error: err };

  let updated: Player = { ...player, gold: player.gold - recipe.goldCost, crystal: player.crystal - recipe.crystalCost };
  for (const ing of recipe.ingredients) {
    updated = removeByTemplate(updated, ing.templateId, ing.quantity);
  }

  const result = addItem(updated, createItem(recipe.resultId, recipe.resultQty));
  if (result.error) return { player, error: result.error };

  return { player: result.player, message: 'Luyện đan thành công!' };
}
