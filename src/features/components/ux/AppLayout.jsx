import '../styles/ux/layout.css'

import { Footer } from './Footer.jsx'
import { Navbar } from './Navbar.jsx'

export function AppLayout({
  children,
  navLinks = [],
  footerLinks = [],
  footerCopy = '(c) 2024 Comfort Inc.',
  showSearch = true,
  showCart = true,
}) {
  return (
    <div className="app-shell">
      <Navbar links={navLinks} showSearch={showSearch} showCart={showCart} />
      <main>{children}</main>
      <Footer links={footerLinks} copy={footerCopy} />
    </div>
  )
}
