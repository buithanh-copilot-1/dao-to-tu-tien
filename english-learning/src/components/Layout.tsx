import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2026 LinguaLearn — Learn English, one step at a time.</p>
      </footer>
    </div>
  )
}
