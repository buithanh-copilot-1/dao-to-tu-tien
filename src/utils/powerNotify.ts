import type { Player } from '@/types/game';
import { calcCombatPower } from '@/utils/stats';

export type ToastVariant = 'info' | 'success' | 'error';

export interface GameToast {
  message: string;
  powerDelta: number | null;
  variant: ToastVariant;
}

export function calcPowerDelta(before: Player, after: Player): number {
  return calcCombatPower(after) - calcCombatPower(before);
}

export function buildToast(
  message: string,
  options?: {
    powerDelta?: number | null;
    variant?: ToastVariant;
    before?: Player;
    after?: Player;
  },
): GameToast {
  let powerDelta = options?.powerDelta ?? null;
  if (powerDelta === null && options?.before && options?.after) {
    const delta = calcPowerDelta(options.before, options.after);
    powerDelta = delta !== 0 ? delta : null;
  }

  const variant =
    options?.variant ??
    (powerDelta !== null && powerDelta > 0 ? 'success' : 'info');

  return { message, powerDelta, variant };
}
