import { useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageHead,
  GameButton,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useRedirectBack } from '@/hooks/useRedirectBack';
import type { ElementType, PlayerStats } from '@/types/game';
import {
  getSpiritRootStatMultiplier,
  getSpiritRootUpgradeCost,
  SPIRIT_ROOT_MAX,
} from '@/data/spiritRoot';
import { getSpiritRoots, getSpiritRootNodeLevel, canUpgradeSpiritRootNode } from '@/systems/spiritRoot';
import { getRealmLabel } from '@/data/realms';
import { formatNumber } from '@/utils/format';

const ELEMENT_INFO: Record<ElementType, { name: string; icon: string; color: string; statLabel: string; stats: Partial<PlayerStats> }> = {
  metal: { name: 'Kim', icon: '⚡', color: '#f0c84a', statLabel: 'Công & Thủ', stats: { attack: 50, defense: 30 } },
  wood: { name: 'Mộc', icon: '🌱', color: '#5ad66f', statLabel: 'HP & Ngộ Tính', stats: { hp: 500, comprehension: 10 } },
  water: { name: 'Thủy', icon: '🌀', color: '#4ea3ff', statLabel: 'Thần Thức & Tốc', stats: { spirit: 20, speed: 15 } },
  fire: { name: 'Hỏa', icon: '🔥', color: '#e54848', statLabel: 'Công & Tốc', stats: { attack: 80, speed: 10 } },
  earth: { name: 'Thổ', icon: '⛰️', color: '#d4a04a', statLabel: 'Thủ & HP', stats: { defense: 60, hp: 800 } },
};

export function SpiritRootPage() {
  const player = useGameStore((s) => s.player)!;
  const upgradeSpiritRoot = useGameStore((s) => s.upgradeSpiritRoot);
  const showToast = useGameStore((s) => s.showToast);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useRedirectBack('/character');

  const [selectedElement, setSelectedElement] = useState<ElementType>(player.element);

  const roots = getSpiritRoots(player);
  const selectedLevel = getSpiritRootNodeLevel(player, selectedElement);
  const selectedInfo = ELEMENT_INFO[selectedElement];

  const atMax = selectedLevel >= SPIRIT_ROOT_MAX;
  const cost = getSpiritRootUpgradeCost(selectedLevel);
  const hasGold = player.gold >= cost.gold;
  const hasCrystal = player.crystal >= cost.crystal;
  const upgradeError = canUpgradeSpiritRootNode(player, selectedElement);

  // Calculate stats from all elements
  const accumulatedStats: PlayerStats = { hp: 0, attack: 0, defense: 0, speed: 0, spirit: 0, comprehension: 0 };
  (Object.keys(ELEMENT_INFO) as ElementType[]).forEach((el) => {
    const lvl = roots[el] ?? 1;
    const mult = getSpiritRootStatMultiplier(lvl);
    const elemStats = ELEMENT_INFO[el].stats;
    (Object.keys(elemStats) as (keyof PlayerStats)[]).forEach((stat) => {
      accumulatedStats[stat] += Math.floor((elemStats[stat] ?? 0) * mult);
    });
  });

  // Check Thiên Linh Căn milestone (Lv.80 on all 5 elements)
  const minLvl = Math.min(roots.metal, roots.wood, roots.water, roots.fire, roots.earth);
  const isThienLinhCanActive = minLvl >= 80;

  const handleUpgrade = () => {
    if (upgradeError) {
      showToast(upgradeError, { variant: 'error' });
      return;
    }
    upgradeSpiritRoot(selectedElement);
  };

  const handleAwaken = () => {
    showToast('Tính năng Thức tỉnh Linh Căn sẽ được mở ở cảnh giới cao hơn!', { variant: 'error' });
  };

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="spirit-root-body">
          <PageHead title="Linh Căn" showOrnament onBack={goBack} />

          {/* Sơ đồ Ngũ Hành */}
          <div className="spirit-root-diagram">
            <div className="realm-badge">
              Cảnh giới:
              <span>{getRealmLabel(player.realmId, player.tier).split(' - ')[0]}</span>
            </div>

            <div className="spirit-root-badge-wrap">
              <div className="spirit-root-quality" style={{
                background: isThienLinhCanActive ? 'linear-gradient(180deg, #4a3060 0%, #2d1a40 100%)' : 'rgba(30, 24, 18, 0.9)',
                borderColor: isThienLinhCanActive ? '#a86ec9' : 'rgba(201, 168, 108, 0.25)'
              }}>
                {isThienLinhCanActive ? 'Thiên Linh Căn' : `${ELEMENT_INFO[player.element].name} Linh Căn`}
              </div>
              <div className="spirit-root-desc">
                {isThienLinhCanActive
                  ? 'Trời ban ngũ hành linh căn viên mãn, vô cùng hiếm có'
                  : `Hấp thụ linh khí hệ ${ELEMENT_INFO[player.element].name} làm gốc`}
              </div>
            </div>

            {/* Vòng Tròn Ngũ Hành */}
            <div className="spirit-root-map">
              {/* Rune Ring Background SVG */}
              <svg className="spirit-root-rune-ring" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="43" fill="none" stroke="#c9a86c" strokeWidth="0.8" strokeDasharray="1.5, 4.5" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#c9a86c" strokeWidth="0.4" opacity="0.5" />
                <path d="M 50,7 A 43,43 0 1,1 49.9,7" fill="none" stroke="rgba(201, 168, 108, 0.4)" strokeWidth="1.2" stroke-dasharray="20 40 10 30" />
              </svg>

              {/* Cultivator Meditation Art */}
              <div className="spirit-root-cultivator">
                <div className="spirit-root-aura" />
                <svg className="spirit-root-silhouette" viewBox="0 0 24 24">
                  <path d="M12,4A2.5,2.5,0,1,0,9.5,6.5,2.5,2.5,0,0,0,12,4ZM12,10c-2.4,0-6.1,1.2-6.5,3.6-.3,1.8,1.4,3,3,3.4C10.1,17.4,11.3,18,12,18s1.9-.6,3.5-1c1.6-.4,3.3-1.6,3-3.4C18.1,11.2,14.4,10,12,10Zm-3.5,9H15.5A1.5,1.5,0,0,0,17,17.5a1.5,1.5,0,0,0-1.5-1.5H8.5A1.5,1.5,0,0,0,7,17.5,1.5,1.5,0,0,0,8.5,19Z" />
                </svg>
              </div>

              {/* 5 Element Node Buttons */}
              {(Object.keys(ELEMENT_INFO) as ElementType[]).map((el) => {
                const info = ELEMENT_INFO[el];
                const activeClass = selectedElement === el ? `active active-${el}` : '';
                return (
                  <button
                    key={el}
                    type="button"
                    className={`spirit-root-node node-pos-${el} ${activeClass}`}
                    onClick={() => setSelectedElement(el)}
                    aria-label={`Linh căn hệ ${info.name}`}
                  >
                    <span className="spirit-root-node-name" style={{ color: selectedElement === el ? '#fff' : info.color }}>
                      {info.name}
                    </span>
                    <span className="spirit-root-node-level">Lv.{roots[el] ?? 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bảng thuộc tính tổng hợp */}
          <section className="spirit-root-stats-panel">
            <h3 className="spirit-root-stats-title">TỔNG THUỘC TÍNH LINH CĂN</h3>
            <div className="spirit-root-stats-content">
              {/* Stats Grid */}
              <div className="spirit-root-stats-grid">
                <div className="spirit-root-stat-row">
                  <span className="spirit-root-stat-label">❤️ Khí Huyết:</span>
                  <span className="spirit-root-stat-val">+{formatNumber(accumulatedStats.hp)}</span>
                </div>
                <div className="spirit-root-stat-row">
                  <span className="spirit-root-stat-label">⚔️ Công Kích:</span>
                  <span className="spirit-root-stat-val">+{formatNumber(accumulatedStats.attack)}</span>
                </div>
                <div className="spirit-root-stat-row">
                  <span className="spirit-root-stat-label">🛡️ Phòng Ngự:</span>
                  <span className="spirit-root-stat-val">+{formatNumber(accumulatedStats.defense)}</span>
                </div>
                <div className="spirit-root-stat-row">
                  <span className="spirit-root-stat-label">⚡ Thân Pháp:</span>
                  <span className="spirit-root-stat-val">+{formatNumber(accumulatedStats.speed)}</span>
                </div>
              </div>

              {/* Passive Buff Card */}
              <div className="spirit-root-buff-card">
                <div className="spirit-root-buff-head">
                  <span>Thiên Linh Căn</span>
                  <span className={`spirit-root-buff-badge ${isThienLinhCanActive ? '' : 'inactive'}`}>
                    {isThienLinhCanActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                  </span>
                </div>
                <ul className="spirit-root-buff-list">
                  <li>Tất cả thuộc tính +20%</li>
                  <li>Tốc độ tu luyện +30%</li>
                  <li>Tỉ lệ bạo kích +15%</li>
                </ul>
                <div className="spirit-root-buff-req">
                  {isThienLinhCanActive ? 'Đã đạt mốc Lv.80' : `Cần Ngũ Hành đạt Lv.80 (${minLvl}/80)`}
                </div>
              </div>
            </div>
          </section>

          {/* Khung Tăng Cấp & Thức Tỉnh */}
          <div className="spirit-root-actions">
            {/* Box 1: Tăng cấp */}
            <div className="spirit-root-action-box">
              <h4 className="spirit-root-action-title">Tăng cấp Linh Căn ({selectedInfo.name})</h4>
              {atMax ? (
                <div style={{ fontSize: 10, color: 'var(--text-gold)', textAlign: 'center', margin: 'auto' }}>
                  Linh căn hệ {selectedInfo.name} đã đạt giới hạn tối đa.
                </div>
              ) : (
                <>
                  <div className="spirit-root-upgrade-preview">
                    <div className="spirit-root-preview-row">
                      <span>Cấp độ:</span>
                      <span className="spirit-root-preview-val">
                        {selectedLevel} <span className="spirit-root-preview-arrow">➔</span>{' '}
                        <span className="spirit-root-preview-next">{selectedLevel + 1}</span>
                      </span>
                    </div>
                    {Object.keys(selectedInfo.stats).map((key) => {
                      const statKey = key as keyof PlayerStats;
                      const base = selectedInfo.stats[statKey] ?? 0;
                      const curVal = Math.floor(base * getSpiritRootStatMultiplier(selectedLevel));
                      const nextVal = Math.floor(base * getSpiritRootStatMultiplier(selectedLevel + 1));
                      return (
                        <div key={statKey} className="spirit-root-preview-row">
                          <span>{statKey === 'hp' ? 'Khí Huyết' : statKey === 'attack' ? 'Công Kích' : statKey === 'defense' ? 'Phòng Ngự' : statKey === 'speed' ? 'Thân Pháp' : 'Ngộ Tính'}:</span>
                          <span className="spirit-root-preview-val">
                            +{formatNumber(curVal)} <span className="spirit-root-preview-arrow">➔</span>{' '}
                            <span className="spirit-root-preview-next">+{formatNumber(nextVal)}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="spirit-root-cost-row">
                    <span>Tiêu hao:</span>
                    <span className={`spirit-root-cost-val ${hasCrystal ? 'ok' : 'fail'}`}>
                      💎 {formatNumber(cost.crystal)}
                    </span>
                    <span className={`spirit-root-cost-val ${hasGold ? 'ok' : 'fail'}`}>
                      🪙 {formatNumber(cost.gold)}
                    </span>
                  </div>
                  <GameButton variant="primary" onClick={handleUpgrade} disabled={!!upgradeError}>
                    Tăng cấp
                  </GameButton>
                </>
              )}
            </div>

            {/* Box 2: Thức tỉnh */}
            <div className="spirit-root-action-box">
              <h4 className="spirit-root-action-title">Thức tỉnh Linh Căn</h4>
              <div className="spirit-root-awaken-content">
                <div className="spirit-root-awaken-icon-wrap">
                  <div className="spirit-root-awaken-ring" />
                  <div className="spirit-root-awaken-icon">☯️</div>
                </div>
                <div className="spirit-root-awaken-desc">Thức tỉnh tăng giới hạn cấp tối đa lên 100.</div>
              </div>
              <GameButton variant="secondary" style={{ filter: 'hue-rotate(50deg)' }} onClick={handleAwaken}>
                Thức tỉnh
              </GameButton>
            </div>
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
