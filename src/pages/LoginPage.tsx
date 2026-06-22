import { useNavigate } from 'react-router-dom';
import loginBg from '@/assets/login/bg.png';
import loginLogo from '@/assets/login/logo.png';
import loginPlatform from '@/assets/login/platform.png';
import loginBtnPlay from '@/assets/login/btn-play.png';
import loginFooterLegal from '@/assets/login/footer-legal.png';
import loginVersion from '@/assets/login/version.png';

const LEGAL_LINKS = [
  { key: 'terms', label: 'Điều khoản sử dụng' },
  { key: 'privacy', label: 'Chính sách bảo mật' },
] as const;

export function LoginPage() {
  const navigate = useNavigate();

  const enterGame = () => {
    navigate('/create');
  };

  return (
    <div className="login-page">
      <img
        className="login-page__bg"
        src={loginBg}
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      <img
        className="login-page__platform"
        src={loginPlatform}
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      <div className="login-page__content">
        <header className="login-page__hero">
          <img
            className="login-page__logo"
            src={loginLogo}
            alt="Đạo Tổ Tu Tiên - Tiên Hiệp Idle"
            draggable={false}
          />
        </header>

        <div className="login-page__spacer" aria-hidden="true" />

        <footer className="login-page__panel">
          <div className="login-page__actions" aria-label="Bắt đầu trò chơi">
            <button
              type="button"
              className="login-page__btn login-page__btn--play"
              onClick={enterGame}
              aria-label="Chơi ngay"
            >
              <img src={loginBtnPlay} alt="" aria-hidden="true" draggable={false} />
            </button>
          </div>

          <div className="login-page__legal">
            <img
              className="login-page__legal-img"
              src={loginFooterLegal}
              alt="Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật"
              draggable={false}
            />

            <div className="login-page__legal-links" aria-label="Điều khoản và chính sách">
              {LEGAL_LINKS.map((link) => (
                <button
                  key={link.key}
                  type="button"
                  className="login-page__legal-link"
                  aria-label={link.label}
                />
              ))}
            </div>
          </div>

          <img
            className="login-page__version"
            src={loginVersion}
            alt="Phiên bản v1.0.0"
            draggable={false}
          />
        </footer>
      </div>
    </div>
  );
}
