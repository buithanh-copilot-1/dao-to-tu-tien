import { NotifyDot } from '../common/NotifyDot';
import { RealmBadge } from '../common/RealmBadge';
import { AncientIcon } from '../common/AncientIcon';
import { SpiritPortrait } from '../game/SpiritPortrait';
import type { ElementType, Gender } from '@/types/game';

interface PlayerAvatarProps {
  src?: string;
  level: number;
  size?: number;
  notify?: boolean;
  emoji?: string;
  gender?: Gender;
  element?: ElementType;
}

export function PlayerAvatar({ src, level, notify, emoji = '🧙', gender, element }: PlayerAvatarProps) {
  return (
    <div className="player-avatar">
      <div className="player-avatar__frame">
        {src ? (
          <img className="player-avatar__img" src={src} alt="avatar" />
        ) : gender ? (
          <SpiritPortrait gender={gender} element={element} size="sm" className="player-avatar__spirit" />
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
  gender?: Gender;
  element?: ElementType;
}

export function PlayerInfo({ name, level, realm, combatPower, avatarSrc, notify, gender, element }: PlayerInfoProps) {
  return (
    <div className="player-info">
      <PlayerAvatar src={avatarSrc} level={level} notify={notify} gender={gender} element={element} />
      <div className="player-info__details">
        <span className="player-info__name">{name}</span>
        <RealmBadge text={realm} />
        {combatPower && (
          <div className="player-info__power">
            <span className="player-info__power-icon"><AncientIcon name="flame" size={12} className="anc-icon--power" /></span>
            <span>Lực chiến {combatPower}</span>
          </div>
        )}
      </div>
    </div>
  );
}
