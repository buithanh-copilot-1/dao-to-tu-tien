import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  GameButton,
  AncientIcon,
  ItemIcon,
  CatalogItemButton,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { formatNumber } from '@/utils/format';
import { MARKET_ENTRIES, getTemplateName, getTemplateIcon, type Currency } from '@/data/market';

const CURRENCY_ICON: Record<Currency, 'coin' | 'gem' | 'jade'> = {
  gold: 'coin',
  crystal: 'gem',
  jade: 'jade',
};

const CURRENCY_TONE: Record<Currency, string> = {
  gold: 'anc-icon--gold',
  crystal: 'anc-icon--crystal',
  jade: 'anc-icon--jade',
};

export function MarketPage() {
  const player = useGameStore((s) => s.player)!;
  const buyMarketItem = useGameStore((s) => s.buyMarketItem);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Phường Thị" showOrnament onBack={goBack} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MARKET_ENTRIES.map((e) => {
              const afford = player[e.currency] >= e.price;
              return (
                <div key={e.id} className="list-row" style={{ alignItems: 'center', gap: 8 }}>
                  <CatalogItemButton
                    templateId={e.templateId}
                    className="entity-icon entity-icon--sm market-row__icon-btn"
                    aria-label={`Xem ${getTemplateName(e.templateId)}`}
                  >
                    <ItemIcon icon={getTemplateIcon(e.templateId)} className="reward-item-icon" />
                  </CatalogItemButton>
                  <CatalogItemButton
                    templateId={e.templateId}
                    className="market-row__name-btn"
                    style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>{getTemplateName(e.templateId)}</div>
                    <div className="meta-stat" style={{ fontSize: 11, color: afford ? 'var(--text-secondary)' : 'var(--red-alert)' }}>
                      <AncientIcon name={CURRENCY_ICON[e.currency]} size={13} className={CURRENCY_TONE[e.currency]} />
                      {formatNumber(e.price)}
                    </div>
                  </CatalogItemButton>
                  <GameButton variant="primary" style={{ fontSize: 11 }} disabled={!afford} onClick={() => buyMarketItem(e.id, 1)}>
                    Mua
                  </GameButton>
                </div>
              );
            })}
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
