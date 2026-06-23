import { useNavigate, useLocation } from 'react-router-dom';
import { DEFAULT_NAV_ITEMS } from '@/components';
import { useGameStore, hasClaimableQuests } from '@/stores/gameStore';

export const NAV_ROUTES: Record<string, string> = {
  character: '/character',
  inventory: '/inventory',
  cultivation: '/home',
  sect: '/sect',
  immortal: '/dungeon',
  ranking: '/leaderboard',
  arena: '/arena',
  quests: '/quests',
  tower: '/tower',
  explore: '/dungeon',
  realm: '/dungeon',
  settings: '/settings',
};

export const SIDE_MENU_ROUTES: Record<string, string> = {
  ranking: '/leaderboard',
  arena: '/arena',
  secret: '/secret-realm',
  market: '/market',
  pet: '/pet',
  mount: '/mount',
  events: '/quests',
  benefits: '/quests',
  heaven: '/tower',
  '7day': '/quests',
  'sect-war': '/sect',
  // Cụm tính năng tu luyện (LEFT menu)
  sect: '/sect',
  technique: '/technique',
  talent: '/talent',
  alchemy: '/alchemy',
  forge: '/forge',
  ascension: '/ascension',
  settings: '/settings',
};

export function useGameNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const player = useGameStore((s) => s.player);

  const activeNav = Object.entries(NAV_ROUTES).find(([, path]) => path === location.pathname)?.[0] ?? 'cultivation';
  const claimable = player ? hasClaimableQuests(player) : false;

  const navItems = DEFAULT_NAV_ITEMS.map((item) => ({
    ...item,
    notify:
      item.id === 'sect'
        ? claimable
        : item.id === 'inventory'
          ? false
          : item.id === 'character'
            ? false
            : item.notify,
  }));

  const handleNav = (id: string) => {
    const route = NAV_ROUTES[id];
    if (route) navigate(route);
  };

  const handleSideMenu = (id: string) => {
    const route = SIDE_MENU_ROUTES[id];
    if (route) {
      navigate(route, { state: { from: location.pathname + location.search } });
    }
  };

  const goWithFrom = (path: string) => {
    navigate(path, { state: { from: location.pathname + location.search } });
  };

  return { activeNav, navItems, handleNav, handleSideMenu, navigate, goWithFrom };
}
