import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requireCharacter?: boolean;
}

export function ProtectedRoute({ children, requireCharacter = true }: ProtectedRouteProps) {
  const hasCharacter = useGameStore((s) => s.hasCharacter);
  const hydrated = useGameStore((s) => s._hydrated);

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

  if (requireCharacter && !hasCharacter) {
    return <Navigate to="/create" replace />;
  }

  if (!requireCharacter && hasCharacter) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
