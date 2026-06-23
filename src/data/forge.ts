import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import type { RecipeIngredient } from '@/data/alchemy';

export interface ForgeRecipe {
  id: string;
  /** Template trang bị tạo ra */
  resultId: string;
  ingredients: RecipeIngredient[];
  crystalCost: number;
  goldCost: number;
  description: string;
}

export const FORGE_RECIPES: ForgeRecipe[] = [
  {
    id: 'forge_bracer',
    resultId: 'bracer_iron',
    ingredients: [{ templateId: 'ore_mithril', quantity: 2 }, { templateId: 'crystal_shard', quantity: 5 }],
    crystalCost: 0,
    goldCost: 1000,
    description: 'Thiết Hộ Thủ — Phẩm Lục, phòng ngự + công kích.',
  },
  {
    id: 'forge_ring',
    resultId: 'ring_longwen',
    ingredients: [{ templateId: 'crystal_shard', quantity: 10 }],
    crystalCost: 200,
    goldCost: 0,
    description: 'Long Văn Nhẫn — Phẩm Lục, công kích + thần thức.',
  },
  {
    id: 'forge_helm',
    resultId: 'helm_taiji',
    ingredients: [{ templateId: 'ore_mithril', quantity: 4 }, { templateId: 'herb_lingzhi', quantity: 3 }],
    crystalCost: 500,
    goldCost: 0,
    description: 'Thái Cực Mão — Phẩm Vàng, phòng ngự + khí huyết.',
  },
  {
    id: 'forge_belt',
    resultId: 'belt_cloud',
    ingredients: [{ templateId: 'ore_mithril', quantity: 6 }, { templateId: 'soul_shard', quantity: 2 }],
    crystalCost: 1200,
    goldCost: 0,
    description: 'Vân Ti Đái — Phẩm Vàng, khí huyết + phòng ngự.',
  },
];

export function getForgeRecipe(id: string): ForgeRecipe | undefined {
  return FORGE_RECIPES.find((r) => r.id === id);
}

export function getTemplateName(templateId: string): string {
  return ITEM_TEMPLATES[templateId]?.name ?? templateId;
}

export function getTemplateIcon(templateId: string): string {
  return ITEM_TEMPLATES[templateId]?.icon ?? '❓';
}

export function getTemplateStats(templateId: string) {
  return ITEM_TEMPLATES[templateId]?.stats;
}
