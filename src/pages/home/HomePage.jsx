import '../../features/components/styles/ui/home-sections.css'

import { FeaturesSection } from '../../features/components/ui/FeaturesSection.jsx'
import { HeroSection } from '../../features/components/ui/HeroSection.jsx'
import { NewsletterSection } from '../../features/components/ui/NewsletterSection.jsx'
import { AppLayout } from '../../features/components/ux/AppLayout.jsx'
import { NewArrivalsSectionContainer } from '../../features/products/containers/NewArrivalsSectionContainer.jsx'
import { benefitsData } from '../../shared/config/benefitsData.js'
import { footerNavigationLinks, topNavigationLinks } from '../../shared/config/navigation.js'

export function HomePage() {
  return (
    <AppLayout
      navLinks={topNavigationLinks}
      footerLinks={footerNavigationLinks}
      footerCopy="(c) 2024 Comfort Inc."
    >
      <HeroSection />
      <NewArrivalsSectionContainer />
      <FeaturesSection items={benefitsData} />
      <NewsletterSection />
    </AppLayout>
  )
}
