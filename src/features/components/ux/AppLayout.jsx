import '../styles/ux/layout.css'

import { Footer } from './Footer.jsx'
import { Navbar } from './Navbar.jsx'

export function AppLayout({
  children,
  navLinks = [],
  footerLinks = [],
  footerCopy = '(c) 2024 Comfort Inc.',
  showSearch = true,
  showThemeToggle = true,
  showStoreFab = true,
  onThemeToggle,
  onStoreFabClick,
  storeFabCount = 0,
}) {
  return (
    <div className="app-shell">
      <Navbar
        links={navLinks}
        showSearch={showSearch}
        showThemeToggle={showThemeToggle}
        onThemeToggle={onThemeToggle}
      />
      <main>{children}</main>
      <Footer links={footerLinks} copy={footerCopy} />
      {showStoreFab && (
        <button
          type="button"
          className="store-fab"
          aria-label={`Open cart with ${storeFabCount} items`}
          onClick={onStoreFabClick}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            shopping_bag
          </span>
          {storeFabCount > 0 && <span className="store-fab-count">{storeFabCount}</span>}
        </button>
      )}
    </div>
  )
}
