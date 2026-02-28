import { AppLayout } from '../../widgets/layout/AppLayout.jsx'
import './home-page.css'

export function HomePage() {
  return (
    <AppLayout>
      <section className="hero-shell container">
        <div>
          <p className="eyebrow">Comfort Home</p>
          <h1>Find Your Calm</h1>
          <p>
            Base estructural lista para migrar el contenido completo de
            <code> code.html </code>
            en componentes reutilizables.
          </p>
        </div>
      </section>
    </AppLayout>
  )
}
