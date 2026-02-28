import './layout.css'

import { useEffect } from 'react'

import { useAppSelector } from '../../app/store/hooks.js'
import { selectThemeMode } from '../../features/theme/model/selectors.js'
import { Footer } from './Footer.jsx'
import { Header } from './Header.jsx'

export function AppLayout({ children }) {
  const mode = useAppSelector(selectThemeMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return (
    <div className="app-shell">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
