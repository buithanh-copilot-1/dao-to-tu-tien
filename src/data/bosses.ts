import { getRealmPowerScale, getRealmShortLabel } from '@/data/realms';
import type { BossDef } from '@/data/dungeons';

function makeBoss(
  id: string,
  name: string,
  icon: string,
  description: string,
  minRealmId: number,
  tier = 6,
  powerMul = 6,
  hpMul = 22,
  rewardMul = 1,
): BossDef {
  const scale = getRealmPowerScale(minRealmId, tier);
  const power = Math.max(100, Math.floor(400 * scale * powerMul));
  return {
    id,
    name,
    icon,
    description,
    minRealmId,
    power,
    hp: Math.floor(power * hpMul),
    goldReward: Math.floor(500 * scale * 2 * rewardMul),
    crystalReward: Math.floor(200 * scale * rewardMul),
    jadeReward: Math.max(5, Math.floor(minRealmId * 10 + tier * 2)),
  };
}

/** Boss thế giới — mở khóa theo cảnh giới, sức mạnh scale theo cấp */
export const BOSSES: BossDef[] = [
  // Luyện Khí Kỳ
  makeBoss('boss_1', 'Hắc Phong Yêu Vương', '👹', 'Yêu vương cấp luyện khí, thường xuất hiện ngoài núi', 0, 5, 5, 20),
  makeBoss('boss_1b', 'Thanh Lang Yêu Tướng', '🐺', 'Đầu lĩnh yêu lang, tốc độ kinh nhân', 0, 8, 7, 18),

  // Trúc Cơ Kỳ
  makeBoss('boss_2a', 'Độc Xà Yêu Cơ', '🐍', 'Yêu xà tu luyện trăm năm, độc khí lan trời', 1, 5, 6, 22),
  makeBoss('boss_2b', 'Lôi Tổ Hộ Vệ', '⚡', 'Hộ vệ động phủ cổ, chưởng lôi uy lực', 1, 8, 8, 20),

  // Kim Đan Kỳ
  makeBoss('boss_2', 'Huyết Ma Tôn', '😈', 'Ma tu kim đan, hút huyết tu sĩ', 2, 5, 6, 24),
  makeBoss('boss_3a', 'Kim Giáp Cương Thi', '🧟', 'Cương thi mặc kim giáp, bất tử bất diệt', 2, 8, 8, 22),

  // Nguyên Anh Kỳ
  makeBoss('boss_3b', 'Nguyên Anh Hư Ảnh', '👻', 'Hư ảnh nguyên anh, khó lường khó đo', 3, 6, 7, 24),
  makeBoss('boss_4a', 'U Minh Quỷ Vương', '💀', 'Quỷ vương u minh, áp chế thần hồn', 3, 9, 9, 22),

  // Hóa Thần Kỳ
  makeBoss('boss_3', 'Thiên Ma Đế', '🔥', 'Ma đế hóa thần, uy chấn một phương', 4, 6, 7, 25),
  makeBoss('boss_4b', 'Viêm Đế Phân Thân', '🌋', 'Phân thân viêm đế, thiêu đốt vạn vật', 4, 9, 9, 23),

  // Luyện Hư Kỳ
  makeBoss('boss_5a', 'Luyện Hư Ma Tôn', '🌑', 'Ma tôn luyện hư, hư không nuốt chửng', 5, 6, 7, 25),
  makeBoss('boss_5b', 'Vạn Cổ Độc Cốt', '☠️', 'Cốt khô độc khí, xâm thấu linh lực', 5, 9, 9, 24),

  // Hợp Thể Kỳ
  makeBoss('boss_6a', 'Hợp Thể Thánh Thú', '🦁', 'Thánh thú hợp thể, lực đạo vô biên', 6, 6, 8, 25),
  makeBoss('boss_6b', 'Thái Cổ Kim Ngân', '🦍', 'Kim ngân cổ xưa, thân thể bất hoại', 6, 9, 10, 24),

  // Đại Thừa Kỳ
  makeBoss('boss_7a', 'Đại Thừa Phật Tâm Ma', '🪷', 'Tâm ma đại thừa, mê hoặc vạn tâm', 7, 6, 8, 26),
  makeBoss('boss_7b', 'Cửu U Huyền Long', '🐲', 'Huyền long cửu u, long uy áp thế', 7, 9, 10, 25),

  // Chân Tiên Kỳ
  makeBoss('boss_8a', 'Chân Tiên Tàn Hồn', '✨', 'Tàn hồn tiên nhân, uy lực còn sót', 8, 6, 8, 26),
  makeBoss('boss_8b', 'Thiên Quân Pháp Tướng', '⚔️', 'Pháp tướng thiên quân, trấn thủ thiên môn', 8, 9, 10, 25),

  // Kim Tiên
  makeBoss('boss_9a', 'Kim Tiên Yêu Hoàng', '👑', 'Yêu hoàng kim tiên, bá chủ yêu giới', 9, 6, 9, 27),
  makeBoss('boss_9b', 'Cửu Cực Huyền Đế', '🌟', 'Huyền đế cửu cực, pháp tắc thiên địa', 9, 9, 11, 26),

  // Đại La Kim Tiên
  makeBoss('boss_10a', 'Đại La Pháp Tướng', '🛡️', 'Pháp tướng đại la, kim thân bất hoại', 10, 7, 9, 28),
  makeBoss('boss_10b', 'Hỗn Độn Ma Thần', '🌀', 'Ma thần hỗn độn, đảo loạn không gian', 10, 9, 11, 27),

  // Dao Tổ Cảnh
  makeBoss('boss_11a', 'Dao Tổ Ảnh Tượng', '🪞', 'Ảnh tượng đạo tổ, phản chiếu vạn pháp', 11, 7, 10, 28),
  makeBoss('boss_11b', 'Vạn Kiếp Lôi Tôn', '⛈️', 'Lôi tôn vạn kiếp, một chưởng diệt thế', 11, 9, 12, 27),

  // Hỗn Nguyên Đại La
  makeBoss('boss_12a', 'Hỗn Nguyên Cổ Ma', '☯️', 'Cổ ma hỗn nguyên, từ thời hỗn mang', 12, 7, 10, 30, 1.5),
  makeBoss('boss_12b', 'Thái Cổ Thần Hoàng', '🏛️', 'Thần hoàng thái cổ, uy chấn vạn giới', 12, 8, 11, 30, 1.8),
  makeBoss('boss_12c', 'Vô Thượng Đạo Tổ', '🧘', 'Đạo tổ vô thượng, một niệm hóa tiên', 12, 9, 13, 32, 2.2),

  // Thánh Nhân Cảnh
  makeBoss('boss_13a', 'Thánh Nhân Tàn Ảnh', '🌅', 'Tàn ảnh thánh nhân, uy lực còn sót lại', 13, 7, 10, 31, 1.6),
  makeBoss('boss_13b', 'Vạn Kiếp Thánh Thể', '💫', 'Thánh thể vạn kiếp, bất hủ bất diệt', 13, 9, 12, 31, 2.0),

  // Chuẩn Đế Cảnh
  makeBoss('boss_14a', 'Chuẩn Đế Bán Thân', '👁️', 'Bán thân chuẩn đế, một bước lên đế', 14, 7, 11, 32, 1.7),
  makeBoss('boss_14b', 'Cửu U Đế Ảnh', '🌌', 'Đế ảnh cửu u, áp chế vạn đạo', 14, 9, 12, 32, 2.1),

  // Đại Đế Cảnh
  makeBoss('boss_15a', 'Đại Đế Phân Thân', '🔱', 'Phân thân đại đế, uy chấn thiên hạ', 15, 7, 11, 33, 1.8),
  makeBoss('boss_15b', 'Vạn Đạo Đại Đế', '⚜️', 'Đại đế vạn đạo, pháp tắc quy một', 15, 9, 13, 33, 2.2),

  // Tiên Đế Cảnh
  makeBoss('boss_16a', 'Tiên Đế Tàn Hồn', '✴️', 'Tàn hồn tiên đế, niệm động càn khôn', 16, 7, 12, 34, 1.9),
  makeBoss('boss_16b', 'Cửu Trọng Thiên Đế', '🌠', 'Thiên đế cửu trọng, trấn thủ cửu thiên', 16, 9, 13, 34, 2.3),

  // Hồng Hoang Cảnh
  makeBoss('boss_17a', 'Hồng Hoang Cổ Thần', '🪨', 'Cổ thần hồng hoang, từ thời khai thiên', 17, 7, 12, 35, 2.0),
  makeBoss('boss_17b', 'Thái Sơ Hỗn Độn Tôn', '🌋', 'Hỗn độn tôn thái sơ, một chưởng diệt thế', 17, 8, 13, 35, 2.4),
  makeBoss('boss_17c', 'Vô Thượng Hồng Hoang Đế', '👑', 'Hồng hoang đế vô thượng, đỉnh phong vạn giới', 17, 9, 14, 36, 2.8),
];

export function getBossesByRealm(realmId: number): BossDef[] {
  return BOSSES.filter((b) => b.minRealmId === realmId);
}

export function getBossRealmLabel(realmId: number): string {
  return getRealmShortLabel(realmId);
}
