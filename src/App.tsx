import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './stores/gameStore';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { GameShell } from './components/routing/GameShell';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CharacterCreatePage } from './pages/CharacterCreatePage';
import { CharacterPage } from './pages/CharacterPage';
import { EnhancePage } from './pages/EnhancePage';
import { InventoryPage } from './pages/InventoryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { QuestPage } from './pages/QuestPage';
import { ArenaPage } from './pages/ArenaPage';
import { DungeonPage } from './pages/DungeonPage';
import { TowerPage } from './pages/TowerPage';
import { SectPage } from './pages/SectPage';
import { TechniquePage } from './pages/TechniquePage';
import { TalentPage } from './pages/TalentPage';
import { AlchemyPage } from './pages/AlchemyPage';
import { ForgePage } from './pages/ForgePage';
import { MarketPage } from './pages/MarketPage';
import { PetPage, MountPage } from './pages/CompanionPage';
import { SecretRealmPage } from './pages/SecretRealmPage';
import { AscensionPage } from './pages/AscensionPage';
import { RealmPage } from './pages/RealmPage';
import { SpiritRootPage } from './pages/SpiritRootPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShowcasePage } from './pages/ShowcasePage';

function HydrationGate({ children }: { children: React.ReactNode }) {
  const hydrated = useGameStore((s) => s._hydrated);

  useEffect(() => {
    const unsub = useGameStore.persist.onFinishHydration(() => {
      useGameStore.setState({ _hydrated: true });
      useGameStore.getState().checkOfflineOnLoad();
    });
    if (useGameStore.persist.hasHydrated()) {
      useGameStore.setState({ _hydrated: true });
    }
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'var(--text-gold, #d4af37)',
        fontSize: 14,
      }}>
        Đang tải...
      </div>
    );
  }

  return children;
}

function GameRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <GameShell>{children}</GameShell>
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <HydrationGate>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CharacterCreatePage />} />
        <Route path="/home" element={<GameRoute><HomePage /></GameRoute>} />
        <Route path="/character" element={<GameRoute><CharacterPage /></GameRoute>} />
        <Route path="/enhance" element={<GameRoute><EnhancePage /></GameRoute>} />
        <Route path="/inventory" element={<GameRoute><InventoryPage /></GameRoute>} />
        <Route path="/quests" element={<GameRoute><QuestPage /></GameRoute>} />
        <Route path="/arena" element={<GameRoute><ArenaPage /></GameRoute>} />
        <Route path="/dungeon" element={<GameRoute><DungeonPage /></GameRoute>} />
        <Route path="/tower" element={<GameRoute><TowerPage /></GameRoute>} />
        <Route path="/sect" element={<GameRoute><SectPage /></GameRoute>} />
        <Route path="/technique" element={<GameRoute><TechniquePage /></GameRoute>} />
        <Route path="/talent" element={<GameRoute><TalentPage /></GameRoute>} />
        <Route path="/alchemy" element={<GameRoute><AlchemyPage /></GameRoute>} />
        <Route path="/forge" element={<GameRoute><ForgePage /></GameRoute>} />
        <Route path="/market" element={<GameRoute><MarketPage /></GameRoute>} />
        <Route path="/pet" element={<GameRoute><PetPage /></GameRoute>} />
        <Route path="/mount" element={<GameRoute><MountPage /></GameRoute>} />
        <Route path="/secret-realm" element={<GameRoute><SecretRealmPage /></GameRoute>} />
        <Route path="/ascension" element={<GameRoute><AscensionPage /></GameRoute>} />
        <Route path="/realm" element={<GameRoute><RealmPage /></GameRoute>} />
        <Route path="/spirit-root" element={<GameRoute><SpiritRootPage /></GameRoute>} />
        <Route path="/leaderboard" element={<GameRoute><LeaderboardPage /></GameRoute>} />
        <Route path="/settings" element={<GameRoute><SettingsPage /></GameRoute>} />
      </Routes>
    </HydrationGate>
  );
}
