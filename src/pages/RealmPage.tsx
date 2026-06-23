import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useRedirectBack } from '@/hooks/useRedirectBack';
import { formatNumber } from '@/utils/format';
import { REALMS } from '@/data/realms';

export function RealmPage() {
  const player = useGameStore((s) => s.player)!;
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useRedirectBack('/character');

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageHead title="Cảnh Giới" showOrnament onBack={goBack} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {REALMS.map((realm) => {
              const isCurrent = realm.id === player.realmId;
              const passed = realm.id < player.realmId;
              return (
                <div
                  key={realm.id}
                  className="list-row"
                  style={{
                    alignItems: 'center',
                    gap: 10,
                    opacity: realm.id > player.realmId + 1 ? 0.5 : 1,
                    borderColor: isCurrent ? 'var(--gold-primary)' : undefined,
                    boxShadow: isCurrent ? 'var(--shadow-gold)' : undefined,
                  }}
                >
                  <span className="rank-medal" style={isCurrent ? { color: '#2a1810', background: 'radial-gradient(circle at 50% 32%, #ffe9a8, #d4a04a 70%)' } : undefined}>
                    {realm.id + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: isCurrent ? 'var(--gold-light)' : 'var(--text-gold)' }}>
                      {realm.name}
                      {isCurrent && <span style={{ fontSize: 9, color: 'var(--green-stat)' }}> · hiện tại (tầng {player.tier})</span>}
                      {passed && <AncientIcon name="check" size={12} className="anc-icon--jade" />}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {realm.maxTier} tầng · Hệ số sức mạnh ×{formatNumber(realm.powerMultiplier)}
                    </div>
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
