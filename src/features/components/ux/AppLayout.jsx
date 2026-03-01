import '../styles/ux/layout.css'

import { useTranslation } from 'react-i18next'

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
  const { t, i18n } = useTranslation()
  const currentLanguage = (i18n.resolvedLanguage ?? 'es').toUpperCase()

  const handleLanguageToggle = () => {
    const nextLanguage = (i18n.resolvedLanguage ?? 'es') === 'es' ? 'en' : 'es'
    i18n.changeLanguage(nextLanguage)
  }

  return (
    <div className="app-shell">
      <Navbar
        links={navLinks}
        showSearch={showSearch}
        showThemeToggle={showThemeToggle}
        currentLanguage={currentLanguage}
        labels={{
          primaryNav: t('navbar.primaryNav'),
          search: t('navbar.search'),
          toggleTheme: t('navbar.toggleTheme'),
          toggleLanguage: t('navbar.toggleLanguage'),
        }}
        onThemeToggle={onThemeToggle}
        onLanguageToggle={handleLanguageToggle}
      />
      <main>{children}</main>
      <Footer links={footerLinks} copy={footerCopy} />
      {showStoreFab && (
        <button
          type="button"
          className="store-fab"
          aria-label={t('layout.openCartWithItems', { count: storeFabCount })}
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
