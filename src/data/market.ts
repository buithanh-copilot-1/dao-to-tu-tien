import { ITEM_TEMPLATES } from '@/data/itemTemplates';

export type Currency = 'gold' | 'crystal' | 'jade';

export interface MarketEntry {
  id: string;
  templateId: string;
  price: number;
  currency: Currency;
}

/** Phường thị — vật phẩm có thể mua bằng vàng / linh thạch / tiên ngọc. */
export const MARKET_ENTRIES: MarketEntry[] = [
  { id: 'm_crystal_shard', templateId: 'crystal_shard', price: 50, currency: 'gold' },
  { id: 'm_herb_lingzhi', templateId: 'herb_lingzhi', price: 200, currency: 'gold' },
  { id: 'm_ore_mithril', templateId: 'ore_mithril', price: 60, currency: 'crystal' },
  { id: 'm_soul_shard', templateId: 'soul_shard', price: 120, currency: 'crystal' },
  { id: 'm_pill_qi', templateId: 'pill_qi', price: 80, currency: 'crystal' },
  { id: 'm_pill_spirit', templateId: 'pill_spirit', price: 5, currency: 'jade' },
  { id: 'm_pill_break', templateId: 'pill_break', price: 12, currency: 'jade' },
  { id: 'm_ring_longwen', templateId: 'ring_longwen', price: 40, currency: 'jade' },
];

export const CURRENCY_LABEL: Record<Currency, string> = {
  gold: 'Vàng',
  crystal: 'Linh Thạch',
  jade: 'Tiên Ngọc',
};

export function getMarketEntry(id: string): MarketEntry | undefined {
  return MARKET_ENTRIES.find((e) => e.id === id);
}

export function getTemplateName(templateId: string): string {
  return ITEM_TEMPLATES[templateId]?.name ?? templateId;
}

export function getTemplateIcon(templateId: string): string {
  return ITEM_TEMPLATES[templateId]?.icon ?? '❓';
}
