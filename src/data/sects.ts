import type { ElementType, PlayerStats } from '@/types/game';
import type { AncientIconName } from '@/components/common/AncientIcon';

/** Chức vị trong tông môn — đạt được khi cống hiến tích lũy đủ ngưỡng. */
export interface SectRankDef {
  name: string;
  contributionReq: number;
}

export interface SectDef {
  id: string;
  name: string;
  element: ElementType;
  icon: AncientIconName;
  description: string;
  /** Vàng để bái nhập tông môn */
  joinCost: number;
  /** Chỉ số cộng thêm cho MỖI bậc chức vị đã đạt */
  bonusPerRank: Partial<PlayerStats>;
}

/** Thang chức vị dùng chung cho mọi tông môn. */
export const SECT_RANKS: SectRankDef[] = [
  { name: 'Ngoại Môn Đệ Tử', contributionReq: 0 },
  { name: 'Nội Môn Đệ Tử', contributionReq: 500 },
  { name: 'Thân Truyền Đệ Tử', contributionReq: 2000 },
  { name: 'Chân Truyền Đệ Tử', contributionReq: 6000 },
  { name: 'Trưởng Lão', contributionReq: 15000 },
  { name: 'Thái Thượng Trưởng Lão', contributionReq: 40000 },
];

export const SECTS: SectDef[] = [
  {
    id: 'kim_kiem',
    name: 'Kim Kiếm Môn',
    element: 'metal',
    icon: 'sword',
    description: 'Lấy kiếm khí sắc bén làm gốc, đệ tử công kích kinh người.',
    joinCost: 1000,
    bonusPerRank: { attack: 60, speed: 6 },
  },
  {
    id: 'thanh_moc',
    name: 'Thanh Mộc Cốc',
    element: 'wood',
    icon: 'meditate',
    description: 'Sinh cơ bừng bừng, tu sĩ khí huyết dồi dào, ngộ tính hơn người.',
    joinCost: 1000,
    bonusPerRank: { hp: 900, comprehension: 8 },
  },
  {
    id: 'huyen_thuy',
    name: 'Huyền Thủy Cung',
    element: 'water',
    icon: 'swirl',
    description: 'Thủy nhu khắc cương, thần thức tinh thuần, thân pháp linh hoạt.',
    joinCost: 1000,
    bonusPerRank: { spirit: 26, speed: 10 },
  },
  {
    id: 'liet_hoa',
    name: 'Liệt Hỏa Tông',
    element: 'fire',
    icon: 'flame',
    description: 'Hỏa diễm thiêu thiên, công kích bạo liệt, tốc độ xuất thủ nhanh.',
    joinCost: 1000,
    bonusPerRank: { attack: 90, speed: 8 },
  },
  {
    id: 'hau_tho',
    name: 'Hậu Thổ Điện',
    element: 'earth',
    icon: 'shield',
    description: 'Vững như thái sơn, phòng ngự kiên cố, khí huyết hùng hậu.',
    joinCost: 1000,
    bonusPerRank: { defense: 80, hp: 1200 },
  },
];

export function getSect(id: string): SectDef | undefined {
  return SECTS.find((s) => s.id === id);
}

/** Bậc chức vị (0-based) đạt được với mức cống hiến tích lũy cho trước. */
export function getSectRankFromContribution(contribution: number): number {
  let rank = 0;
  for (let i = 0; i < SECT_RANKS.length; i++) {
    if (contribution >= SECT_RANKS[i].contributionReq) rank = i;
  }
  return rank;
}

export function getSectRankName(rank: number): string {
  return SECT_RANKS[Math.min(rank, SECT_RANKS.length - 1)]?.name ?? 'Đệ Tử';
}

/** Cống hiến cần để lên bậc kế tiếp, hoặc null nếu đã tối đa. */
export function getNextRankReq(rank: number): number | null {
  const next = SECT_RANKS[rank + 1];
  return next ? next.contributionReq : null;
}

/** Tổng chỉ số tông môn cộng cho người chơi tại bậc `rank` (đã nhân số bậc). */
export function getSectStatBonus(sectId: string, rank: number): Partial<PlayerStats> {
  const sect = getSect(sectId);
  if (!sect) return {};
  const tiers = rank + 1; // Ngoại môn (rank 0) đã được 1 phần
  const out: Partial<PlayerStats> = {};
  for (const k of Object.keys(sect.bonusPerRank) as (keyof PlayerStats)[]) {
    out[k] = (sect.bonusPerRank[k] ?? 0) * tiers;
  }
  return out;
}
