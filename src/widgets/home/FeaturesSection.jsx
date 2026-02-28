import { benefitsData } from '../../entities/benefit/model/benefitsData.js'

export function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-copy">
          <h2>Why Choose Comfort?</h2>
          <p>
            We believe in quality over quantity, purposefully crafting
            essentials using only the finest sustainable materials for your home
            and body.
          </p>
        </div>
        <div className="features-grid">
          {benefitsData.map((benefit) => (
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
    </section>
  )
}
