import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ElementType, EquipmentMap, GameSave, GameSettings, Gender, Player } from '@/types/game';
import { getBreakthroughCost } from '@/data/realms';
import { calcStats, getCultivationRateBonus } from '@/utils/stats';
import { ARENA_DAILY_LIMIT, ARENA_OPPONENTS } from '@/data/arena';
import { BOSSES, DUNGEONS } from '@/data/dungeons';
import { createNewPlayer } from '@/systems/player';
import {
  attemptBreakthrough,
  forceBreakthrough,
  isAtPeak,
  tickCultivation,
  type TribulationInfo,
} from '@/systems/cultivation';
import { applyOfflineRewards, calcOfflineRewards } from '@/systems/offline';
import {
  expandCapacity,
  removeByTemplate,
  sellItem as sellItemSystem,
  sortInventory as sortInventorySystem,
  toggleLockItem,
  usePill,
  addItemByTemplate,
  countByTemplate,
} from '@/systems/inventory';
import { equipItem as equipItemSystem, unequipItem as unequipItemSystem } from '@/systems/equipment';
import { enhanceItem as enhanceItemSystem } from '@/systems/enhancement';
import { joinSect as joinSectSystem, leaveSect as leaveSectSystem, donateToSect as donateSectSystem } from '@/systems/sect';
import { learnTechnique as learnTechSystem, upgradeTechnique as upgradeTechSystem } from '@/systems/technique';
import { investTalent as investTalentSystem, resetTalents as resetTalentsSystem } from '@/systems/talent';
import { craftPill as craftPillSystem } from '@/systems/alchemy';
import { forgeEquipment as forgeEquipmentSystem } from '@/systems/forge';
import { buyMarketItem as buyMarketItemSystem } from '@/systems/market';
import {
  summonCompanion,
  upgradeCompanion,
  activateCompanion,
  PET_ACCESS,
  MOUNT_ACCESS,
  type CompanionAccess,
} from '@/systems/companion';
import { canEnterSecretRealm } from '@/systems/secretRealm';
import { ascend as ascendSystem } from '@/systems/ascension';
import { upgradeSpiritRoot as upgradeSpiritRootSystem } from '@/systems/spiritRoot';
import { getSecretRealm } from '@/data/secretRealm';
import { buildToast, calcPowerDelta, type GameToast, type ToastVariant } from '@/utils/powerNotify';
import { applyBattleLoot, rollBattleLoot, type BattleLoot } from '@/systems/drops';
import {
  claimMilestone,
  claimQuestReward,
  hasClaimableQuests,
  resetDailyQuests,
  shouldResetDaily,
  syncQuestProgress,
} from '@/systems/quest';
import type { BattleMode } from '@/types/battle';
import { TOWER_MAX_FLOOR, getTowerFloor } from '@/data/tower';
import { runTowerAutoClimbSync } from '@/systems/towerClimb';
import type { AutoTowerResult } from '@/systems/towerAuto';

const EMPTY_COUNTERS = {
  dungeons: {} as Record<string, number>,
  arena: 0,
  bosses: {} as Record<string, number>,
  secret: {} as Record<string, number>,
};

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  reducedMotion: false,
  battleSpeed: 'normal',
  autoClaimOffline: false,
  showPowerDelta: true,
};

export interface BreakthroughTribulationNotice {
  success: boolean;
  message: string;
  info: TribulationInfo;
  powerDelta: number | null;
}

interface GameStore extends GameSave {
  _hydrated: boolean;
  _devBreakthroughMs: number;
  devFastBreakthrough: boolean;
  breakthroughMessage: string | null;
  breakthroughPowerDelta: number | null;
  breakthroughTribulation: BreakthroughTribulationNotice | null;
  toast: GameToast | null;
  lastBattleLoot: BattleLoot | null;
  createCharacter: (name: string, gender: Gender, element: ElementType) => void;
  tick: (deltaMs: number) => void;
  toggleAutoCultivate: () => void;
  toggleDevFastBreakthrough: () => void;
  doBreakthrough: (bonusRate?: number) => void;
  consumeItemByTemplate: (templateId: string, count: number) => boolean;
  clearBreakthroughMessage: () => void;
  clearToast: () => void;
  showToast: (message: string, options?: { variant?: ToastVariant; powerDelta?: number | null }) => void;
  updateSettings: (patch: Partial<GameSettings>) => void;
  resetSettings: () => void;
  clearLastBattleLoot: () => void;
  claimOfflineRewards: () => void;
  dismissOfflineRewards: () => void;
  checkOfflineOnLoad: () => void;
  checkDailyReset: () => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: keyof EquipmentMap) => void;
  sellItem: (itemId: string, qty?: number) => void;
  useItem: (itemId: string) => void;
  sortInventory: () => void;
  expandInventory: () => void;
  toggleItemLock: (itemId: string) => void;
  enhanceItem: (itemId: string) => void;
  upgradeSpiritRoot: (element?: ElementType) => void;
  claimQuest: (questId: string) => void;
  claimActivityMilestone: (points: number) => void;
  joinSect: (sectId: string) => void;
  leaveSect: () => void;
  donateSect: (amount: number) => void;
  learnTechnique: (id: string) => void;
  upgradeTechnique: (id: string) => void;
  investTalent: (id: string) => void;
  resetTalents: () => void;
  craftPill: (recipeId: string) => void;
  forgeEquipment: (recipeId: string) => void;
  buyMarketItem: (entryId: string, quantity?: number) => void;
  summonCompanion: (kind: 'pet' | 'mount', id: string) => void;
  upgradeCompanion: (kind: 'pet' | 'mount', id: string) => void;
  activateCompanion: (kind: 'pet' | 'mount', id: string) => void;
  ascend: () => void;
  canStartBattle: (mode: BattleMode, targetId: string, towerFloor?: number) => string | null;
  resolveBattle: (
    mode: BattleMode,
    targetId: string,
    win: boolean,
    towerFloor?: number,
    options?: { silent?: boolean; loot?: BattleLoot },
  ) => void;
  autoClimbTower: (options?: { silent?: boolean }) => AutoTowerResult;
  resetGame: () => void;
  devAddResources: () => void;
}

const initialSave: GameSave = {
  hasCharacter: false,
  player: null,
  settings: { ...DEFAULT_GAME_SETTINGS },
  showOfflineReward: false,
  pendingOffline: null,
  leaderboardRefreshAt: 0,
  lastDailyResetAt: Date.now(),
  dailyCounters: { ...EMPTY_COUNTERS },
  towerBestFloor: 0,
};

function setToast(
  message: string,
  options?: {
    variant?: ToastVariant;
    before?: Player;
    after?: Player;
    powerDelta?: number | null;
  },
) {
  return { toast: buildToast(message, options) };
}

function withPowerToast(before: Player, after: Player, message: string, extra?: object) {
  return {
    player: after,
    ...setToast(message, { before, after, variant: 'success' }),
    ...extra,
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialSave,
      dailyCounters: { ...EMPTY_COUNTERS },
      _hydrated: false,
      _devBreakthroughMs: 0,
      devFastBreakthrough: false,
      breakthroughMessage: null,
      breakthroughPowerDelta: null,
      breakthroughTribulation: null,
      toast: null,
      lastBattleLoot: null,

      createCharacter: (name, gender, element) => {
        const player = createNewPlayer(name, gender, element);
        set({
          hasCharacter: true,
          player: syncQuestProgress(player),
          showOfflineReward: false,
          pendingOffline: null,
          breakthroughMessage: null,
          breakthroughPowerDelta: null,
          breakthroughTribulation: null,
          toast: null,
          lastBattleLoot: null,
          lastDailyResetAt: Date.now(),
          dailyCounters: { ...EMPTY_COUNTERS },
          towerBestFloor: 0,
        });
      },

      checkDailyReset: () => {
        const { lastDailyResetAt, player, hasCharacter } = get();
        if (!hasCharacter || !player) return;
        if (shouldResetDaily(lastDailyResetAt)) {
          set({
            player: resetDailyQuests(player),
            lastDailyResetAt: Date.now(),
            dailyCounters: { ...EMPTY_COUNTERS },
          });
        }
      },

      tick: (deltaMs) => {
        const state = get();
        const { player, hasCharacter, devFastBreakthrough } = state;
        if (!hasCharacter || !player) return;

        get().checkDailyReset();

        if (devFastBreakthrough) {
          const acc = state._devBreakthroughMs + deltaMs;
          if (acc >= 1000) {
            if (!isAtPeak(player)) {
              const before = player;
              const result = forceBreakthrough(player);
              if (result.success) {
                const after = syncQuestProgress(result.player);
                const showPower = get().settings.showPowerDelta;
                const delta = showPower ? calcPowerDelta(before, after) : 0;
                set({
                  player: after,
                  _devBreakthroughMs: acc - 1000,
                  ...(showPower && delta !== 0
                    ? setToast(result.message, { before, after, variant: 'success' })
                    : {}),
                });
                return;
              }
            }
            set({ _devBreakthroughMs: acc - 1000 });
          } else {
            set({ _devBreakthroughMs: acc });
          }
          return;
        }

        if (!player.autoCultivate) return;

        const cost = getBreakthroughCost(player.realmId, player.tier);
        if (player.cultivation >= cost) return;

        const ticked = tickCultivation(player, deltaMs, getCultivationRateBonus(player));
        set({ player: syncQuestProgress(ticked) });
      },

      toggleDevFastBreakthrough: () => {
        set((s) => ({
          devFastBreakthrough: !s.devFastBreakthrough,
          _devBreakthroughMs: 0,
        }));
      },

      toggleAutoCultivate: () => {
        const { player } = get();
        if (!player) return;
        set({ player: { ...player, autoCultivate: !player.autoCultivate } });
      },

      doBreakthrough: (bonusRate: number = 0) => {
        const store = get();
        const { player } = store;
        if (!player) return;

        const before = player;
        const result = attemptBreakthrough(player, bonusRate);
        if (!result.success) {
          const after = result.player ? syncQuestProgress(result.player) : undefined;
          const delta = after ? calcPowerDelta(before, after) : 0;
          set({
            ...(after ? { player: after } : {}),
            breakthroughMessage: result.reason,
            breakthroughPowerDelta: delta !== 0 ? delta : null,
            breakthroughTribulation: result.tribulation
              ? {
                  success: false,
                  message: result.reason,
                  info: result.tribulation,
                  powerDelta: delta !== 0 ? delta : null,
                }
              : null,
          });
          return;
        }

        const after = syncQuestProgress(result.player);
        const delta = calcPowerDelta(before, after);
        set({
          player: after,
          breakthroughMessage: result.message,
          breakthroughPowerDelta: delta !== 0 ? delta : null,
          breakthroughTribulation: result.tribulation
            ? {
                success: true,
                message: result.message,
                info: result.tribulation,
                powerDelta: delta !== 0 ? delta : null,
              }
            : null,
        });
      },

      clearBreakthroughMessage: () => set({
        breakthroughMessage: null,
        breakthroughPowerDelta: null,
        breakthroughTribulation: null,
      }),
      clearToast: () => set({ toast: null }),
      showToast: (message, options) => set(setToast(message, options)),
      updateSettings: (patch) => {
        set((state) => ({
          settings: { ...state.settings, ...patch },
          ...setToast('Đã cập nhật cài đặt', { variant: 'success' }),
        }));
      },
      resetSettings: () => {
        set({
          settings: { ...DEFAULT_GAME_SETTINGS },
          ...setToast('Đã khôi phục cài đặt mặc định', { variant: 'success' }),
        });
      },

      clearLastBattleLoot: () => set({ lastBattleLoot: null }),

      claimOfflineRewards: () => {
        const { player, pendingOffline } = get();
        if (!player || !pendingOffline) return;
        set({
          player: syncQuestProgress(applyOfflineRewards(player, pendingOffline)),
          showOfflineReward: false,
          pendingOffline: null,
        });
      },

      dismissOfflineRewards: () => {
        const { player } = get();
        if (!player) return;
        set({
          player: { ...player, lastOnlineAt: Date.now() },
          showOfflineReward: false,
          pendingOffline: null,
        });
      },

      checkOfflineOnLoad: () => {
        const { player, hasCharacter, settings } = get();
        if (!hasCharacter || !player) return;
        get().checkDailyReset();
        const rewards = calcOfflineRewards(player);
        if (rewards) {
          if (settings.autoClaimOffline) {
            set({
              player: syncQuestProgress(applyOfflineRewards(player, rewards)),
              showOfflineReward: false,
              pendingOffline: null,
              ...setToast('Đã tự nhận thưởng offline', { variant: 'success' }),
            });
            return;
          }
          set({ showOfflineReward: true, pendingOffline: rewards });
        }
      },

      equipItem: (itemId) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const item = player.inventory.find((i) => i.id === itemId);
        const result = equipItemSystem(player, itemId);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, result.player, `Đã trang bị ${item?.name ?? 'trang bị'}`));
      },

      unequipItem: (slot) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const equippedId = player.equipment[slot];
        const item = equippedId ? player.inventory.find((i) => i.id === equippedId) : undefined;
        const result = unequipItemSystem(player, slot);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, result.player, `Đã tháo ${item?.name ?? 'trang bị'}`));
      },

      sellItem: (itemId, qty = 1) => {
        const { player } = get();
        if (!player) return;
        const result = sellItemSystem(player, itemId, qty);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: syncQuestProgress(result.player), ...setToast(`Bán được ${result.gold} vàng`) });
      },

      useItem: (itemId) => {
        const { player } = get();
        if (!player) return;
        const item = player.inventory.find((i) => i.id === itemId);
        if (!item) return;

        if (item.category === 'pill') {
          const result = usePill(player, itemId);
          if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
          set({ player: syncQuestProgress(result.player), ...setToast(result.message ?? 'Đã sử dụng') });
          return;
        }

        if (item.category === 'equipment' && item.slot) {
          get().equipItem(itemId);
          return;
        }

        set(setToast('Không thể sử dụng vật phẩm này', { variant: 'error' }));
      },

      sortInventory: () => {
        const { player } = get();
        if (!player) return;
        set({ player: sortInventorySystem(player), ...setToast('Đã sắp xếp túi đồ') });
      },

      expandInventory: () => {
        const { player } = get();
        if (!player) return;
        const result = expandCapacity(player);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: result.player, ...setToast('Mở rộng +10 ô') });
      },

      toggleItemLock: (itemId) => {
        const { player } = get();
        if (!player) return;
        set({ player: toggleLockItem(player, itemId) });
      },

      enhanceItem: (itemId) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const wasEquipped = Object.values(player.equipment).includes(itemId);
        const result = enhanceItemSystem(player, itemId);
        if (result.error) {
          set(setToast(result.error, { variant: 'error' }));
          return;
        }
        if (!result.success) {
          set({
            player: syncQuestProgress(result.player),
            ...setToast(result.message, { variant: 'error' }),
          });
          return;
        }
        const after = syncQuestProgress(result.player);
        set(
          wasEquipped
            ? withPowerToast(before, after, result.message)
            : {
                player: after,
                ...setToast(result.message, { variant: 'success' }),
              },
        );
      },

      upgradeSpiritRoot: (element) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const result = upgradeSpiritRootSystem(player, element);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, syncQuestProgress(result.player), result.message));
      },

      claimQuest: (questId) => {
        const { player } = get();
        if (!player) return;
        const result = claimQuestReward(player, questId);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: result.player, ...setToast(result.message ?? 'Nhận thưởng thành công') });
      },

      claimActivityMilestone: (points) => {
        const { player } = get();
        if (!player) return;
        const result = claimMilestone(player, points);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: result.player, ...setToast(result.message ?? 'Nhận mốc thành công') });
      },

      joinSect: (sectId) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const result = joinSectSystem(player, sectId);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, syncQuestProgress(result.player), result.message ?? 'Đã gia nhập'));
      },

      leaveSect: () => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const result = leaveSectSystem(player);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, syncQuestProgress(result.player), result.message ?? 'Đã thoái xuất'));
      },

      donateSect: (amount) => {
        const { player } = get();
        if (!player) return;
        const result = donateSectSystem(player, amount);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: syncQuestProgress(result.player), ...setToast(result.message ?? 'Đã cống hiến') });
      },

      learnTechnique: (id) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const result = learnTechSystem(player, id);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, syncQuestProgress(result.player), result.message ?? 'Đã lĩnh ngộ'));
      },

      upgradeTechnique: (id) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const result = upgradeTechSystem(player, id);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, syncQuestProgress(result.player), result.message ?? 'Đã nâng cấp'));
      },

      investTalent: (id) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const result = investTalentSystem(player, id);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, syncQuestProgress(result.player), result.message ?? 'Đã điểm thiên phú'));
      },

      resetTalents: () => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const result = resetTalentsSystem(player);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, syncQuestProgress(result.player), result.message ?? 'Đã tẩy tủy'));
      },

      craftPill: (recipeId) => {
        const { player } = get();
        if (!player) return;
        const result = craftPillSystem(player, recipeId);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: syncQuestProgress(result.player), ...setToast(result.message ?? 'Luyện đan thành công') });
      },

      forgeEquipment: (recipeId) => {
        const { player } = get();
        if (!player) return;
        const result = forgeEquipmentSystem(player, recipeId);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: syncQuestProgress(result.player), ...setToast(result.message ?? 'Luyện khí thành công') });
      },

      buyMarketItem: (entryId, quantity = 1) => {
        const { player } = get();
        if (!player) return;
        const result = buyMarketItemSystem(player, entryId, quantity);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: syncQuestProgress(result.player), ...setToast(result.message ?? 'Mua thành công') });
      },

      summonCompanion: (kind, id) => {
        const { player } = get();
        if (!player) return;
        const access: CompanionAccess = kind === 'pet' ? PET_ACCESS : MOUNT_ACCESS;
        const result = summonCompanion(player, access, id);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set({ player: syncQuestProgress(result.player), ...setToast(result.message ?? 'Thu phục thành công') });
      },

      upgradeCompanion: (kind, id) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const access: CompanionAccess = kind === 'pet' ? PET_ACCESS : MOUNT_ACCESS;
        const result = upgradeCompanion(player, access, id);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        const isActive = kind === 'pet' ? player.activePet === id : player.activeMount === id;
        const after = syncQuestProgress(result.player);
        set(
          isActive
            ? withPowerToast(before, after, result.message ?? 'Đã nâng cấp')
            : { player: after, ...setToast(result.message ?? 'Đã nâng cấp', { variant: 'success' }) },
        );
      },

      activateCompanion: (kind, id) => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const access: CompanionAccess = kind === 'pet' ? PET_ACCESS : MOUNT_ACCESS;
        const result = activateCompanion(player, access, id);
        if (result.error) { set(setToast(result.error, { variant: 'error' })); return; }
        set(withPowerToast(before, syncQuestProgress(result.player), result.message ?? 'Đã kích hoạt'));
      },

      ascend: () => {
        const { player } = get();
        if (!player) return;
        const before = player;
        const result = ascendSystem(player);
        if (!result.success) { set(setToast(result.reason, { variant: 'error' })); return; }
        const after = syncQuestProgress(result.player);
        const delta = calcPowerDelta(before, after);
        set({
          player: after,
          breakthroughMessage: result.message,
          breakthroughPowerDelta: delta !== 0 ? delta : null,
        });
      },

      canStartBattle: (mode, targetId, towerFloor) => {
        const { player, dailyCounters, towerBestFloor } = get();
        if (!player) return 'Chưa có nhân vật';

        if (mode === 'dungeon') {
          const dungeon = DUNGEONS.find((d) => d.id === targetId);
          if (!dungeon) return 'Không tìm thấy phó bản';
          if (player.realmId < dungeon.minRealmId) return 'Cảnh giới chưa đủ';
          const runs = dailyCounters.dungeons[targetId] ?? 0;
          if (runs >= dungeon.dailyLimit) return 'Hết lượt hôm nay';
          return null;
        }

        if (mode === 'boss') {
          const boss = BOSSES.find((b) => b.id === targetId);
          if (!boss) return 'Không tìm thấy boss';
          if (player.realmId < boss.minRealmId) return 'Cảnh giới chưa đủ';
          const runs = dailyCounters.bosses[targetId] ?? 0;
          if (runs >= 3) return 'Hết lượt boss hôm nay';
          return null;
        }

        if (mode === 'arena') {
          if (dailyCounters.arena >= ARENA_DAILY_LIMIT) return 'Hết lượt đấu hôm nay';
          if (!ARENA_OPPONENTS.find((o) => o.id === targetId)) return 'Không tìm thấy đối thủ';
          return null;
        }

        if (mode === 'tower') {
          const floor = towerFloor ?? towerBestFloor + 1;
          if (floor > TOWER_MAX_FLOOR) return 'Đã vượt tầng tối đa';
          if (floor > towerBestFloor + 1) return 'Phải vượt tầng trước đó';
          return null;
        }

        if (mode === 'secret') {
          return canEnterSecretRealm(player, dailyCounters.secret, targetId);
        }

        return 'Chế độ không hợp lệ';
      },

      resolveBattle: (mode, targetId, win, towerFloor, options) => {
        const silent = options?.silent ?? false;
        const presetLoot = options?.loot;
        const { player, dailyCounters, towerBestFloor } = get();
        if (!player) return;

        if (mode === 'dungeon') {
          const dungeon = DUNGEONS.find((d) => d.id === targetId);
          if (!dungeon) return;
          const runs = dailyCounters.dungeons[targetId] ?? 0;

          if (!win) {
            set({
              dailyCounters: {
                ...dailyCounters,
                dungeons: { ...dailyCounters.dungeons, [targetId]: runs + 1 },
              },
              lastBattleLoot: null,
              ...setToast('Thất bại! Hãy tăng lực chiến'),
            });
            return;
          }

          let updated = {
            ...player,
            gold: player.gold + dungeon.goldReward,
            crystal: player.crystal + dungeon.crystalReward,
            dungeonClears: player.dungeonClears + 1,
          };
          const loot = presetLoot ?? rollBattleLoot('dungeon', { dungeon });
          updated = applyBattleLoot(updated, loot);
          const lootNote = loot.summary ? ` · ${loot.summary}` : '';
          set({
            player: syncQuestProgress(updated),
            lastBattleLoot: loot,
            dailyCounters: {
              ...dailyCounters,
              dungeons: { ...dailyCounters.dungeons, [targetId]: runs + 1 },
            },
            ...setToast(`Vượt ải thành công!${lootNote}`),
          });
          return;
        }

        if (mode === 'boss') {
          const boss = BOSSES.find((b) => b.id === targetId);
          if (!boss) return;
          const runs = dailyCounters.bosses[targetId] ?? 0;

          if (!win) {
            set({
              dailyCounters: {
                ...dailyCounters,
                bosses: { ...dailyCounters.bosses, [targetId]: runs + 1 },
              },
              lastBattleLoot: null,
              ...setToast(`Thua ${boss.name}!`),
            });
            return;
          }

          const loot = presetLoot ?? rollBattleLoot('boss', { boss });
          let updated = applyBattleLoot(
            {
              ...player,
              gold: player.gold + boss.goldReward,
              crystal: player.crystal + boss.crystalReward,
              jade: player.jade + boss.jadeReward,
              bossKills: player.bossKills + 1,
            },
            loot,
          );
          const lootNote = loot.summary ? ` · ${loot.summary}` : '';
          set({
            player: syncQuestProgress(updated),
            lastBattleLoot: loot,
            dailyCounters: {
              ...dailyCounters,
              bosses: { ...dailyCounters.bosses, [targetId]: runs + 1 },
            },
            ...setToast(`Hạ ${boss.name}!${lootNote}`),
          });
          return;
        }

        if (mode === 'arena') {
          const opponent = ARENA_OPPONENTS.find((o) => o.id === targetId);
          if (!opponent) return;

          if (!win) {
            set({
              dailyCounters: { ...dailyCounters, arena: dailyCounters.arena + 1 },
              lastBattleLoot: null,
              ...setToast('Thua trận!'),
            });
            return;
          }

          const loot = presetLoot ?? rollBattleLoot('arena', { arena: opponent });
          let updated = applyBattleLoot(
            {
              ...player,
              gold: player.gold + opponent.goldReward,
              crystal: player.crystal + opponent.crystalReward,
              arenaWins: player.arenaWins + 1,
            },
            loot,
          );
          const lootNote = loot.summary ? ` · ${loot.summary}` : '';
          set({
            player: syncQuestProgress(updated),
            lastBattleLoot: loot,
            dailyCounters: { ...dailyCounters, arena: dailyCounters.arena + 1 },
            ...setToast(`Chiến thắng!${lootNote}`),
          });
          return;
        }

        if (mode === 'tower') {
          const floor = towerFloor ?? towerBestFloor + 1;
          const t = getTowerFloor(floor);

          if (!win) {
            if (!silent) set({ lastBattleLoot: null, ...setToast(`Thua tầng ${floor}!`) });
            return;
          }

          const loot = presetLoot ?? rollBattleLoot('tower', { tower: t });
          let updated = applyBattleLoot(
            {
              ...player,
              gold: player.gold + t.goldReward,
              crystal: player.crystal + t.crystalReward,
              jade: player.jade + t.jadeReward,
            },
            loot,
          );
          const lootNote = loot.summary ? ` · ${loot.summary}` : '';
          set({
            player: syncQuestProgress(updated),
            lastBattleLoot: loot,
            towerBestFloor: Math.max(towerBestFloor, floor),
            ...(silent ? {} : setToast(`Vượt tầng ${floor}!${lootNote}`)),
          });
          return;
        }

        if (mode === 'secret') {
          const realm = getSecretRealm(targetId);
          if (!realm) return;
          const runs = dailyCounters.secret[targetId] ?? 0;
          const counters = {
            ...dailyCounters,
            secret: { ...dailyCounters.secret, [targetId]: runs + 1 },
          };

          if (!win) {
            set({
              dailyCounters: counters,
              lastBattleLoot: null,
              ...setToast(`Thất bại tại ${realm.name}!`, { variant: 'error' }),
            });
            return;
          }

          const loot = presetLoot ?? rollBattleLoot('secret', { secret: realm });
          let updated = applyBattleLoot(
            {
              ...player,
              gold: player.gold + realm.goldReward,
              crystal: player.crystal + realm.crystalReward,
              jade: player.jade + realm.jadeReward,
            },
            loot,
          );
          const dropNote = loot.summary ? ` · ${loot.summary}` : '';
          set({
            player: syncQuestProgress(updated),
            dailyCounters: counters,
            lastBattleLoot: loot,
            ...setToast(`Khám phá ${realm.name} thành công!${dropNote}`),
          });
        }
      },

      autoClimbTower: (options?: { silent?: boolean }) => {
        const silent = options?.silent ?? false;
        const store = get();
        const result = runTowerAutoClimbSync({
          getPlayer: () => get().player,
          getTowerBestFloor: () => get().towerBestFloor,
          canStartFloor: (floor) => get().canStartBattle('tower', `tower_${floor}`, floor),
          resolveFloor: (floor, win) => {
            get().resolveBattle('tower', `tower_${floor}`, win, floor, { silent: true });
          },
        });

        if (!silent) {
          if (result.cleared > 0) {
            const msg = result.reason === 'defeat'
              ? `Tự động vượt ${result.cleared} tầng, thua tầng ${result.toFloor + 1}!`
              : result.reason === 'max_floor'
                ? `Tự động vượt ${result.cleared} tầng — đã lên đỉnh tháp!`
                : result.reason === 'stopped'
                  ? `Đã dừng sau ${result.cleared} tầng`
                  : `Tự động vượt ${result.cleared} tầng thành công!`;
            set({ ...setToast(msg) });
          } else if (result.reason === 'max_floor') {
            set({ ...setToast('Đã chinh phục đỉnh tháp') });
          } else if (result.reason !== 'stopped') {
            const err = store.canStartBattle('tower', `tower_${result.fromFloor}`, result.fromFloor);
            set({ ...setToast(err ?? 'Không thể tự động vượt tháp', { variant: 'error' }) });
          }
        }

        return result;
      },

      resetGame: () =>
        set({
          ...initialSave,
          settings: { ...get().settings },
          dailyCounters: { ...EMPTY_COUNTERS },
          _hydrated: true,
          breakthroughMessage: null,
          breakthroughPowerDelta: null,
          breakthroughTribulation: null,
          toast: null,
        }),

      consumeItemByTemplate: (templateId: string, count: number) => {
        const { player } = get();
        if (!player) return false;

        if (countByTemplate(player, templateId) < count) return false;

        const updated = removeByTemplate(player, templateId, count);
        set({ player: updated });
        return true;
      },

      devAddResources: () => {
        let p = get().player;
        if (!p) return;

        p = {
          ...p,
          gold: p.gold + 1000000,
          crystal: p.crystal + 100000,
          jade: p.jade + 10000,
          cultivation: p.cultivation + 500000,
        };

        for (const tid of [
          'crystal_shard',
          'ore_mithril',
          'herb_lingzhi',
          'soul_shard',
          'pill_qi',
          'pill_spirit',
          'pill_break',
          'scroll_skill',
        ]) {
          const res = addItemByTemplate(p, tid, 10000);
          if (!res.error) {
            p = res.player;
          }
        }

        set({
          player: p,
          ...setToast('Đã thêm 1M Vàng và 10K mọi nguyên liệu nâng cấp!', { variant: 'success' }),
        });
      },
    }),
    {
      name: 'dao-to-tu-tien-save',
      partialize: (state) => ({
        hasCharacter: state.hasCharacter,
        player: state.player,
        settings: state.settings,
        showOfflineReward: state.showOfflineReward,
        pendingOffline: state.pendingOffline,
        leaderboardRefreshAt: state.leaderboardRefreshAt,
        lastDailyResetAt: state.lastDailyResetAt,
        dailyCounters: state.dailyCounters,
        towerBestFloor: state.towerBestFloor,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hydrated = true;
          state.settings = { ...DEFAULT_GAME_SETTINGS, ...(state.settings ?? {}) };
          if (!state.dailyCounters) state.dailyCounters = { ...EMPTY_COUNTERS };
          if (!state.dailyCounters.secret) state.dailyCounters.secret = {};
          if (state.towerBestFloor === undefined) state.towerBestFloor = 0;
          if (!state.lastDailyResetAt) state.lastDailyResetAt = Date.now();
          if (state.player) {
            if (state.player.spiritRootLevel === undefined) {
              state.player.spiritRootLevel = 1;
            }
            state.player = { ...state.player, stats: calcStats(state.player) };
          }
          state.checkOfflineOnLoad();
        }
      },
    },
  ),
);

export { hasClaimableQuests };
