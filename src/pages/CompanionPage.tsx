import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  GamePanel,
  GameButton,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { STAT_META } from '@/utils/stats';
import { formatNumber } from '@/utils/format';
import type { Player, PlayerStats } from '@/types/game';
import {
  PETS,
  MOUNTS,
  getCompanionUpgradeCost,
  type CompanionCurrency,
  type CompanionDef,
} from '@/data/companions';

const CURRENCY_ICON: Record<CompanionCurrency, 'coin' | 'gem' | 'jade'> = {
  gold: 'coin', crystal: 'gem', jade: 'jade',
};
const CURRENCY_TONE: Record<CompanionCurrency, string> = {
  gold: 'anc-icon--gold', crystal: 'anc-icon--crystal', jade: 'anc-icon--jade',
};

interface CompanionViewProps {
  kind: 'pet' | 'mount';
  title: string;
  defs: CompanionDef[];
  ownedOf: (p: Player) => Record<string, number> | undefined;
  activeOf: (p: Player) => string | undefined;
}

function CompanionView({ kind, title, defs, ownedOf, activeOf }: CompanionViewProps) {
  const player = useGameStore((s) => s.player)!;
  const summon = useGameStore((s) => s.summonCompanion);
  const upgrade = useGameStore((s) => s.upgradeCompanion);
  const activate = useGameStore((s) => s.activateCompanion);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();

  const owned = ownedOf(player) ?? {};
  const activeId = activeOf(player);

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title={title} showOrnament onBack={goBack} />

          <GamePanel title="Linh thạch khả dụng">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-gold)' }}>
              <AncientIcon name="gem" size={16} className="anc-icon--crystal" />
              {formatNumber(player.crystal)}
            </div>
          </GamePanel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {defs.map((c) => {
              const level = owned[c.id] ?? 0;
              const isOwned = level > 0;
              const isActive = activeId === c.id;
              const maxed = level >= c.maxLevel;
              const upCost = getCompanionUpgradeCost(c, Math.max(level, 1));
              const statKeys = Object.keys(c.bonusPerLevel) as (keyof PlayerStats)[];

              return (
                <div key={c.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="entity-icon">
                      <AncientIcon name={c.icon} size={26} className={isActive ? 'anc-icon--power' : isOwned ? 'anc-icon--gold' : 'anc-icon--crystal'} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>
                        {c.name}{' '}
                        {isOwned && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Lv.{level}/{c.maxLevel}</span>}
                        {isActive && <span style={{ fontSize: 9, color: 'var(--green-stat)' }}> · đang dùng</span>}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.description}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                    {statKeys.map((k) => (
                      <span key={k} className="meta-stat" style={{ fontSize: 11, color: 'var(--green-stat)' }}>
                        <AncientIcon name={STAT_META[k].icon} size={13} className="anc-icon--jade" />
                        {STAT_META[k].label} +{formatNumber((c.bonusPerLevel[k] ?? 0) * Math.max(level, 1))}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                    {!isOwned ? (
                      <GameButton
                        variant="primary"
                        style={{ fontSize: 11 }}
                        disabled={player[c.unlockCurrency] < c.unlockCost}
                        onClick={() => summon(kind, c.id)}
                      >
                        Thu phục · <AncientIcon name={CURRENCY_ICON[c.unlockCurrency]} size={11} className={CURRENCY_TONE[c.unlockCurrency]} /> {formatNumber(c.unlockCost)}
                      </GameButton>
                    ) : (
                      <>
                        {!isActive && (
                          <GameButton variant="secondary" style={{ fontSize: 11 }} onClick={() => activate(kind, c.id)}>
                            Kích hoạt
                          </GameButton>
                        )}
                        {!maxed ? (
                          <GameButton
                            variant="primary"
                            style={{ fontSize: 11 }}
                            disabled={player.crystal < upCost}
                            onClick={() => upgrade(kind, c.id)}
                          >
                            Nâng cấp · <AncientIcon name="gem" size={11} className="anc-icon--crystal" /> {formatNumber(upCost)}
                          </GameButton>
                        ) : (
                          <span style={{ fontSize: 10, color: 'var(--green-stat)', alignSelf: 'center' }}>MAX</span>
                        )}
                      </>
                    )}
                  </div>
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

export function PetPage() {
  return <CompanionView kind="pet" title="Linh Thú" defs={PETS} ownedOf={(p) => p.pets} activeOf={(p) => p.activePet} />;
}

export function MountPage() {
  return <CompanionView kind="mount" title="Tọa Kỵ" defs={MOUNTS} ownedOf={(p) => p.mounts} activeOf={(p) => p.activeMount} />;
}
