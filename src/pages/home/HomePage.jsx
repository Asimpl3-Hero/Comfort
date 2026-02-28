import { AppLayout } from '../../widgets/layout/AppLayout.jsx'
import { FeaturesSection } from '../../widgets/home/FeaturesSection.jsx'
import { HeroSection } from '../../widgets/home/HeroSection.jsx'
import { NewArrivalsSection } from '../../widgets/home/NewArrivalsSection.jsx'
import { NewsletterSection } from '../../widgets/home/NewsletterSection.jsx'
import '../../widgets/home/home-sections.css'

export function HomePage() {
  return (
    <AppLayout>
      <HeroSection />
      <NewArrivalsSection />
      <FeaturesSection />
      <NewsletterSection />
    </AppLayout>
  )
}
