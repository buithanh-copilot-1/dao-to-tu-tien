import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ElementType, EquipmentMap, GameSave, Gender } from '@/types/game';
import { getBreakthroughCost } from '@/data/realms';
import { calcStats } from '@/utils/stats';
import { ARENA_DAILY_LIMIT, ARENA_OPPONENTS } from '@/data/arena';
import { BOSSES, DUNGEONS } from '@/data/dungeons';
import { createNewPlayer } from '@/systems/player';
import { attemptBreakthrough, forceBreakthrough, isAtPeak, tickCultivation } from '@/systems/cultivation';
import { applyOfflineRewards, calcOfflineRewards } from '@/systems/offline';
import {
  addItemByTemplate,
  expandCapacity,
  sellItem as sellItemSystem,
  sortInventory as sortInventorySystem,
  toggleLockItem,
  usePill,
} from '@/systems/inventory';
import { equipItem as equipItemSystem, unequipItem as unequipItemSystem } from '@/systems/equipment';
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
import { simulateTowerFloor, type AutoTowerResult } from '@/systems/towerAuto';

const EMPTY_COUNTERS = { dungeons: {} as Record<string, number>, arena: 0, bosses: {} as Record<string, number> };

interface GameStore extends GameSave {
  _hydrated: boolean;
  _devBreakthroughMs: number;
  devFastBreakthrough: boolean;
  breakthroughMessage: string | null;
  toastMessage: string | null;
  createCharacter: (name: string, gender: Gender, element: ElementType) => void;
  tick: (deltaMs: number) => void;
  toggleAutoCultivate: () => void;
  toggleDevFastBreakthrough: () => void;
  doBreakthrough: () => void;
  clearBreakthroughMessage: () => void;
  clearToast: () => void;
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
  claimQuest: (questId: string) => void;
  claimActivityMilestone: (points: number) => void;
  canStartBattle: (mode: BattleMode, targetId: string, towerFloor?: number) => string | null;
  resolveBattle: (
    mode: BattleMode,
    targetId: string,
    win: boolean,
    towerFloor?: number,
    options?: { silent?: boolean },
  ) => void;
  autoClimbTower: (options?: { silent?: boolean }) => AutoTowerResult;
  resetGame: () => void;
}

const initialSave: GameSave = {
  hasCharacter: false,
  player: null,
  showOfflineReward: false,
  pendingOffline: null,
  leaderboardRefreshAt: 0,
  lastDailyResetAt: Date.now(),
  dailyCounters: { ...EMPTY_COUNTERS },
  towerBestFloor: 0,
};

function setToast(message: string) {
  return { toastMessage: message };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialSave,
      dailyCounters: { ...EMPTY_COUNTERS },
      _hydrated: false,
      _devBreakthroughMs: 0,
      devFastBreakthrough: import.meta.env.DEV,
      breakthroughMessage: null,
      toastMessage: null,

      createCharacter: (name, gender, element) => {
        const player = createNewPlayer(name, gender, element);
        set({
          hasCharacter: true,
          player: syncQuestProgress(player),
          showOfflineReward: false,
          pendingOffline: null,
          breakthroughMessage: null,
          toastMessage: null,
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
              const result = forceBreakthrough(player);
              if (result.success) {
                set({
                  player: syncQuestProgress(result.player),
                  _devBreakthroughMs: acc - 1000,
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

        const ticked = tickCultivation(player, deltaMs);
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

      doBreakthrough: () => {
        const { player } = get();
        if (!player) return;

        const result = attemptBreakthrough(player);
        if (!result.success) {
          set({ breakthroughMessage: result.reason });
          return;
        }

        set({
          player: syncQuestProgress(result.player),
          breakthroughMessage: result.message,
        });
      },

      clearBreakthroughMessage: () => set({ breakthroughMessage: null }),
      clearToast: () => set({ toastMessage: null }),

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
        const { player, hasCharacter } = get();
        if (!hasCharacter || !player) return;
        get().checkDailyReset();
        const rewards = calcOfflineRewards(player);
        if (rewards) {
          set({ showOfflineReward: true, pendingOffline: rewards });
        }
      },

      equipItem: (itemId) => {
        const { player } = get();
        if (!player) return;
        const result = equipItemSystem(player, itemId);
        if (result.error) { set(setToast(result.error)); return; }
        set({ player: result.player });
      },

      unequipItem: (slot) => {
        const { player } = get();
        if (!player) return;
        const result = unequipItemSystem(player, slot);
        if (result.error) { set(setToast(result.error)); return; }
        set({ player: result.player });
      },

      sellItem: (itemId, qty = 1) => {
        const { player } = get();
        if (!player) return;
        const result = sellItemSystem(player, itemId, qty);
        if (result.error) { set(setToast(result.error)); return; }
        set({ player: syncQuestProgress(result.player), ...setToast(`Bán được ${result.gold} vàng`) });
      },

      useItem: (itemId) => {
        const { player } = get();
        if (!player) return;
        const item = player.inventory.find((i) => i.id === itemId);
        if (!item) return;

        if (item.category === 'pill') {
          const result = usePill(player, itemId);
          if (result.error) { set(setToast(result.error)); return; }
          set({ player: syncQuestProgress(result.player), ...setToast(result.message ?? 'Đã sử dụng') });
          return;
        }

        if (item.category === 'equipment' && item.slot) {
          get().equipItem(itemId);
          return;
        }

        set(setToast('Không thể sử dụng vật phẩm này'));
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
        if (result.error) { set(setToast(result.error)); return; }
        set({ player: result.player, ...setToast('Mở rộng +10 ô') });
      },

      toggleItemLock: (itemId) => {
        const { player } = get();
        if (!player) return;
        set({ player: toggleLockItem(player, itemId) });
      },

      claimQuest: (questId) => {
        const { player } = get();
        if (!player) return;
        const result = claimQuestReward(player, questId);
        if (result.error) { set(setToast(result.error)); return; }
        set({ player: result.player, ...setToast(result.message ?? 'Nhận thưởng thành công') });
      },

      claimActivityMilestone: (points) => {
        const { player } = get();
        if (!player) return;
        const result = claimMilestone(player, points);
        if (result.error) { set(setToast(result.error)); return; }
        set({ player: result.player, ...setToast(result.message ?? 'Nhận mốc thành công') });
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

        return 'Chế độ không hợp lệ';
      },

      resolveBattle: (mode, targetId, win, towerFloor, options) => {
        const silent = options?.silent ?? false;
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
          if (dungeon.itemDrop) {
            updated = addItemByTemplate(updated, dungeon.itemDrop, 1).player;
          }
          set({
            player: syncQuestProgress(updated),
            dailyCounters: {
              ...dailyCounters,
              dungeons: { ...dailyCounters.dungeons, [targetId]: runs + 1 },
            },
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
              ...setToast(`Thua ${boss.name}!`),
            });
            return;
          }

          set({
            player: syncQuestProgress({
              ...player,
              gold: player.gold + boss.goldReward,
              crystal: player.crystal + boss.crystalReward,
              jade: player.jade + boss.jadeReward,
              bossKills: player.bossKills + 1,
            }),
            dailyCounters: {
              ...dailyCounters,
              bosses: { ...dailyCounters.bosses, [targetId]: runs + 1 },
            },
          });
          return;
        }

        if (mode === 'arena') {
          const opponent = ARENA_OPPONENTS.find((o) => o.id === targetId);
          if (!opponent) return;

          if (!win) {
            set({
              dailyCounters: { ...dailyCounters, arena: dailyCounters.arena + 1 },
              ...setToast('Thua trận!'),
            });
            return;
          }

          set({
            player: syncQuestProgress({
              ...player,
              gold: player.gold + opponent.goldReward,
              crystal: player.crystal + opponent.crystalReward,
              arenaWins: player.arenaWins + 1,
            }),
            dailyCounters: { ...dailyCounters, arena: dailyCounters.arena + 1 },
          });
          return;
        }

        if (mode === 'tower') {
          const floor = towerFloor ?? towerBestFloor + 1;
          const t = getTowerFloor(floor);

          if (!win) {
            if (!silent) set({ ...setToast(`Thua tầng ${floor}!`) });
            return;
          }

          set({
            player: syncQuestProgress({
              ...player,
              gold: player.gold + t.goldReward,
              crystal: player.crystal + t.crystalReward,
              jade: player.jade + t.jadeReward,
            }),
            towerBestFloor: Math.max(towerBestFloor, floor),
          });
        }
      },

      autoClimbTower: (options?: { silent?: boolean }) => {
        const silent = options?.silent ?? false;
        const startFloor = get().towerBestFloor + 1;
        const startGold = get().player?.gold ?? 0;
        const startCrystal = get().player?.crystal ?? 0;
        const startJade = get().player?.jade ?? 0;
        let cleared = 0;
        let reason: AutoTowerResult['reason'] = 'blocked';

        while (true) {
          const state = get();
          const { player, towerBestFloor } = state;
          if (!player) {
            reason = 'blocked';
            break;
          }

          if (towerBestFloor >= TOWER_MAX_FLOOR) {
            reason = 'max_floor';
            break;
          }

          const floor = towerBestFloor + 1;
          const err = state.canStartBattle('tower', `tower_${floor}`, floor);
          if (err) {
            reason = 'blocked';
            break;
          }

          const battle = simulateTowerFloor(player, floor);
          state.resolveBattle('tower', `tower_${floor}`, battle.win, floor, { silent: true });

          if (!battle.win) {
            reason = 'defeat';
            break;
          }

          cleared += 1;
        }

        const endState = get();
        const endFloor = endState.towerBestFloor;
        const result: AutoTowerResult = {
          cleared,
          fromFloor: startFloor,
          toFloor: endFloor,
          reason,
          goldGained: (endState.player?.gold ?? 0) - startGold,
          crystalGained: (endState.player?.crystal ?? 0) - startCrystal,
          jadeGained: (endState.player?.jade ?? 0) - startJade,
        };

        if (!silent) {
          if (cleared > 0) {
            const msg = reason === 'defeat'
              ? `Tự động vượt ${cleared} tầng, thua tầng ${endFloor + 1}!`
              : reason === 'max_floor'
                ? `Tự động vượt ${cleared} tầng — đã lên đỉnh tháp!`
                : `Tự động vượt ${cleared} tầng thành công!`;
            set({ ...setToast(msg) });
          } else if (reason === 'max_floor') {
            set({ ...setToast('Đã chinh phục đỉnh tháp') });
          } else {
            const err = get().canStartBattle('tower', `tower_${startFloor}`, startFloor);
            set({ ...setToast(err ?? 'Không thể tự động vượt tháp') });
          }
        }

        return result;
      },

      resetGame: () =>
        set({
          ...initialSave,
          dailyCounters: { ...EMPTY_COUNTERS },
          _hydrated: true,
          breakthroughMessage: null,
          toastMessage: null,
        }),
    }),
    {
      name: 'dao-to-tu-tien-save',
      partialize: (state) => ({
        hasCharacter: state.hasCharacter,
        player: state.player,
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
          if (!state.dailyCounters) state.dailyCounters = { ...EMPTY_COUNTERS };
          if (state.towerBestFloor === undefined) state.towerBestFloor = 0;
          if (!state.lastDailyResetAt) state.lastDailyResetAt = Date.now();
          if (state.player) {
            state.player = { ...state.player, stats: calcStats(state.player) };
          }
          state.checkOfflineOnLoad();
        }
      },
    },
  ),
);

export { hasClaimableQuests };
