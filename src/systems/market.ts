import type { Player } from '@/types/game';
import { createItem } from '@/data/itemTemplates';
import { getMarketEntry } from '@/data/market';
import { addItem } from '@/systems/inventory';

type MarketResult = { player: Player; error?: string; message?: string };

/** Mua vật phẩm ở phường thị (tốn tài nguyên tương ứng). */
export function buyMarketItem(player: Player, entryId: string, quantity = 1): MarketResult {
  const entry = getMarketEntry(entryId);
  if (!entry) return { player, error: 'Không tìm thấy vật phẩm' };
  if (quantity <= 0) return { player, error: 'Số lượng không hợp lệ' };

  const total = entry.price * quantity;
  if (player[entry.currency] < total) return { player, error: 'Không đủ tài nguyên' };

  const charged: Player = { ...player, [entry.currency]: player[entry.currency] - total };
  const result = addItem(charged, createItem(entry.templateId, quantity));
  if (result.error) return { player, error: result.error };

  return { player: result.player, message: 'Mua thành công!' };
}
