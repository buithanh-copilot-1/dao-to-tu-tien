import { useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageTitle,
  TabBar,
  GamePanel,
  EquipSlot,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { SpiritPortrait } from '@/components/game/SpiritPortrait';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { EQUIP_SLOTS, EQUIP_SLOT_LABELS } from '@/systems/equipment';
import { findItem } from '@/systems/inventory';
import { DEFAULT_ELEMENTS } from '@/components';
import { calcDisplayStats, calcCombatPower, STAT_META } from '@/utils/stats';
import type { PlayerStats } from '@/types/game';
import { formatNumber } from '@/utils/format';

export function CharacterPage() {
  const player = useGameStore((s) => s.player)!;
  const unequipItem = useGameStore((s) => s.unequipItem);
  const { activeNav, navItems, handleNav } = useGameNav();
  const [tab, setTab] = useState('stats');

  const elementInfo = DEFAULT_ELEMENTS.find((e) => e.id === player.element);
  const displayStats = calcDisplayStats(player);
  const combatPower = calcCombatPower(player);

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageTitle title="Nhân vật" showOrnament />

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <SpiritPortrait gender={player.gender} element={player.element} size="lg" />
            <div>
              <div style={{ fontSize: 16, color: 'var(--text-gold)' }}>{player.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {elementInfo?.icon} Linh căn {elementInfo?.name} · {elementInfo?.description}
              </div>
            </div>
          </div>

          <TabBar
            tabs={[
              { id: 'stats', label: 'Thuộc tính' },
              { id: 'equip', label: 'Trang bị' },
            ]}
            activeId={tab}
            onChange={setTab}
          />

          {tab === 'stats' && (
            <GamePanel title="Chỉ số">
              <div className="character-stats">
                <div className="character-stats__power">
                  <span className="character-stats__power-label">
                    <AncientIcon name="flame" size={15} className="anc-icon--power" /> Lực chiến
                  </span>
                  <span className="character-stats__power-value glow-orange">{formatNumber(combatPower)}</span>
                </div>
                <div className="character-stats__grid">
                  {(Object.entries(displayStats) as [keyof PlayerStats, number][]).map(([key, val]) => (
                    <div key={key} className="character-stats__row">
                      <span className="character-stats__label">
                        <AncientIcon name={STAT_META[key].icon} size={13} /> {STAT_META[key].label}
                      </span>
                      <span className="character-stats__value">{formatNumber(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GamePanel>
          )}

          {tab === 'equip' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
              {EQUIP_SLOTS.map((slot) => {
                const itemId = player.equipment[slot];
                const item = itemId ? findItem(player, itemId) : undefined;
                return (
                  <div key={slot} onClick={() => item && unequipItem(slot)} role="button" tabIndex={0}>
                    <EquipSlot
                      label={EQUIP_SLOT_LABELS[slot].label}
                      icon={item?.icon ?? EQUIP_SLOT_LABELS[slot].icon}
                      enhance={item?.enhance}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
