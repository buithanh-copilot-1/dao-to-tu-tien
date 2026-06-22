export interface LeaderboardEntry {
  rank: number;
  name: string;
  realm: string;
  power: number;
  isPlayer?: boolean;
}

export const NPC_LEADERBOARD: Omit<LeaderboardEntry, 'rank'>[] = [
  { name: 'Hồng Hoang Đạo Tổ', realm: 'Hồng Hoang Cảnh - Bậc 9', power: 88_520_000_000_000 },
  { name: 'Vô Thượng Tiên Đế', realm: 'Tiên Đế Cảnh - Bậc 8', power: 42_360_000_000_000 },
  { name: 'Thiên Đế Vô Cực', realm: 'Đại Đế Cảnh - Bậc 7', power: 18_952_360_000_000 },
  { name: 'Huyền Nữ Băng Tâm', realm: 'Chuẩn Đế Cảnh - Bậc 9', power: 7_456_780_000_000 },
  { name: 'Kiếm Thánh Vô Song', realm: 'Thánh Nhân Cảnh - Bậc 8', power: 2_534_560_000_000 },
  { name: 'Ma Tôn Diệt Thế', realm: 'Hỗn Nguyên Đại La - Bậc 9', power: 987_650_000_000 },
  { name: 'Lôi Đế Chấn Thiên', realm: 'Dao Tổ Cảnh - Bậc 8', power: 345_210_000_000 },
  { name: 'Băng Hậu Tuyệt Tình', realm: 'Đại La Kim Tiên - Bậc 7', power: 134_100_000_000 },
  { name: 'Hỏa Thần Viêm Đế', realm: 'Kim Tiên - Bậc 9', power: 62_450_000_000 },
  { name: 'Phong Vân Tán Nhân', realm: 'Chân Tiên Kỳ - Bậc 5', power: 8_236_000_000 },
];

export function buildLeaderboard(playerPower: number, playerName: string, playerRealm: string): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = NPC_LEADERBOARD.map((e) => ({ ...e, rank: 0 }));
  entries.push({ rank: 0, name: playerName, realm: playerRealm, power: playerPower, isPlayer: true });
  entries.sort((a, b) => b.power - a.power);
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}
