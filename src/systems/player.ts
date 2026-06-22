import type { ElementType, Gender, Player } from '@/types/game';
import { createDefaultQuests } from '@/data/quests';
import { createItem, STARTER_ITEMS } from '@/data/itemTemplates';
import { getCultivationRate } from '@/data/realms';
import { calcStats } from '@/utils/stats';

export function createNewPlayer(name: string, gender: Gender, element: ElementType): Player {
  const now = Date.now();
  const inventory = STARTER_ITEMS.map((id) => createItem(id));

  const player: Player = {
    name,
    gender,
    element,
    realmId: 0,
    tier: 1,
    cultivation: 0,
    cultivationRate: 0,
    autoCultivate: true,
    crystal: 1000,
    gold: 500,
    jade: 0,
    silver: 0,
    inventory,
    equipment: {},
    inventoryCapacity: 50,
    quests: createDefaultQuests(),
    activityPoints: 0,
    claimedMilestones: [],
    stats: { hp: 0, attack: 0, defense: 0, speed: 0, spirit: 0, comprehension: 0 },
    totalPlaySeconds: 0,
    breakthroughCount: 0,
    dungeonClears: 0,
    bossKills: 0,
    arenaWins: 0,
    createdAt: now,
    lastOnlineAt: now,
  };

  player.cultivationRate = getCultivationRate(player.realmId, player.tier, player.element);
  player.stats = calcStats(player);
  return player;
}

export function getDisplayLevel(player: Player): number {
  return player.realmId * 9 + player.tier;
}
