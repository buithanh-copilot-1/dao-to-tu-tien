import type { Rarity } from '@/types/game';

export interface RarityMeta {
  level: number;
  label: string;
  shortLabel: string;
  sortWeight: number;
}

export const RARITY_META: Record<Rarity, RarityMeta> = {
  common: { level: 1, label: 'Phẩm Trắng', shortLabel: 'Trắng', sortWeight: 5 },
  uncommon: { level: 2, label: 'Phẩm Lam', shortLabel: 'Lam', sortWeight: 4 },
  rare: { level: 3, label: 'Phẩm Lục', shortLabel: 'Lục', sortWeight: 3 },
  epic: { level: 4, label: 'Phẩm Vàng', shortLabel: 'Vàng', sortWeight: 2 },
  legendary: { level: 5, label: 'Phẩm Cam', shortLabel: 'Cam', sortWeight: 1 },
  mythic: { level: 6, label: 'Phẩm Đỏ', shortLabel: 'Đỏ', sortWeight: 0 },
};

export const RARITY_SORT_WEIGHT: Record<Rarity, number> = {
  common: RARITY_META.common.sortWeight,
  uncommon: RARITY_META.uncommon.sortWeight,
  rare: RARITY_META.rare.sortWeight,
  epic: RARITY_META.epic.sortWeight,
  legendary: RARITY_META.legendary.sortWeight,
  mythic: RARITY_META.mythic.sortWeight,
};

export function getRarityTierLabel(rarity: Rarity): string {
  const meta = RARITY_META[rarity];
  return `Cấp ${meta.level} · ${meta.label}`;
}

/** Số sao phẩm chất hiển thị trên ô trang bị (1–6) */
export function getRarityStarCount(rarity: Rarity): number {
  return RARITY_META[rarity].level;
}
