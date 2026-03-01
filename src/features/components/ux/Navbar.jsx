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
  return (
    <header className="site-navbar">
      <div className="container">
        <div className="navbar-shell">
          <div className="navbar-content">
            <Logo brandName={brandName} icon={brandIcon} />
            <nav className="top-nav" aria-label="Primary">
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
                  aria-label="Search"
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
                  aria-label="Toggle theme"
                  onClick={onThemeToggle}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    contrast
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
