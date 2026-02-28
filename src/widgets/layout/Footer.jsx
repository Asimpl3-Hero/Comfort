import { footerNavigationLinks } from '../../shared/config/navigation.js'
import { Logo } from '../../shared/ui/Logo.jsx'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <Logo compact />
        <nav className="footer-nav" aria-label="Footer">
          {footerNavigationLinks.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p>© 2024 Comfort Inc.</p>
      </div>
    </footer>
  )
}
