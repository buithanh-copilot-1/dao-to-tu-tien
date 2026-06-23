import type { PlayerStats } from '@/types/game';
import type { AncientIconName } from '@/components/common/AncientIcon';

export type CompanionCurrency = 'gold' | 'crystal' | 'jade';

export interface CompanionDef {
  id: string;
  name: string;
  icon: AncientIconName;
  description: string;
  maxLevel: number;
  /** Tài nguyên để thu phục/chiêu mộ */
  unlockCost: number;
  unlockCurrency: CompanionCurrency;
  /** Linh thạch để nâng từ cấp L lên L+1 = upgradeBase * L */
  upgradeBase: number;
  /** Chỉ số cộng cho MỖI cấp khi xuất chiến/cưỡi */
  bonusPerLevel: Partial<PlayerStats>;
}

export const PETS: CompanionDef[] = [
  {
    id: 'pet_huo_ly',
    name: 'Hỏa Linh Ly',
    icon: 'flame',
    description: 'Tiểu hồ ly ngậm hỏa châu, tăng công kích cho chủ nhân.',
    maxLevel: 20,
    unlockCost: 5000,
    unlockCurrency: 'gold',
    upgradeBase: 120,
    bonusPerLevel: { attack: 45, speed: 3 },
  },
  {
    id: 'pet_huyen_quy',
    name: 'Huyền Vũ Quy',
    icon: 'shield',
    description: 'Linh quy ngàn năm, giáp cứng vô song, tăng phòng ngự & khí huyết.',
    maxLevel: 20,
    unlockCost: 30,
    unlockCurrency: 'jade',
    upgradeBase: 160,
    bonusPerLevel: { defense: 35, hp: 700 },
  },
  {
    id: 'pet_kim_bang',
    name: 'Kim Sí Bằng',
    icon: 'bolt',
    description: 'Đại bằng kim sí, tốc độ như chớp, tăng thân pháp & thần thức.',
    maxLevel: 20,
    unlockCost: 60,
    unlockCurrency: 'jade',
    upgradeBase: 200,
    bonusPerLevel: { speed: 8, spirit: 16 },
  },
];

export const MOUNTS: CompanionDef[] = [
  {
    id: 'mount_van_lan',
    name: 'Vân Lân Thú',
    icon: 'meditate',
    description: 'Thú cưỡi vân du, khí huyết dồi dào, đi mây về gió.',
    maxLevel: 20,
    unlockCost: 8000,
    unlockCurrency: 'gold',
    upgradeBase: 140,
    bonusPerLevel: { hp: 900, defense: 20 },
  },
  {
    id: 'mount_ngao_long',
    name: 'Ngạo Long Câu',
    icon: 'realm',
    description: 'Long câu ngạo nghễ, uy áp tứ phương, tăng công kích & khí huyết.',
    maxLevel: 20,
    unlockCost: 40,
    unlockCurrency: 'jade',
    upgradeBase: 180,
    bonusPerLevel: { attack: 50, hp: 600 },
  },
  {
    id: 'mount_bach_ho',
    name: 'Bạch Hổ Vương',
    icon: 'sword',
    description: 'Bạch hổ sơn quân, sát khí ngút trời, tăng công kích & thân pháp.',
    maxLevel: 20,
    unlockCost: 80,
    unlockCurrency: 'jade',
    upgradeBase: 220,
    bonusPerLevel: { attack: 70, speed: 6 },
  },
];

export function getCompanion(defs: CompanionDef[], id: string): CompanionDef | undefined {
  return defs.find((d) => d.id === id);
}

export function getCompanionUpgradeCost(def: CompanionDef, level: number): number {
  return Math.floor(def.upgradeBase * level);
}

/** Chỉ số cộng từ companion đang kích hoạt. */
export function getCompanionBonus(
  defs: CompanionDef[],
  owned: Record<string, number> | undefined,
  activeId: string | undefined,
): Partial<PlayerStats> {
  const out: Partial<PlayerStats> = {};
  if (!owned || !activeId) return out;
  const level = owned[activeId] ?? 0;
  const def = getCompanion(defs, activeId);
  if (!def || level <= 0) return out;
  for (const k of Object.keys(def.bonusPerLevel) as (keyof PlayerStats)[]) {
    out[k] = (def.bonusPerLevel[k] ?? 0) * level;
  }
  return out;
}
