import { useDispatch } from 'react-redux'
import { toggleTheme } from '../../features/theme/model/themeSlice.js'
import { topNavigationLinks } from '../../shared/config/navigation.js'
import { Logo } from '../../shared/ui/Logo.jsx'

export function Header() {
  const dispatch = useDispatch()

  return (
    <header className="site-header">
      <div className="container header-content">
        <Logo />
        <nav className="top-nav" aria-label="Primary">
          {topNavigationLinks.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button" aria-label="Search">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
          </button>
          <button type="button" className="icon-button" aria-label="Shopping bag">
            <span className="material-symbols-outlined" aria-hidden="true">
              shopping_bag
            </span>
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Toggle color mode"
            onClick={() => dispatch(toggleTheme())}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              contrast
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
