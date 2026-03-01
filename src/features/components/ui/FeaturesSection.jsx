import { useTranslation } from 'react-i18next'

export function FeaturesSection({
  title,
  description,
  items = [],
}) {
  const { t } = useTranslation()
  const resolvedTitle = title ?? t('features.title')
  const resolvedDescription = description ?? t('features.description')

  return (
    <section className="features-section">
      <div className="features-surface">
        <div className="container">
          <div className="features-copy">
            <h2>{resolvedTitle}</h2>
            <p>{resolvedDescription}</p>
          </div>
          <div className="features-grid">
            {items.map((benefit) => (
              <article key={benefit.id} className="feature-card">
                <div className="feature-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {benefit.icon}
                  </span>
                </div>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
