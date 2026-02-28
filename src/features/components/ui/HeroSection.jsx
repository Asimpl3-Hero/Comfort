const defaultHeroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCLCXAdNI6xMEkrBb3SgF4q6SARBz84nXFvNsAd3Wvq5WGgFyWEqzYjGgwGCeKxzSaRbCeZ4QBuCiF6AoJJXsebQllfZnrDO6AOfZOn-BEp_TMh7cy_-NZJXCXWtPH1ehtFkt4-1nOdHYhu4PgYK7hyVSIdxqHX5apz-GHBM5P-zh73VXkggQDn_-_qWVqvSH5vhHsp0CnR9anYLViXOY7u0l1s8VHvltOOMhW8sSG_tZTNUGQAAYez5s-0w2CIgGIXtj0tUFuO7PYi'

export function HeroSection({
  title = 'Find Your Calm',
  description = 'Experience the ultimate in soft, sustainable loungewear designed specifically for your quietest moments.',
  ctaLabel = 'Shop Collection',
  imageUrl = defaultHeroImage,
  imageAlt = 'Woman relaxing in soft linen loungewear',
  onCtaClick,
}) {
  return (
    <section className="hero-section">
      <div className="container">
        <div
          className="hero-panel"
          role="img"
          aria-label={imageAlt}
          style={{ backgroundImage: `url('${imageUrl}')` }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>{title}</h1>
            <p>{description}</p>
            <button type="button" onClick={onCtaClick}>
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
