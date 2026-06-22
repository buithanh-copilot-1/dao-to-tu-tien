export interface ArenaOpponent {
  id: string;
  name: string;
  icon: string;
  realm: string;
  power: number;
  goldReward: number;
  crystalReward: number;
}

export const ARENA_OPPONENTS: ArenaOpponent[] = [
  { id: 'a1', name: 'Tán Tu Lâm Phong', icon: '🧙', realm: 'Luyện Khí Kỳ - Bậc 3', power: 800, goldReward: 100, crystalReward: 20 },
  { id: 'a2', name: 'Kiếm Khách Vô Danh', icon: '⚔️', realm: 'Luyện Khí Kỳ - Bậc 9', power: 3000, goldReward: 300, crystalReward: 50 },
  { id: 'a3', name: 'Trúc Cơ Đạo Nhân', icon: '🧘', realm: 'Trúc Cơ Kỳ - Bậc 5', power: 15000, goldReward: 800, crystalReward: 100 },
  { id: 'a4', name: 'Kim Đan Chân Nhân', icon: '🔥', realm: 'Kim Đan Kỳ - Bậc 3', power: 80000, goldReward: 2000, crystalReward: 300 },
  { id: 'a5', name: 'Nguyên Anh Lão Tổ', icon: '👴', realm: 'Nguyên Anh Kỳ - Bậc 7', power: 500000, goldReward: 8000, crystalReward: 1000 },
  { id: 'a6', name: 'Hóa Thần Tôn Giả', icon: '🌟', realm: 'Hóa Thần Kỳ - Bậc 5', power: 2000000, goldReward: 20000, crystalReward: 3000 },
];

export const ARENA_DAILY_LIMIT = 10;
