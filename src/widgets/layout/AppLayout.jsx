import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Footer } from './Footer.jsx'
import { Header } from './Header.jsx'
import './layout.css'

export function AppLayout({ children }) {
  const mode = useSelector((state) => state.theme.mode)

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
