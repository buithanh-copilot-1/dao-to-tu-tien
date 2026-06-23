import type { Player } from '@/types/game';
import { createItem } from '@/data/itemTemplates';
import { getForgeRecipe, type ForgeRecipe } from '@/data/forge';
import { addItem, countByTemplate, removeByTemplate } from '@/systems/inventory';

type ForgeResult = { player: Player; error?: string; message?: string };

/** Kiểm tra đủ điều kiện luyện khí (không đổi player). */
export function canForge(player: Player, recipe: ForgeRecipe): string | null {
  if (player.gold < recipe.goldCost) return 'Không đủ vàng';
  if (player.crystal < recipe.crystalCost) return 'Không đủ linh thạch';
  for (const ing of recipe.ingredients) {
    if (countByTemplate(player, ing.templateId) < ing.quantity) return 'Thiếu nguyên liệu';
  }
  return null;
}

/** Luyện khí: tiêu nguyên liệu + tài nguyên, rèn ra trang bị mới. */
export function forgeEquipment(player: Player, recipeId: string): ForgeResult {
  const recipe = getForgeRecipe(recipeId);
  if (!recipe) return { player, error: 'Không tìm thấy đồ phổ' };

  const err = canForge(player, recipe);
  if (err) return { player, error: err };

  let updated: Player = { ...player, gold: player.gold - recipe.goldCost, crystal: player.crystal - recipe.crystalCost };
  for (const ing of recipe.ingredients) {
    updated = removeByTemplate(updated, ing.templateId, ing.quantity);
  }

  const result = addItem(updated, createItem(recipe.resultId, 1));
  if (result.error) return { player, error: result.error };

  return { player: result.player, message: 'Luyện khí thành công!' };
}
