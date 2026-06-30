import { Link, useLocation } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/lessons', label: 'Lessons', icon: '📚' },
  { path: '/vocabulary', label: 'Vocabulary', icon: '📝' },
  { path: '/quiz', label: 'Quiz', icon: '✏️' },
  { path: '/progress', label: 'Progress', icon: '📊' },
]

export function Navbar() {
  const location = useLocation()
  const { progress } = useProgress()

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">L</span>
          <span className="navbar__title">LinguaLearn</span>
        </Link>

        <nav className="navbar__nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar__link${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? ' navbar__link--active' : ''}`}
            >
              <span className="navbar__icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {progress.streak > 0 && (
          <div className="navbar__streak" title="Study streak">
            🔥 {progress.streak}
          </div>
        )}
      </div>
    </header>
  )
}
