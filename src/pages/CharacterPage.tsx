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
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { EQUIP_SLOTS, EQUIP_SLOT_LABELS } from '@/systems/equipment';
import { findItem } from '@/systems/inventory';
import { DEFAULT_ELEMENTS } from '@/components';
import { calcDisplayStats, calcCombatPower } from '@/utils/stats';
import { formatNumber } from '@/utils/format';

const STAT_LABELS: Record<string, string> = {
  hp: 'Sinh mệnh',
  attack: 'Công kích',
  defense: 'Phòng thủ',
  speed: 'Tốc độ',
  spirit: 'Linh lực',
  comprehension: 'Ngộ tính',
};

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
            <div style={{
              width: 80, height: 80, borderRadius: 8,
              background: 'rgba(10,20,40,0.6)', border: '1px solid rgba(212,175,55,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
            }}>
              {player.gender === 'male' ? '🧙‍♂️' : '🧙‍♀️'}
            </div>
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
                  <span className="character-stats__power-label">🔥 Lực chiến</span>
                  <span className="character-stats__power-value glow-orange">{formatNumber(combatPower)}</span>
                </div>
                <div className="character-stats__grid">
                  {Object.entries(displayStats).map(([key, val]) => (
                    <div key={key} className="character-stats__row">
                      <span className="character-stats__label">{STAT_LABELS[key]}</span>
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
