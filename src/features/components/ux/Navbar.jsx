import { Logo } from '../ui/Logo.jsx'

export function Navbar({
  links = [],
  showSearch = true,
  showCart = true,
  brandName = 'Comfort',
  brandIcon = 'spa',
  onSearchClick,
  onCartClick,
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
              {showCart && (
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Shopping bag"
                  onClick={onCartClick}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    shopping_bag
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
