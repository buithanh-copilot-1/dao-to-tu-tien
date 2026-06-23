export const SPIRIT_ROOT_MAX = 10;

export function getSpiritRootUpgradeCost(level: number): { gold: number; crystal: number } {
  return {
    gold: 400 * level * level,
    crystal: 30 * level * level,
  };
}

/** Hệ số nhân chỉ số hệ ngũ hành từ cấp linh căn (cấp 1 = 100%). */
export function getSpiritRootStatMultiplier(level: number): number {
  const safe = Math.max(1, Math.min(level, SPIRIT_ROOT_MAX));
  return 1 + (safe - 1) * 0.12;
}
