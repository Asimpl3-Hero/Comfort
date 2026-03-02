import '../styles/ui/feature-carousel.css'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { formatCurrencyFromCents } from '../../../shared/utils/currency.js'

function pickRandomProducts(products, limit) {
  const source = products.filter((item) => item?.id)
  if (!source.length || limit <= 0) {
    return []
  }

  const shuffled = [...source]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }

  return shuffled.slice(0, Math.min(limit, shuffled.length))
}

export function FeatureCarousel({
  products = [],
  maxItems = 5,
  autoScrollSeconds = 28,
  onProductClick,
}) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'es'

  const featuredProducts = useMemo(
    () => pickRandomProducts(products, maxItems),
    [products, maxItems],
  )

  if (!featuredProducts.length) {
    return null
  }

  return (
    <section className="feature-carousel-section" aria-label={t('carousel.ariaLabel')}>
      <div className="container">
        <div className="feature-carousel-header">
          <h2>{t('carousel.title')}</h2>
          <p>{t('carousel.subtitle')}</p>
        </div>

        <div
          className="feature-carousel-mask"
          style={{ '--feature-carousel-duration': `${autoScrollSeconds}s` }}
        >
          <div className="feature-carousel-track">
            {[0, 1].map((groupIndex) => (
              <div
                className="feature-carousel-group"
                aria-hidden={groupIndex === 1}
                key={`carousel-group-${groupIndex}`}
              >
                {featuredProducts.map((product) => (
                  <button
                    type="button"
                    className="feature-carousel-card"
                    key={`${groupIndex}-${product.id}`}
                    aria-label={t('product.viewDetails', { name: product.name })}
                    onClick={() => onProductClick?.(product)}
                    disabled={!onProductClick}
                  >
                    <div
                      className="feature-carousel-card-image"
                      style={
                        product.imageUrl
                          ? {
                              backgroundImage: `url('${product.imageUrl}')`,
                            }
                          : undefined
                      }
                    />
                    <div className="feature-carousel-card-meta">
                      <h3 className="feature-carousel-card-title">{product.name}</h3>
                      <p className="feature-carousel-card-price">
                        {formatCurrencyFromCents(
                          product.priceInCents ?? 0,
                          product.currency ?? 'COP',
                          language,
                        )}
                      </p>
                      <p className="feature-carousel-card-stock">
                        {t('product.stock', { count: Number(product.stock ?? 0) })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
