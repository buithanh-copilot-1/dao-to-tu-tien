import type { PlayerStats } from '@/types/game';
import type { AncientIconName } from '@/components/common/AncientIcon';

export interface TalentDef {
  id: string;
  name: string;
  icon: AncientIconName;
  description: string;
  maxLevel: number;
  /** Chỉ số cộng thêm cho MỖI điểm thiên phú đã đầu tư */
  bonusPerLevel: Partial<PlayerStats>;
}

/** Mỗi điểm thiên phú đến từ một lần đột phá. */
export const TALENTS: TalentDef[] = [
  {
    id: 'cuong_the',
    name: 'Cường Thể',
    icon: 'heart',
    description: 'Tôi luyện thân thể, khí huyết tăng mạnh.',
    maxLevel: 20,
    bonusPerLevel: { hp: 500 },
  },
  {
    id: 'loi_trao',
    name: 'Lợi Trảo',
    icon: 'sword',
    description: 'Móng vuốt sắc bén, công kích tăng cao.',
    maxLevel: 20,
    bonusPerLevel: { attack: 35 },
  },
  {
    id: 'kien_giap',
    name: 'Kiên Giáp',
    icon: 'shield',
    description: 'Da thịt rắn chắc, phòng ngự vững vàng.',
    maxLevel: 20,
    bonusPerLevel: { defense: 22 },
  },
  {
    id: 'phong_hanh',
    name: 'Phong Hành',
    icon: 'bolt',
    description: 'Bước chân theo gió, thân pháp nhanh nhẹn.',
    maxLevel: 20,
    bonusPerLevel: { speed: 4 },
  },
  {
    id: 'linh_giac',
    name: 'Linh Giác',
    icon: 'swirl',
    description: 'Cảm ứng linh khí, thần thức nhạy bén.',
    maxLevel: 20,
    bonusPerLevel: { spirit: 12 },
  },
  {
    id: 'tue_can',
    name: 'Tuệ Căn',
    icon: 'eye',
    description: 'Căn cơ thông tuệ, ngộ tính hơn người.',
    maxLevel: 20,
    bonusPerLevel: { comprehension: 5 },
  },
];

export function getTalent(id: string): TalentDef | undefined {
  return TALENTS.find((t) => t.id === id);
}

/** Tổng số điểm thiên phú đã đầu tư. */
export function getSpentTalentPoints(talents: Record<string, number> | undefined): number {
  if (!talents) return 0;
  return Object.values(talents).reduce((a, b) => a + b, 0);
}

/** Tổng chỉ số cộng từ toàn bộ thiên phú đã điểm. */
export function getTalentStatBonus(talents: Record<string, number> | undefined): Partial<PlayerStats> {
  const out: Partial<PlayerStats> = {};
  if (!talents) return out;
  for (const [id, level] of Object.entries(talents)) {
    const def = getTalent(id);
    if (!def || level <= 0) continue;
    for (const k of Object.keys(def.bonusPerLevel) as (keyof PlayerStats)[]) {
      out[k] = (out[k] ?? 0) + (def.bonusPerLevel[k] ?? 0) * level;
    }
  }
  return out;
}
