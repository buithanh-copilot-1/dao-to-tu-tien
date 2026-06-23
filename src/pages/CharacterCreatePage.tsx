import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import { GenderPreviewCard } from '@/components/game/GenderPreviewCard';
import type { ElementType, Gender } from '@/types/game';
import createLogo from '@/assets/create/logo_daoto.png';
import createBg from '@/assets/create/bg.png';
import inputNameFrame from '@/assets/create/input_nhapten.png';
import btnStartTuTien from '@/assets/create/btn_batdaututien.png';
import portraitMale from '@/assets/create/ui_nhanvat_nam.png';
import portraitFemale from '@/assets/create/ui_nhanvat_nu.png';
import linhCanKim from '@/assets/create/linhcan_kim.png';
import linhCanMoc from '@/assets/create/linhcan_moc.png';
import linhCanThuy from '@/assets/create/linhcan_thuy.png';
import linhCanHoa from '@/assets/create/linhcan_hoa.png';
import linhCanTho from '@/assets/create/linhcan_tho.png';

const PORTRAITS: Record<Gender, string> = {
  male: portraitMale,
  female: portraitFemale,
};

const GENDERS: Array<{ id: Gender; label: string; symbol: string }> = [
  { id: 'male', label: 'Nam', symbol: '♂' },
  { id: 'female', label: 'Nữ', symbol: '♀' },
];

const ELEMENTS: Array<{
  id: ElementType;
  name: string;
  description: string;
  img: string;
}> = [
  { id: 'metal', name: 'Kim', description: 'Cứng rắn, sắc bén', img: linhCanKim },
  { id: 'wood', name: 'Mộc', description: 'Sinh sôi, hỗ trợ', img: linhCanMoc },
  { id: 'water', name: 'Thủy', description: 'Linh hoạt, khống chế', img: linhCanThuy },
  { id: 'fire', name: 'Hỏa', description: 'Bùng nổ, sát thương', img: linhCanHoa },
  { id: 'earth', name: 'Thổ', description: 'Vững chắc, phòng thủ', img: linhCanTho },
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

export function CharacterCreatePage() {
  const navigate = useNavigate();
  const createCharacter = useGameStore((s) => s.createCharacter);

  const [gender, setGender] = useState<Gender>('male');
  const [element, setElement] = useState<ElementType>('water');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const inactiveGender: Gender = gender === 'male' ? 'female' : 'male';

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
      <img className="create-page__bg" src={createBg} alt="" aria-hidden="true" draggable={false} />

      <section className="create-screen" aria-label="Tạo nhân vật">
        <header className="create-screen__header">
          <img className="create-screen__logo" src={createLogo} alt="Đạo Tổ Tu Tiên" draggable={false} />
          <h1>Tạo nhân vật</h1>
        </header>

        <div className="create-screen__hero">
          <div className={`create-screen__portrait create-screen__portrait--${gender}`}>
            <div className="create-screen__moon" aria-hidden="true" />
            <div className="create-screen__aura" aria-hidden="true" />
            <img
              key={gender}
              className="create-screen__portrait-img"
              src={PORTRAITS[gender]}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </div>

          <aside className="create-screen__side">
            <h2>Giới tính</h2>
            <div className="create-screen__gender-list">
              {GENDERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`create-screen__gender create-screen__gender--${item.id} ${item.id === gender ? 'create-screen__gender--active' : ''}`}
                  onClick={() => setGender(item.id)}
                  aria-pressed={item.id === gender}
                >
                  <span className="create-screen__gender-icon" aria-hidden="true">
                    {item.symbol}
                  </span>
                  <span className="create-screen__gender-label">{item.label}</span>
                </button>
              ))}
            </div>

            <GenderPreviewCard gender={inactiveGender} onSelect={() => setGender(inactiveGender)} />
          </aside>
        </div>

        <div className="create-screen__bottom">
          <section className="create-screen__section create-screen__section--elements">
            <h2>Chọn linh căn</h2>
            <div className="create-screen__elements">
              {ELEMENTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`create-screen__element ${item.id === element ? 'create-screen__element--active' : ''}`}
                  onClick={() => setElement(item.id)}
                >
                  <img src={item.img} alt={`${item.name} - ${item.description}`} draggable={false} />
                </button>
              ))}
            </div>
          </section>

          <section className="create-screen__section create-screen__section--name">
            <h2>Tên nhân vật</h2>
            <div className="create-screen__name-field">
              <img className="create-screen__name-frame" src={inputNameFrame} alt="" aria-hidden draggable={false} />
              <input
                className="create-screen__name-input"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError('');
                }}
                placeholder="Nhập tên nhân vật (2-12 ký tự)"
                maxLength={12}
                aria-label="Tên nhân vật"
              />
              <button type="button" className="create-screen__name-random" onClick={randomName} aria-label="Random tên" />
            </div>
            {error && <p className="create-screen__error">{error}</p>}
          </section>

          <button type="button" className="create-screen__start" onClick={handleStart}>
            <img src={btnStartTuTien} alt="Bắt đầu tu tiên" draggable={false} />
          </button>
        </div>
      </section>
    </main>
  );
}
