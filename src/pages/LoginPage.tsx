import { useNavigate } from 'react-router-dom';
import {
  GameFrame,
  GameScreen,
  GameBody,
  GameButton,
} from '@/components';
import { useGameStore } from '@/stores/gameStore';

export function LoginPage() {
  const navigate = useNavigate();
  const hasCharacter = useGameStore((s) => s.hasCharacter);

  const handlePlay = () => {
    navigate(hasCharacter ? '/home' : '/create');
  };

  return (
    <GameFrame>
      <GameScreen>
        <GameBody>
          <div className="login-screen">
            <div className="login-screen__hero">
              <p className="login-screen__seal">仙</p>
              <h1 className="login-screen__title glow-gold">Đạo Tổ Tu Tiên</h1>
              <p className="login-screen__motto">Tu luyện vạn năm · Vấn đạo thiên cơ</p>
            </div>

            <div className="login-screen__actions">
              <GameButton variant="light" icon="G" style={{ width: '100%' }} onClick={handlePlay}>
                Đăng nhập Google
              </GameButton>
              <GameButton variant="light" icon="🍎" style={{ width: '100%' }} onClick={handlePlay}>
                Đăng nhập Apple
              </GameButton>
              <GameButton variant="banner" onClick={handlePlay}>
                Chơi ngay
              </GameButton>
            </div>

            <div className="footer-links login-screen__legal">
              <p>Bằng việc tiếp tục, bạn đồng ý với</p>
              <p>
                <a href="#">Điều khoản sử dụng</a>
                {' | '}
                <a href="#">Chính sách bảo mật</a>
              </p>
            </div>

            <span className="version-badge">v1.0.0</span>
          </div>
        </GameBody>
      </GameScreen>
    </GameFrame>
  );
}
