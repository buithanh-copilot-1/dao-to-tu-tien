import { ITEM_TEMPLATES } from '@/data/itemTemplates';

export interface RecipeIngredient {
  templateId: string;
  quantity: number;
}

export interface AlchemyRecipe {
  id: string;
  /** Template đan dược tạo ra */
  resultId: string;
  resultQty: number;
  /** Nguyên liệu tiêu hao */
  ingredients: RecipeIngredient[];
  /** Linh thạch tiêu hao */
  crystalCost: number;
  /** Vàng tiêu hao */
  goldCost: number;
  description: string;
}

export const ALCHEMY_RECIPES: AlchemyRecipe[] = [
  {
    id: 'recipe_qi',
    resultId: 'pill_qi',
    resultQty: 1,
    ingredients: [{ templateId: 'herb_lingzhi', quantity: 2 }],
    crystalCost: 0,
    goldCost: 200,
    description: 'Tụ Khí Đan — tu vi +1,000 khi dùng.',
  },
  {
    id: 'recipe_spirit',
    resultId: 'pill_spirit',
    resultQty: 1,
    ingredients: [
      { templateId: 'herb_lingzhi', quantity: 3 },
      { templateId: 'ore_mithril', quantity: 1 },
    ],
    crystalCost: 100,
    goldCost: 0,
    description: 'Ngưng Thần Đan — tu vi +5,000 khi dùng.',
  },
  {
    id: 'recipe_break',
    resultId: 'pill_break',
    resultQty: 1,
    ingredients: [
      { templateId: 'ore_mithril', quantity: 2 },
      { templateId: 'soul_shard', quantity: 1 },
    ],
    crystalCost: 500,
    goldCost: 0,
    description: 'Đột Phá Đan — tu vi +2,000 khi dùng.',
  },
];

export function getRecipe(id: string): AlchemyRecipe | undefined {
  return ALCHEMY_RECIPES.find((r) => r.id === id);
}

export function getTemplateName(templateId: string): string {
  return ITEM_TEMPLATES[templateId]?.name ?? templateId;
}

export function getTemplateIcon(templateId: string): string {
  return ITEM_TEMPLATES[templateId]?.icon ?? '❓';
}
