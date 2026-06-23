import { useCallback, useState } from 'react';
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
import { BattleScreen } from '@/components/game/BattleScreen';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useSideMenuBack } from '@/hooks/useSideMenuBack';
import { formatNumber } from '@/utils/format';
import { SECRET_REALMS, getSecretRealmReq } from '@/data/secretRealm';
import { getSecretDropPreview } from '@/systems/drops';
import { ITEM_TEMPLATES } from '@/data/itemTemplates';
import { canEnterSecretRealm } from '@/systems/secretRealm';
import { calcCombatPower } from '@/utils/stats';
import { calcWinChance } from '@/systems/combat';

interface ActiveBattle {
  realmId: string;
}

export function SecretRealmPage() {
  const player = useGameStore((s) => s.player)!;
  const secretCounters = useGameStore((s) => s.dailyCounters.secret);
  const canStartBattle = useGameStore((s) => s.canStartBattle);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useSideMenuBack();
  const [battle, setBattle] = useState<ActiveBattle | null>(null);

  const power = calcCombatPower(player);

  const startExplore = useCallback((realmId: string) => {
    const err = canEnterSecretRealm(player, secretCounters, realmId);
    if (err) return;
    if (canStartBattle('secret', realmId)) return;
    setBattle({ realmId });
  }, [player, secretCounters, canStartBattle]);

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Bí Cảnh" showOrnament onBack={goBack} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SECRET_REALMS.map((r) => {
              const err = canEnterSecretRealm(player, secretCounters, r.id);
              const runs = secretCounters[r.id] ?? 0;
              const left = Math.max(0, r.dailyLimit - runs);
              const win = calcWinChance(power, r.power);

              return (
                <div key={r.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="entity-icon">
                      <AncientIcon name="realm" size={26} className="anc-icon--crystal" />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.description}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 9, color: 'var(--text-secondary)' }}>
                      <div>Yêu cầu: {getSecretRealmReq(r)}</div>
                      <div>Còn {left}/{r.dailyLimit} lượt</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                    <span className="meta-stat" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                      <AncientIcon name="flame" size={12} className="anc-icon--power" /> Lực địch {formatNumber(r.power)}
                    </span>
                    <span className="meta-stat" style={{ fontSize: 10, color: win >= 50 ? 'var(--green-stat)' : 'var(--red-alert)' }}>
                      Tỷ lệ thắng {win}%
                    </span>
                    <span className="meta-stat" style={{ fontSize: 10, color: 'var(--gold-light)' }}>
                      <AncientIcon name="coin" size={12} className="anc-icon--gold" /> {formatNumber(r.goldReward)}
                    </span>
                    <span className="meta-stat" style={{ fontSize: 10, color: 'var(--jade-light)' }}>
                      <AncientIcon name="gem" size={12} className="anc-icon--crystal" /> {formatNumber(r.crystalReward)}
                    </span>
                    {r.jadeReward > 0 && (
                      <span className="meta-stat" style={{ fontSize: 10, color: 'var(--jade-glow)' }}>
                        <AncientIcon name="jade" size={12} className="anc-icon--jade" /> {formatNumber(r.jadeReward)}
                      </span>
                    )}
                    {getSecretDropPreview(r).map((drop) => {
                      const template = ITEM_TEMPLATES[drop.templateId];
                      return (
                        <CatalogItemButton
                          key={drop.templateId}
                          templateId={drop.templateId}
                          className="meta-stat catalog-chip-btn"
                          style={{ fontSize: 10, color: 'var(--text-secondary)' }}
                          title={template?.name}
                        >
                          <ItemIcon icon={template?.icon ?? '📦'} className="reward-item-icon" /> {template?.name ?? drop.templateId}
                        </CatalogItemButton>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <GameButton
                      variant="primary"
                      style={{ fontSize: 11 }}
                      disabled={!!err}
                      onClick={() => startExplore(r.id)}
                    >
                      {err ?? 'Thám hiểm'}
                    </GameButton>
                  </div>
                </div>
              );
            })}
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>

        {battle && (
          <BattleScreen
            mode="secret"
            targetId={battle.realmId}
            onClose={() => setBattle(null)}
          />
        )}
      </GameScreen>
    </GameFrame>
  );
}
