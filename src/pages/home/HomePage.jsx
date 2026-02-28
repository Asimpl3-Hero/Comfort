import '../../features/components/ui/home-sections.css'

import { FeaturesSection } from '../../features/components/ui/FeaturesSection.jsx'
import { HeroSection } from '../../features/components/ui/HeroSection.jsx'
import { NewArrivalsSection } from '../../features/components/ui/NewArrivalsSection.jsx'
import { NewsletterSection } from '../../features/components/ui/NewsletterSection.jsx'
import { AppLayout } from '../../features/components/ux/AppLayout.jsx'

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
