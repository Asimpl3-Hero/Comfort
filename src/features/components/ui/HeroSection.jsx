import { useTranslation } from 'react-i18next'

const DEFAULT_HERO_VIDEO_SRC = '/videos/Yoga.mp4'

export function HeroSection({
  title,
  description,
  ctaLabel,
  videoSrc = DEFAULT_HERO_VIDEO_SRC,
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
        <div className="hero-panel" role="region" aria-label={resolvedImageAlt}>
          <video
            className="hero-video"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
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
