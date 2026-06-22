import type { Player, Quest } from '@/types/game';
import { createDefaultQuests } from '@/data/quests';
import { addItemByTemplate } from './inventory';

function getQuestProgress(player: Player, quest: Quest): number {
  switch (quest.id) {
    case 'd1':
    case 'a1':
      return Math.floor(player.totalPlaySeconds);
    case 'd2':
      return player.breakthroughCount;
    case 'd3':
      return player.dungeonClears;
    case 'd4':
      return player.bossKills;
    case 'd5':
      return player.arenaWins;
    case 'm1':
      return player.realmId >= 1 ? 1 : 0;
    case 'm2':
      return player.realmId >= 2 ? 1 : 0;
    case 'a2':
      return player.inventory.length;
    default:
      return quest.progress;
  }
}

export function syncQuestProgress(player: Player): Player {
  const quests = player.quests.map((q) => {
    if (q.claimed) return q;
    const progress = Math.min(getQuestProgress(player, q), q.target);
    return { ...q, progress };
  });
  return { ...player, quests };
}

export function hasClaimableQuests(player: Player): boolean {
  return player.quests.some((q) => !q.claimed && q.progress >= q.target);
}

export function claimQuestReward(player: Player, questId: string): { player: Player; error?: string; message?: string } {
  const quest = player.quests.find((q) => q.id === questId);
  if (!quest) return { player, error: 'Không tìm thấy nhiệm vụ' };
  if (quest.claimed) return { player, error: 'Đã nhận thưởng' };
  if (quest.progress < quest.target) return { player, error: 'Chưa hoàn thành nhiệm vụ' };

  let updated = { ...player };
  const rewards: string[] = [];

  for (const reward of quest.rewards) {
    switch (reward.type) {
      case 'crystal':
        updated.crystal += reward.amount ?? 0;
        rewards.push(`💎 ${reward.amount}`);
        break;
      case 'gold':
        updated.gold += reward.amount ?? 0;
        rewards.push(`🪙 ${reward.amount}`);
        break;
      case 'jade':
        updated.jade += reward.amount ?? 0;
        rewards.push(`🟢 ${reward.amount}`);
        break;
      case 'item':
        if (reward.itemId) {
          const result = addItemByTemplate(updated, reward.itemId, 1);
          if (result.error) return { player, error: result.error };
          updated = result.player;
          rewards.push(`📦 vật phẩm`);
        }
        break;
    }
  }

  const activityGain = quest.type === 'daily' ? 20 : quest.type === 'main' ? 30 : 10;
  updated.activityPoints += activityGain;
  updated.quests = updated.quests.map((q) =>
    q.id === questId ? { ...q, claimed: true } : q,
  );

  return {
    player: syncQuestProgress(updated),
    message: `Nhận: ${rewards.join(', ')}`,
  };
}

export function shouldResetDaily(lastResetAt: number, now = Date.now()): boolean {
  const last = new Date(lastResetAt);
  const current = new Date(now);
  return (
    last.getFullYear() !== current.getFullYear() ||
    last.getMonth() !== current.getMonth() ||
    last.getDate() !== current.getDate()
  );
}

export function resetDailyQuests(player: Player): Player {
  const dailyIds = createDefaultQuests()
    .filter((q) => q.type === 'daily')
    .map((q) => q.id);

  const freshDaily = createDefaultQuests().filter((q) => q.type === 'daily');

  const quests = player.quests.map((q) => {
    if (!dailyIds.includes(q.id)) return q;
    const fresh = freshDaily.find((f) => f.id === q.id);
    return fresh ? { ...fresh, progress: getQuestProgress(player, fresh) } : q;
  });

  return syncQuestProgress({ ...player, quests, activityPoints: 0, claimedMilestones: [] });
}

export function claimMilestone(player: Player, points: number): { player: Player; error?: string; message?: string } {
  if (player.claimedMilestones.includes(points)) return { player, error: 'Đã nhận mốc này' };
  if (player.activityPoints < points) return { player, error: 'Chưa đủ điểm hoạt động' };

  const crystalReward = points * 50;
  return {
    player: {
      ...player,
      crystal: player.crystal + crystalReward,
      claimedMilestones: [...player.claimedMilestones, points],
    },
    message: `Nhận ${crystalReward} linh thạch`,
  };
}
