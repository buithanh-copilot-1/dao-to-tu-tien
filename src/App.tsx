import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './stores/gameStore';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { GameShell } from './components/routing/GameShell';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CharacterCreatePage } from './pages/CharacterCreatePage';
import { CharacterPage } from './pages/CharacterPage';
import { InventoryPage } from './pages/InventoryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { QuestPage } from './pages/QuestPage';
import { ArenaPage } from './pages/ArenaPage';
import { DungeonPage } from './pages/DungeonPage';
import { TowerPage } from './pages/TowerPage';
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
        <Route
          path="/create"
          element={
            <ProtectedRoute requireCharacter={false}>
              <CharacterCreatePage />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<GameRoute><HomePage /></GameRoute>} />
        <Route path="/character" element={<GameRoute><CharacterPage /></GameRoute>} />
        <Route path="/inventory" element={<GameRoute><InventoryPage /></GameRoute>} />
        <Route path="/quests" element={<GameRoute><QuestPage /></GameRoute>} />
        <Route path="/arena" element={<GameRoute><ArenaPage /></GameRoute>} />
        <Route path="/dungeon" element={<GameRoute><DungeonPage /></GameRoute>} />
        <Route path="/tower" element={<GameRoute><TowerPage /></GameRoute>} />
        <Route path="/leaderboard" element={<GameRoute><LeaderboardPage /></GameRoute>} />
      </Routes>
    </HydrationGate>
  );
}
