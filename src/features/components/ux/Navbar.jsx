import { useTranslation } from 'react-i18next'

import i18n, { toggleLanguage } from '../../i18n/index.js'
import { Logo } from '../ui/Logo.jsx'

export function Navbar({
  links = [],
  showSearch = true,
  showThemeToggle = true,
  brandName = 'Comfort',
  brandIcon = 'spa',
  onSearchClick,
  onThemeToggle,
}) {
  const { t } = useTranslation()
  const currentLanguage = (i18n.resolvedLanguage ?? 'es').toUpperCase()

  return (
    <header className="site-navbar">
      <div className="container">
        <div className="navbar-shell">
          <div className="navbar-content">
            <Logo brandName={brandName} icon={brandIcon} />
            <nav className="top-nav" aria-label={t('navbar.primaryNav')}>
              {links.map((item) => (
                <a key={item.id} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="navbar-actions">
              {showSearch && (
                <button
                  type="button"
                  className="icon-button"
                  aria-label={t('navbar.search')}
                  onClick={onSearchClick}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    search
                  </span>
                </button>
              )}
              {showThemeToggle && (
                <button
                  type="button"
                  className="icon-button"
                  aria-label={t('navbar.toggleTheme')}
                  onClick={onThemeToggle}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    contrast
                  </span>
                </button>
              )}
              <button
                type="button"
                className="icon-button"
                aria-label={t('navbar.toggleLanguage')}
                onClick={toggleLanguage}
              >
                <span aria-hidden="true">{currentLanguage}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
