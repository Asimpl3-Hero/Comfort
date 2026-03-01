import { Logo } from './Logo.jsx'

export function Navbar({
  links = [],
  showSearch = true,
  showThemeToggle = true,
  brandName = 'Comfort',
  brandIcon = 'spa',
  currentLanguage = 'ES',
  labels = {},
  onSearchClick,
  onThemeToggle,
  onLanguageToggle,
}) {
  const resolvedLabels = {
    primaryNav: labels.primaryNav ?? 'Primary navigation',
    search: labels.search ?? 'Search',
    toggleTheme: labels.toggleTheme ?? 'Toggle theme',
    toggleLanguage: labels.toggleLanguage ?? 'Toggle language',
  }

  return (
    <header className="site-navbar">
      <div className="container">
        <div className="navbar-shell">
          <div className="navbar-content">
            <Logo brandName={brandName} icon={brandIcon} />
            <nav className="top-nav" aria-label={resolvedLabels.primaryNav}>
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
                  aria-label={resolvedLabels.search}
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
                  aria-label={resolvedLabels.toggleTheme}
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
                aria-label={resolvedLabels.toggleLanguage}
                onClick={onLanguageToggle}
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
