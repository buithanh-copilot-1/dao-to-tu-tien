import type { BattleSpeed, GameSettings } from '@/types/game';
import {
  AncientIcon,
  BottomNav,
  GameBody,
  GameButton,
  GameFooter,
  GameFrame,
  GameHeader,
  GamePanel,
  GameScreen,
  PageHead,
  type AncientIconName,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { DEFAULT_GAME_SETTINGS, useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { useRedirectBack } from '@/hooks/useRedirectBack';

interface SettingSwitchProps {
  icon: AncientIconName;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

const BATTLE_SPEEDS: Array<{ id: BattleSpeed; label: string; description: string }> = [
  { id: 'slow', label: 'Chậm', description: 'Dễ đọc log chiến đấu' },
  { id: 'normal', label: 'Thường', description: 'Cân bằng hiệu ứng' },
  { id: 'fast', label: 'Nhanh', description: 'Rút gọn thời gian chờ' },
];

function SettingSwitch({ icon, title, description, checked, onToggle }: SettingSwitchProps) {
  return (
    <button
      type="button"
      className={`settings-switch ${checked ? 'settings-switch--on' : ''}`}
      onClick={onToggle}
      aria-pressed={checked}
    >
      <span className="settings-switch__icon">
        <AncientIcon name={icon} size={18} />
      </span>
      <span className="settings-switch__copy">
        <span className="settings-switch__title">{title}</span>
        <span className="settings-switch__desc">{description}</span>
      </span>
      <span className="settings-switch__track" aria-hidden="true">
        <span className="settings-switch__thumb" />
      </span>
    </button>
  );
}

export function SettingsPage() {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const resetSettings = useGameStore((s) => s.resetSettings);
  const devAddResources = useGameStore((s) => s.devAddResources);
  const { activeNav, navItems, handleNav } = useGameNav();
  const { goBack } = useRedirectBack('/home');

  const setSetting = <K extends keyof GameSettings,>(key: K, value: GameSettings[K]) => {
    updateSettings({ [key]: value } as Partial<GameSettings>);
  };

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody className="settings-body">
          <PageHead title="Cài Đặt" subtitle="Tùy chỉnh trải nghiệm tu tiên" showOrnament onBack={goBack} />

          <GamePanel title="Âm thanh & phản hồi">
            <div className="settings-stack">
              <SettingSwitch
                icon="festival"
                title="Âm thanh hiệu ứng"
                description="Bật/tắt hiệu ứng âm khi nhận thưởng, chiến đấu, nâng cấp."
                checked={settings.soundEnabled}
                onToggle={() => setSetting('soundEnabled', !settings.soundEnabled)}
              />
              <SettingSwitch
                icon="swirl"
                title="Nhạc nền"
                description="Lưu lựa chọn nhạc nền cho các màn có audio."
                checked={settings.musicEnabled}
                onToggle={() => setSetting('musicEnabled', !settings.musicEnabled)}
              />
              <SettingSwitch
                icon="bolt"
                title="Rung khi thao tác"
                description="Dành cho thiết bị hỗ trợ rung khi bấm hành động quan trọng."
                checked={settings.vibrationEnabled}
                onToggle={() => setSetting('vibrationEnabled', !settings.vibrationEnabled)}
              />
            </div>
          </GamePanel>

          <GamePanel title="Trải nghiệm">
            <div className="settings-stack">
              <SettingSwitch
                icon="pause"
                title="Giảm chuyển động"
                description="Giảm animation, nhấp nháy và rung màn hình khi chiến đấu."
                checked={settings.reducedMotion}
                onToggle={() => setSetting('reducedMotion', !settings.reducedMotion)}
              />
              <SettingSwitch
                icon="flame"
                title="Hiện thay đổi lực chiến"
                description="Hiện dòng + / - lực chiến trong thông báo và đột phá."
                checked={settings.showPowerDelta}
                onToggle={() => setSetting('showPowerDelta', !settings.showPowerDelta)}
              />
              <SettingSwitch
                icon="gift"
                title="Tự nhận thưởng offline"
                description="Tự cộng tài nguyên offline khi vào game, không hiện popup nhận thưởng."
                checked={settings.autoClaimOffline}
                onToggle={() => setSetting('autoClaimOffline', !settings.autoClaimOffline)}
              />
            </div>
          </GamePanel>

          <GamePanel title="Chiến đấu">
            <div className="settings-speed">
              {BATTLE_SPEEDS.map((speed) => (
                <button
                  key={speed.id}
                  type="button"
                  className={`settings-speed__item ${settings.battleSpeed === speed.id ? 'settings-speed__item--active' : ''}`}
                  onClick={() => setSetting('battleSpeed', speed.id)}
                >
                  <span>{speed.label}</span>
                  <small>{speed.description}</small>
                </button>
              ))}
            </div>
          </GamePanel>

          <GamePanel title="Dữ liệu">
            <div className="settings-data">
              <div className="settings-data__row">
                <AncientIcon name="check" size={18} className="anc-icon--jade" />
                <div>
                  <strong>Lưu tự động</strong>
                  <span>Tiến trình đang được lưu trong trình duyệt bằng save local.</span>
                </div>
              </div>
              <div className="settings-data__row">
                <AncientIcon name="scroll" size={18} className="anc-icon--gold" />
                <div>
                  <strong>Cài đặt mặc định</strong>
                  <span>Khôi phục mọi tùy chọn về trạng thái ban đầu, không xóa nhân vật.</span>
                </div>
              </div>
              <GameButton
                variant="secondary"
                fullWidth
                onClick={resetSettings}
                disabled={JSON.stringify(settings) === JSON.stringify(DEFAULT_GAME_SETTINGS)}
              >
                Khôi phục mặc định
              </GameButton>
            </div>
          </GamePanel>

          <GamePanel title="Developer Tools">
            <div className="settings-data" style={{ marginTop: 8 }}>
              <GameButton
                variant="primary"
                fullWidth
                onClick={devAddResources}
              >
                + 1M Vàng, 100K Linh Thạch...
              </GameButton>
            </div>
          </GamePanel>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
