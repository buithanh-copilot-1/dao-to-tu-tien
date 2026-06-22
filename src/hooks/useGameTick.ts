import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';

const TICK_INTERVAL = 100;

export function useGameTick() {
  const tick = useGameStore((s) => s.tick);
  const hasCharacter = useGameStore((s) => s.hasCharacter);
  const lastTick = useRef(Date.now());

  useEffect(() => {
    if (!hasCharacter) return;

    lastTick.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick.current;
      lastTick.current = now;
      tick(delta);
    }, TICK_INTERVAL);

    return () => clearInterval(id);
  }, [hasCharacter, tick]);
}
