import { useTranslation } from 'react-i18next'

import { Logo } from './Logo.jsx'

export function Footer({
  links = [],
  copy = '(c) 2024 Comfort Inc.',
  brandName = 'Comfort',
  brandIcon = 'spa',
}) {
  const { t } = useTranslation()

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <Logo brandName={brandName} icon={brandIcon} />
        <nav className="footer-nav" aria-label={t('navbar.footerNav')}>
          {links.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p className="footer-copy">{copy}</p>
      </div>
    </footer>
  )
}
