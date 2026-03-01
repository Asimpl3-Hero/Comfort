import { useTranslation } from 'react-i18next'

const defaultHeroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCLCXAdNI6xMEkrBb3SgF4q6SARBz84nXFvNsAd3Wvq5WGgFyWEqzYjGgwGCeKxzSaRbCeZ4QBuCiF6AoJJXsebQllfZnrDO6AOfZOn-BEp_TMh7cy_-NZJXCXWtPH1ehtFkt4-1nOdHYhu4PgYK7hyVSIdxqHX5apz-GHBM5P-zh73VXkggQDn_-_qWVqvSH5vhHsp0CnR9anYLViXOY7u0l1s8VHvltOOMhW8sSG_tZTNUGQAAYez5s-0w2CIgGIXtj0tUFuO7PYi'

export function HeroSection({
  title,
  description,
  ctaLabel,
  imageUrl = defaultHeroImage,
  imageAlt,
  onCtaClick,
}) {
  const { t } = useTranslation()

  const resolvedTitle = title ?? t('hero.title')
  const resolvedDescription = description ?? t('hero.description')
  const resolvedCtaLabel = ctaLabel ?? t('hero.ctaLabel')
  const resolvedImageAlt = imageAlt ?? t('hero.imageAlt')

  return (
    <section className="hero-section">
      <div className="container">
        <div
          className="hero-panel"
          role="img"
          aria-label={resolvedImageAlt}
          style={{ backgroundImage: `url('${imageUrl}')` }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>{resolvedTitle}</h1>
            <p>{resolvedDescription}</p>
            <button type="button" onClick={onCtaClick}>
              {resolvedCtaLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
