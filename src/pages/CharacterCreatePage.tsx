import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import type { ElementType, Gender } from '@/types/game';
import loginBg from '@/assets/login/bg.png';
import loginLogo from '@/assets/login/logo.png';
import loginPlatform from '@/assets/login/platform.png';

const GENDERS: Array<{ id: Gender; label: string; icon: string }> = [
  { id: 'male', label: 'Nam', icon: '♂' },
  { id: 'female', label: 'Nữ', icon: '♀' },
];

const ELEMENTS: Array<{
  id: ElementType;
  name: string;
  description: string;
}> = [
  { id: 'metal', name: 'Kim', description: 'Cứng rắn, sắc bén' },
  { id: 'wood', name: 'Mộc', description: 'Sinh sôi, hỗ trợ' },
  { id: 'water', name: 'Thủy', description: 'Linh hoạt, khống chế' },
  { id: 'fire', name: 'Hỏa', description: 'Bùng nổ, sát thương' },
  { id: 'earth', name: 'Thổ', description: 'Vững chắc, phòng thủ' },
];

const RANDOM_NAMES = [
  'Lâm Phong',
  'Diệp Vân',
  'Hàn Lập',
  'Tần Vũ',
  'Mộ Thanh',
  'Bạch Liên',
  'Vân Dao',
  'Thanh Huyền',
];

function ElementGlyph({ type }: { type: ElementType }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {type === 'metal' && (
        <>
          <path d="M32 6 48 29 32 58 16 29Z" />
          <path d="M32 6v52M16 29h32M23 29l9 29 9-29" />
          <path d="M20 44 8 53M44 44l12 9" />
        </>
      )}
      {type === 'wood' && (
        <>
          <path d="M32 55V23" />
          <path d="M31 26C18 18 15 9 16 6c11 2 17 8 16 20Z" />
          <path d="M34 30c13-9 22-8 25-5-7 10-15 13-25 5Z" />
          <path d="M30 38c-12 1-20 8-22 15 10 2 18-2 22-15Z" />
        </>
      )}
      {type === 'water' && (
        <>
          <path d="M10 34c8-18 25-22 38-12 7 5 9 14 4 22-5 9-17 13-28 8" />
          <path d="M16 39c10 2 18-2 25-12" />
          <path d="M22 24c-2 10 3 18 15 22" />
        </>
      )}
      {type === 'fire' && (
        <>
          <path d="M34 6c4 13 16 18 16 34 0 11-8 18-18 18S14 51 14 40c0-9 5-15 11-21-1 8 2 13 9 16-5-10-3-19 0-29Z" />
          <path d="M31 39c-5 5-6 13 1 19 7-5 8-13 2-20" />
        </>
      )}
      {type === 'earth' && (
        <>
          <path d="M8 48 24 18l10 18 8-11 14 23Z" />
          <path d="M20 48h36M24 18l-3 30M42 25l-4 23" />
          <path d="M13 42c10 1 18-2 25-9" />
        </>
      )}
    </svg>
  );
}

export function CharacterCreatePage() {
  const navigate = useNavigate();
  const createCharacter = useGameStore((s) => s.createCharacter);

  const [gender, setGender] = useState<Gender>('male');
  const [element, setElement] = useState<ElementType>('water');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const oppositeGender = gender === 'male' ? 'female' : 'male';

  const randomName = () => {
    setName(RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]);
    setError('');
  };

  const handleStart = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 12) {
      setError('Tên nhân vật phải từ 2-12 ký tự');
      return;
    }

    createCharacter(trimmed, gender, element);
    navigate('/home');
  };

  return (
    <main className="create-page">
      <img className="create-page__bg" src={loginBg} alt="" aria-hidden="true" draggable={false} />
      <img className="create-page__platform" src={loginPlatform} alt="" aria-hidden="true" draggable={false} />

      <section className="create-screen" aria-label="Tạo nhân vật">
        <header className="create-screen__header">
          <img className="create-screen__logo" src={loginLogo} alt="Đạo Tổ Tu Tiên" draggable={false} />
          <h1>Tạo nhân vật</h1>
        </header>

        <div className="create-screen__hero">
          <div className={`create-screen__portrait create-screen__portrait--${gender}`}>
            <div className="create-screen__moon" aria-hidden="true" />
            <div className="create-screen__aura" aria-hidden="true" />
            <div className="create-screen__cultivator" aria-hidden="true">
              <span className="create-screen__hair" />
              <span className="create-screen__head" />
              <span className="create-screen__robe" />
              <span className="create-screen__sleeve create-screen__sleeve--left" />
              <span className="create-screen__sleeve create-screen__sleeve--right" />
            </div>
          </div>

          <aside className="create-screen__side">
            <h2>Giới tính</h2>
            <div className="create-screen__gender-list">
              {GENDERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`create-screen__gender ${item.id === gender ? 'create-screen__gender--active' : ''}`}
                  onClick={() => setGender(item.id)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`create-screen__thumb create-screen__thumb--${oppositeGender}`}
              onClick={() => setGender(oppositeGender)}
              aria-label={`Chọn ${oppositeGender === 'male' ? 'Nam' : 'Nữ'}`}
            >
              <span className="create-screen__thumb-face" aria-hidden="true" />
              <strong>Chọn {oppositeGender === 'male' ? 'Nam' : 'Nữ'}</strong>
            </button>
          </aside>
        </div>

        <section className="create-screen__section">
          <h2>Chọn linh căn</h2>
          <div className="create-screen__elements">
            {ELEMENTS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`create-screen__element create-screen__element--${item.id} ${
                  item.id === element ? 'create-screen__element--active' : ''
                }`}
                onClick={() => setElement(item.id)}
              >
                <span className="create-screen__element-orb">
                  <ElementGlyph type={item.id} />
                </span>
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="create-screen__section create-screen__section--name">
          <h2>Tên nhân vật</h2>
          <div className="create-screen__name-row">
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
              placeholder="Nhập tên nhân vật (2-12 ký tự)"
              maxLength={12}
              aria-label="Tên nhân vật"
            />
            <button type="button" onClick={randomName} aria-label="Random tên">
              ⚂
            </button>
          </div>
          {error && <p className="create-screen__error">{error}</p>}
        </section>

        <button type="button" className="create-screen__start" onClick={handleStart}>
          Bắt đầu tu tiên
        </button>
      </section>
    </main>
  );
}
