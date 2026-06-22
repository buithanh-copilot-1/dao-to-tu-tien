import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GameFrame,
  GameScreen,
  GameBody,
  GameFooter,
  PageTitle,
  SectionHeader,
  PillToggle,
  ElementSelector,
  DEFAULT_ELEMENTS,
  GameInput,
  GameButton,
} from '@/components';
import { useGameStore } from '@/stores/gameStore';
import type { ElementType, Gender } from '@/types/game';

export function CharacterCreatePage() {
  const navigate = useNavigate();
  const createCharacter = useGameStore((s) => s.createCharacter);

  const [gender, setGender] = useState('male');
  const [element, setElement] = useState('water');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const randomName = () => {
    const names = ['Lâm Phong', 'Diệp Vân', 'Hàn Lập', 'Trương Tam', 'Lý Tứ', 'Vương Ngũ', 'Triệu Lục'];
    setName(names[Math.floor(Math.random() * names.length)]);
    setError('');
  };

  const handleStart = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 12) {
      setError('Tên nhân vật phải từ 2-12 ký tự');
      return;
    }
    createCharacter(trimmed, gender as Gender, element as ElementType);
    navigate('/home');
  };

  return (
    <GameFrame>
      <GameScreen>
        <GameBody>
          <div className="create-screen">
            <PageTitle title="Đạo Tổ" subtitle="TẠO NHÂN VẬT" />

            <div className="create-screen__preview-row">
              <div className="create-screen__avatar-panel">
                {gender === 'male' ? '🧙‍♂️' : '🧙‍♀️'}
              </div>

              <div className="create-screen__gender-col">
                <SectionHeader text="GIỚI TÍNH" />
                <PillToggle
                  options={[
                    { id: 'male', label: 'Nam', icon: '♂' },
                    { id: 'female', label: 'Nữ', icon: '♀' },
                  ]}
                  activeId={gender}
                  onChange={setGender}
                />
                <div className="create-screen__gender-hint">
                  <div className="create-screen__gender-hint-icon">
                    {gender === 'male' ? '🧙‍♀️' : '🧙‍♂️'}
                  </div>
                  <span>Chọn {gender === 'male' ? 'Nữ' : 'Nam'}</span>
                </div>
              </div>
            </div>

            <div>
              <SectionHeader text="CHỌN LINH CĂN" />
              <div className="create-screen__section-body">
                <ElementSelector
                  elements={DEFAULT_ELEMENTS}
                  activeId={element}
                  onChange={setElement}
                />
              </div>
            </div>

            <div>
              <SectionHeader text="TÊN NHÂN VẬT" />
              <div className="create-screen__section-body">
                <GameInput
                  value={name}
                  onChange={(v) => { setName(v); setError(''); }}
                  placeholder="Nhập tên nhân vật (2-12 ký tự)"
                  actionIcon="🎲"
                  onAction={randomName}
                />
              </div>
              {error && <p className="create-screen__error">{error}</p>}
            </div>
          </div>
        </GameBody>

        <GameFooter>
          <div className="create-screen__footer">
            <GameButton variant="banner" onClick={handleStart}>
              BẮT ĐẦU TU TIÊN
            </GameButton>
          </div>
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
