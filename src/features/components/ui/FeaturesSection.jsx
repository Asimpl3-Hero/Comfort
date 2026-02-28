export function FeaturesSection({
  title = 'Why Choose Comfort?',
  description = 'We believe in quality over quantity, purposefully crafting essentials using only the finest sustainable materials for your home and body.',
  items = [],
}) {
  return (
    <section className="features-section">
      <div className="features-surface">
        <div className="container">
          <div className="features-copy">
            <h2>{title}</h2>
            <p>{description}</p>
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
