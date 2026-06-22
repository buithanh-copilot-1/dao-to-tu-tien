import { NotifyDot } from '../common/NotifyDot';
import { RealmBadge } from '../common/RealmBadge';

interface PlayerAvatarProps {
  src?: string;
  level: number;
  size?: number;
  notify?: boolean;
  emoji?: string;
}

export function PlayerAvatar({ src, level, notify, emoji = '🧙' }: PlayerAvatarProps) {
  return (
    <div className="player-avatar">
      <div className="player-avatar__frame">
        {src ? (
          <img className="player-avatar__img" src={src} alt="avatar" />
        ) : (
          <div className="player-avatar__img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            {emoji}
          </div>
        )}
      </div>
      <span className="player-avatar__level">{level}</span>
      {notify && <NotifyDot className="player-avatar__notify" />}
    </div>
  );
}

interface PlayerInfoProps {
  name: string;
  level: number;
  realm: string;
  combatPower?: string;
  avatarSrc?: string;
  notify?: boolean;
}

export function PlayerInfo({ name, level, realm, combatPower, avatarSrc, notify }: PlayerInfoProps) {
  return (
    <div className="player-info">
      <PlayerAvatar src={avatarSrc} level={level} notify={notify} />
      <div className="player-info__details">
        <span className="player-info__name">{name}</span>
        <RealmBadge text={realm} />
        {combatPower && (
          <div className="player-info__power">
            <span className="player-info__power-icon">🔥</span>
            <span>Lực chiến {combatPower}</span>
          </div>
        )}
      </div>
    </div>
  );
}
