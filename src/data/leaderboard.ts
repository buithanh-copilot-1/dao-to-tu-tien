export interface LeaderboardEntry {
  rank: number;
  name: string;
  realm: string;
  power: number;
  isPlayer?: boolean;
}

export const NPC_LEADERBOARD: Omit<LeaderboardEntry, 'rank'>[] = [
  { name: 'Thiên Đế Vô Cực', realm: 'Kim Tiên - Bậc 5', power: 9_852_360_000 },
  { name: 'Huyền Nữ Băng Tâm', realm: 'Kim Tiên - Bậc 4', power: 7_456_780_000 },
  { name: 'Kiếm Thánh Vô Song', realm: 'Kim Tiên - Bậc 3', power: 5_234_560_000 },
  { name: 'Ma Tôn Diệt Thế', realm: 'Chân Tiên Kỳ - Bậc 9', power: 2_987_650_000 },
  { name: 'Lôi Đế Chấn Thiên', realm: 'Chân Tiên Kỳ - Bậc 8', power: 1_745_210_000 },
  { name: 'Băng Hậu Tuyệt Tình', realm: 'Chân Tiên Kỳ - Bậc 7', power: 934_100_000 },
  { name: 'Hỏa Thần Viêm Đế', realm: 'Chân Tiên Kỳ - Bậc 6', power: 623_450_000 },
  { name: 'Phong Vân Tán Nhân', realm: 'Đại Thừa Kỳ - Bậc 5', power: 185_236_000 },
  { name: 'Nguyệt Ảnh Tiên Tử', realm: 'Đại Thừa Kỳ - Bậc 4', power: 128_900_000 },
  { name: 'Hắc Sát Kiếm Khách', realm: 'Đại Thừa Kỳ - Bậc 3', power: 95_600_000 },
];

export function buildLeaderboard(playerPower: number, playerName: string, playerRealm: string): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = NPC_LEADERBOARD.map((e) => ({ ...e, rank: 0 }));
  entries.push({ rank: 0, name: playerName, realm: playerRealm, power: playerPower, isPlayer: true });
  entries.sort((a, b) => b.power - a.power);
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}
