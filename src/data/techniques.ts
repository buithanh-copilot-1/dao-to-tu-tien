import type { PlayerStats } from '@/types/game';
import type { AncientIconName } from '@/components/common/AncientIcon';

export interface TechniqueDef {
  id: string;
  name: string;
  icon: AncientIconName;
  description: string;
  maxLevel: number;
  /** Linh thạch (crystal) để lĩnh ngộ ban đầu */
  learnCost: number;
  /** Linh thạch để nâng từ cấp L lên L+1 = upgradeBase * L */
  upgradeBase: number;
  /** Chỉ số cộng thêm cho MỖI cấp */
  bonusPerLevel: Partial<PlayerStats>;
  /** Tăng tốc tu luyện cộng thêm mỗi cấp (phần trăm dạng thập phân, vd 0.03 = +3%) */
  rateBonusPerLevel: number;
}

export const TECHNIQUES: TechniqueDef[] = [
  {
    id: 'dan_dong',
    name: 'Đan Đồng Quyết',
    icon: 'swirl',
    description: 'Công pháp nhập môn, đề cao tốc độ hấp thu linh khí.',
    maxLevel: 10,
    learnCost: 200,
    upgradeBase: 80,
    bonusPerLevel: { spirit: 6 },
    rateBonusPerLevel: 0.04,
  },
  {
    id: 'kim_cang',
    name: 'Kim Cang Bất Hoại',
    icon: 'shield',
    description: 'Luyện thể cương mãnh, thân thể bền bỉ như kim cang.',
    maxLevel: 10,
    learnCost: 400,
    upgradeBase: 140,
    bonusPerLevel: { defense: 24, hp: 360 },
    rateBonusPerLevel: 0.01,
  },
  {
    id: 'lang_van',
    name: 'Lăng Vân Bộ',
    icon: 'bolt',
    description: 'Thân pháp phiêu dật, tốc độ xuất thủ như mây trôi.',
    maxLevel: 10,
    learnCost: 400,
    upgradeBase: 140,
    bonusPerLevel: { speed: 5 },
    rateBonusPerLevel: 0.01,
  },
  {
    id: 'pha_quan',
    name: 'Phá Quân Kiếm Quyết',
    icon: 'sword',
    description: 'Kiếm ý sắc bén, một kiếm phá vạn pháp.',
    maxLevel: 10,
    learnCost: 600,
    upgradeBase: 200,
    bonusPerLevel: { attack: 40 },
    rateBonusPerLevel: 0.01,
  },
  {
    id: 'ngung_than',
    name: 'Ngưng Thần Thuật',
    icon: 'eye',
    description: 'Tĩnh tâm ngưng thần, thần thức và ngộ tính tăng vọt.',
    maxLevel: 10,
    learnCost: 600,
    upgradeBase: 200,
    bonusPerLevel: { spirit: 14, comprehension: 4 },
    rateBonusPerLevel: 0.02,
  },
  {
    id: 'thon_thien',
    name: 'Thôn Thiên Công',
    icon: 'realm',
    description: 'Đại đạo chí cao, nuốt trời hút đất, tu vi tiến triển thần tốc.',
    maxLevel: 10,
    learnCost: 2000,
    upgradeBase: 600,
    bonusPerLevel: { attack: 30, defense: 20, hp: 400, spirit: 10 },
    rateBonusPerLevel: 0.06,
  },
];

export function getTechnique(id: string): TechniqueDef | undefined {
  return TECHNIQUES.find((t) => t.id === id);
}

/** Linh thạch để nâng công pháp từ `level` lên `level + 1`. */
export function getTechniqueUpgradeCost(id: string, level: number): number {
  const def = getTechnique(id);
  if (!def) return Infinity;
  return Math.floor(def.upgradeBase * level);
}

/** Tổng chỉ số cộng từ toàn bộ công pháp đã học. */
export function getTechniqueStatBonus(techniques: Record<string, number> | undefined): Partial<PlayerStats> {
  const out: Partial<PlayerStats> = {};
  if (!techniques) return out;
  for (const [id, level] of Object.entries(techniques)) {
    const def = getTechnique(id);
    if (!def || level <= 0) continue;
    for (const k of Object.keys(def.bonusPerLevel) as (keyof PlayerStats)[]) {
      out[k] = (out[k] ?? 0) + (def.bonusPerLevel[k] ?? 0) * level;
    }
  }
  return out;
}

/** Hệ số nhân tốc độ tu luyện từ công pháp (1 + tổng %). */
export function getTechniqueRateMultiplier(techniques: Record<string, number> | undefined): number {
  if (!techniques) return 1;
  let bonus = 0;
  for (const [id, level] of Object.entries(techniques)) {
    const def = getTechnique(id);
    if (!def || level <= 0) continue;
    bonus += def.rateBonusPerLevel * level;
  }
  return 1 + bonus;
}
