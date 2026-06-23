import type { Player } from '@/types/game';
import { calcStats } from '@/utils/stats';
import { PETS, MOUNTS, getCompanion, getCompanionUpgradeCost, type CompanionDef } from '@/data/companions';

type CompanionResult = { player: Player; error?: string; message?: string };

/** Cấu hình truy cập field player cho từng loại companion (linh thú / tọa kỵ). */
export interface CompanionAccess {
  defs: CompanionDef[];
  owned: (p: Player) => Record<string, number> | undefined;
  active: (p: Player) => string | undefined;
  /** Trả về player mới với owned/active đã cập nhật (chưa tính lại stats). */
  write: (p: Player, owned: Record<string, number>, active: string | undefined) => Player;
}

export const PET_ACCESS: CompanionAccess = {
  defs: PETS,
  owned: (p) => p.pets,
  active: (p) => p.activePet,
  write: (p, owned, active) => ({ ...p, pets: owned, activePet: active }),
};

export const MOUNT_ACCESS: CompanionAccess = {
  defs: MOUNTS,
  owned: (p) => p.mounts,
  active: (p) => p.activeMount,
  write: (p, owned, active) => ({ ...p, mounts: owned, activeMount: active }),
};

function withStats(player: Player): Player {
  return { ...player, stats: calcStats(player) };
}

/** Thu phục/chiêu mộ companion, tự động kích hoạt nếu chưa có cái nào. */
export function summonCompanion(player: Player, access: CompanionAccess, id: string): CompanionResult {
  const def = getCompanion(access.defs, id);
  if (!def) return { player, error: 'Không tìm thấy' };
  const owned = access.owned(player) ?? {};
  if ((owned[id] ?? 0) > 0) return { player, error: 'Đã sở hữu' };
  if (player[def.unlockCurrency] < def.unlockCost) return { player, error: 'Không đủ tài nguyên' };

  const charged = { ...player, [def.unlockCurrency]: player[def.unlockCurrency] - def.unlockCost };
  const newOwned = { ...owned, [id]: 1 };
  const active = access.active(player) ?? id;
  return { player: withStats(access.write(charged, newOwned, active)), message: `Thu phục ${def.name}!` };
}

/** Nâng cấp companion đã sở hữu (tốn linh thạch). */
export function upgradeCompanion(player: Player, access: CompanionAccess, id: string): CompanionResult {
  const def = getCompanion(access.defs, id);
  if (!def) return { player, error: 'Không tìm thấy' };
  const owned = access.owned(player) ?? {};
  const level = owned[id] ?? 0;
  if (level <= 0) return { player, error: 'Chưa sở hữu' };
  if (level >= def.maxLevel) return { player, error: 'Đã đạt cấp tối đa' };

  const cost = getCompanionUpgradeCost(def, level);
  if (player.crystal < cost) return { player, error: 'Không đủ linh thạch' };

  const charged = { ...player, crystal: player.crystal - cost };
  const newOwned = { ...owned, [id]: level + 1 };
  return { player: withStats(access.write(charged, newOwned, access.active(player))), message: `${def.name} → cấp ${level + 1}` };
}

/** Kích hoạt (xuất chiến / cưỡi) companion đã sở hữu. */
export function activateCompanion(player: Player, access: CompanionAccess, id: string): CompanionResult {
  const owned = access.owned(player) ?? {};
  if ((owned[id] ?? 0) <= 0) return { player, error: 'Chưa sở hữu' };
  if (access.active(player) === id) return { player, error: 'Đang kích hoạt' };
  return { player: withStats(access.write(player, owned, id)), message: 'Đã kích hoạt' };
}
