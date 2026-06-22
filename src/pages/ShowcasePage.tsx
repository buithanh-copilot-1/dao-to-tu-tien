import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GameFrame,
  GameScreen,
  GameBody,
  PageTitle,
  GameButton,
  GamePanel,
  TabBar,
  ProgressBar,
  ItemSlot,
  NotifyDot,
  RealmBadge,
  CombatPower,
  TimerDisplay,
  PillToggle,
  ElementSelector,
  DEFAULT_ELEMENTS,
  GameInput,
  ItemGrid,
  EquipSlot,
} from '@/components';

const PAGES = [
  { path: '/login', label: 'Đăng nhập', icon: '🔑' },
  { path: '/home', label: 'Trang chủ', icon: '🏠' },
  { path: '/create', label: 'Tạo nhân vật', icon: '✨' },
  { path: '/inventory', label: 'Túi đồ', icon: '🎒' },
  { path: '/leaderboard', label: 'Bảng xếp hạng', icon: '🏆' },
];

export function ShowcasePage() {
  const [tab, setTab] = useState('buttons');
  const [pill, setPill] = useState('male');
  const [element, setElement] = useState('water');
  const [name, setName] = useState('');

  const showcaseTabs = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'panels', label: 'Panels' },
    { id: 'items', label: 'Items' },
    { id: 'forms', label: 'Forms' },
    { id: 'misc', label: 'Misc' },
  ];

  return (
    <GameFrame>
      <GameScreen>
        <GameBody>
          <PageTitle title="UI Components" subtitle="ĐẠO TỔ TU TIÊN" />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 8px 12px' }}>
            {PAGES.map((p) => (
              <Link key={p.path} to={p.path} style={{
                padding: '6px 10px',
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid var(--gold-primary)',
                borderRadius: 6,
                color: 'var(--text-gold)',
                fontSize: 11,
                textDecoration: 'none',
              }}>
                {p.icon} {p.label}
              </Link>
            ))}
          </div>

          <TabBar tabs={showcaseTabs} activeId={tab} onChange={setTab} />

          <div style={{ padding: '12px 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tab === 'buttons' && (
              <>
                <GameButton variant="primary">Primary Gold</GameButton>
                <GameButton variant="secondary">Secondary Dark</GameButton>
                <GameButton variant="light" icon="G">Đăng nhập Google</GameButton>
                <GameButton variant="claim" notify>Nhận</GameButton>
                <GameButton variant="go">Đến</GameButton>
                <GameButton variant="banner">BẮT ĐẦU TU TIÊN</GameButton>
                <GameButton variant="hex">Phi Thăng</GameButton>
              </>
            )}

            {tab === 'panels' && (
              <>
                <GamePanel title="Đang tu luyện">
                  <ProgressBar current={1.25e12} max={2e12} labelLeft="Bậc 3" labelRight="Bậc 4" />
                </GamePanel>
                <CombatPower value="35,897,260" />
                <TimerDisplay label="Đạo hữu đã rời đi" value="08:12:36" />
                <RealmBadge text="Đại Thừa Kỳ - Bậc 3" />
              </>
            )}

            {tab === 'items' && (
              <>
                <div style={{ display: 'flex', gap: 6 }}>
                  <ItemSlot icon="⚔️" rarity="legendary" enhance={15} locked stars={6} />
                  <ItemSlot icon="💎" rarity="epic" quantity={245} />
                  <ItemSlot icon="🌿" rarity="rare" quantity={532} />
                  <ItemSlot empty />
                </div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  <EquipSlot label="Vũ Khí" icon="⚔️" enhance={120} stars={6} />
                  <EquipSlot label="Áo Giáp" icon="🛡️" enhance={115} stars={5} />
                </div>
                <ItemGrid items={[
                  { icon: '⚔️', rarity: 'legendary', enhance: 15 },
                  { icon: '💊', rarity: 'epic', quantity: 86 },
                  { empty: true },
                  { empty: true },
                ]} columns={4} />
              </>
            )}

            {tab === 'forms' && (
              <>
                <PillToggle
                  options={[
                    { id: 'male', label: 'Nam', icon: '♂' },
                    { id: 'female', label: 'Nữ', icon: '♀' },
                  ]}
                  activeId={pill}
                  onChange={setPill}
                />
                <ElementSelector elements={DEFAULT_ELEMENTS} activeId={element} onChange={setElement} />
                <GameInput value={name} onChange={setName} placeholder="Nhập tên..." actionIcon="🎲" />
              </>
            )}

            {tab === 'misc' && (
              <>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <NotifyDot />
                  <NotifyDot size="sm" />
                  <span style={{ fontSize: 11 }}>Notification dots</span>
                </div>
                <ProgressBar current={65} max={100} thin showText={false} />
                <div className="mission-row">
                  <div className="mission-row__icon">🧘</div>
                  <div className="mission-row__content">
                    <div className="mission-row__title">Tu luyện 2 giờ</div>
                    <div className="mission-row__progress-text">Tiến độ: 120/120 phút</div>
                    <ProgressBar current={120} max={120} thin showText={false} />
                  </div>
                  <div className="mission-row__rewards">
                    <div className="mission-row__reward">💎<span className="mission-row__reward-qty">50</span></div>
                  </div>
                  <div className="mission-row__action">
                    <GameButton variant="claim" notify>Nhận</GameButton>
                  </div>
                </div>
              </>
            )}
          </div>
        </GameBody>
      </GameScreen>
    </GameFrame>
  );
}
