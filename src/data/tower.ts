export const TOWER_MAX_FLOOR = 500;
export const TOWER_DAILY_LIMIT = 25;
export const TOWER_FLOORS_PER_CHAPTER = 50;

export interface TowerChapter {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  startFloor: number;
  endFloor: number;
}

export interface TowerFloorDef {
  floor: number;
  guardName: string;
  icon: string;
  enemyPower: number;
  enemyHp: number;
  goldReward: number;
  crystalReward: number;
  jadeReward: number;
  chapterId: number;
  chapterName: string;
  isMilestone: boolean;
  isChapterBoss: boolean;
}

export const TOWER_CHAPTERS: TowerChapter[] = [
  { id: 1, name: 'Nhân Gian Tháp', subtitle: 'Tầng thấp, thử sức tu sĩ mới', icon: '🏯', startFloor: 1, endFloor: 50 },
  { id: 2, name: 'Địa Sát Điện', subtitle: 'Sát khí ngút trời, yêu thú hoành hành', icon: '⛩️', startFloor: 51, endFloor: 100 },
  { id: 3, name: 'Huyền Thiên Tầng', subtitle: 'Linh khí dày đặc, pháp tắc phức tạp', icon: '☁️', startFloor: 101, endFloor: 150 },
  { id: 4, name: 'U Minh Cổ Đạo', subtitle: 'Quỷ khí tràn ngập, bóng tối vô tận', icon: '🌑', startFloor: 151, endFloor: 200 },
  { id: 5, name: 'Cửu U Huyền Giới', subtitle: 'Huyền giới cửu tầng, uy áp tăng dần', icon: '🌀', startFloor: 201, endFloor: 250 },
  { id: 6, name: 'Thái Cổ Huyễn Cảnh', subtitle: 'Huyễn cảnh thái cổ, thú hoang cự đại', icon: '🦴', startFloor: 251, endFloor: 300 },
  { id: 7, name: 'Vạn Kiếp Lôi Vực', subtitle: 'Lôi vực vạn kiếp, thiên lôi giáng thế', icon: '⚡', startFloor: 301, endFloor: 350 },
  { id: 8, name: 'Tiên Ma Chiến Trường', subtitle: 'Tiên ma giao chiến, sát kiếm ngập trời', icon: '⚔️', startFloor: 351, endFloor: 400 },
  { id: 9, name: 'Hỗn Độn Thiên Đạo', subtitle: 'Thiên đạo hỗn độn, pháp tắc vỡ vụn', icon: '☯️', startFloor: 401, endFloor: 450 },
  { id: 10, name: 'Vô Thượng Tháp Đỉnh', subtitle: 'Đỉnh tháp vô thượng, chỉ đạo tổ mới lên', icon: '🗼', startFloor: 451, endFloor: 500 },
];

const GUARD_PREFIXES = [
  'Linh Hồ', 'Hắc Giáp', 'Phong Vân', 'Viêm Long', 'Băng Cơ', 'Lôi Đình', 'U Minh', 'Thiên Cơ',
  'Huyền Vũ', 'Thanh Long', 'Bạch Hổ', 'Chu Tước', 'Cửu U', 'Thái Cổ', 'Hỗn Độn', 'Vô Cực',
];

const GUARD_SUFFIXES = [
  'Thủ Vệ', 'Kiếm Khách', 'Pháp Sư', 'Quỷ Tướng', 'Hộ Pháp', 'Yêu Tướng', 'Tôn Giả', 'Thần Tướng',
];

const MILESTONE_NAMES: Record<number, string> = {
  10: 'Thập Tầng Thủ Hộ',
  20: 'Nhị Thập Huyền Tướng',
  30: 'Tam Thập Phong Ma',
  40: 'Tứ Thập Thiên Binh',
  50: 'Ngũ Thập Điện Chủ',
  100: 'Bách Tầng Ma Vương',
  150: 'Huyền Thiên Tôn',
  200: 'U Minh Quỷ Đế',
  250: 'Cửu U Thánh Tôn',
  300: 'Thái Cổ Huyền Hoàng',
  350: 'Vạn Kiếp Lôi Đế',
  400: 'Tiên Ma Chiến Thần',
  450: 'Hỗn Độn Đạo Tôn',
  500: 'Vô Thượng Tháp Chủ',
};

function getTowerEnemyPower(floor: number): number {
  const band = Math.floor((floor - 1) / 10);
  const sub = (floor - 1) % 10;
  let power = 500 * Math.pow(1.42, band) * (1 + sub * 0.1);
  if (sub === 9) power *= 1.7;
  if (floor % 50 === 0) power *= 2.2;
  if (floor === TOWER_MAX_FLOOR) power *= 1.5;
  return Math.floor(power);
}

function getGuardName(floor: number): string {
  if (MILESTONE_NAMES[floor]) return MILESTONE_NAMES[floor];
  const prefix = GUARD_PREFIXES[(floor - 1) % GUARD_PREFIXES.length];
  const suffix = GUARD_SUFFIXES[Math.floor((floor - 1) / GUARD_PREFIXES.length) % GUARD_SUFFIXES.length];
  const tier = Math.ceil(floor / 10);
  return `${prefix} ${suffix} · Tầng ${tier}`;
}

function getGuardIcon(floor: number): string {
  if (floor === TOWER_MAX_FLOOR) return '👑';
  if (floor % 50 === 0) return '🐉';
  if (floor % 10 === 0) return '⚔️';
  if (floor % 5 === 0) return '🛡️';
  return '🗡️';
}

export function getTowerChapter(floor: number): TowerChapter {
  const chapter = TOWER_CHAPTERS.find((c) => floor >= c.startFloor && floor <= c.endFloor);
  return chapter ?? TOWER_CHAPTERS[0];
}

export function getTowerChapterById(id: number): TowerChapter {
  return TOWER_CHAPTERS.find((c) => c.id === id) ?? TOWER_CHAPTERS[0];
}

export function getTowerFloor(floor: number): TowerFloorDef {
  const clamped = Math.max(1, Math.min(floor, TOWER_MAX_FLOOR));
  const chapter = getTowerChapter(clamped);
  const power = getTowerEnemyPower(clamped);
  const tier = Math.ceil(clamped / 10);

  return {
    floor: clamped,
    guardName: getGuardName(clamped),
    icon: getGuardIcon(clamped),
    enemyPower: power,
    enemyHp: Math.floor(power * (clamped % 10 === 0 ? 14 : 10)),
    goldReward: Math.floor(clamped * 150 * (1 + tier * 0.05)),
    crystalReward: Math.floor(clamped * 30 + tier * 80),
    jadeReward: clamped % 10 === 0 ? Math.floor(clamped / 10) : clamped % 5 === 0 ? Math.floor(clamped / 20) : 0,
    chapterId: chapter.id,
    chapterName: chapter.name,
    isMilestone: clamped % 10 === 0,
    isChapterBoss: clamped % 50 === 0,
  };
}

export function getChapterFloors(chapterId: number): number[] {
  const chapter = getTowerChapterById(chapterId);
  return Array.from(
    { length: chapter.endFloor - chapter.startFloor + 1 },
    (_, i) => chapter.startFloor + i,
  );
}
