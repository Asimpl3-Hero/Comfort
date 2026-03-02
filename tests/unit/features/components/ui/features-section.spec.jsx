import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FeaturesSection } from '../../../../../src/features/components/ui/FeaturesSection.jsx'

describe('FeaturesSection', () => {
  it('renders title, description and items', () => {
    render(
      <FeaturesSection
        items={[
          { id: 'b1', icon: 'eco', title: 'Sustainable', description: 'Desc' },
        ]}
      />,
    )

    expect(screen.getByText('features.title')).toBeInTheDocument()
    expect(screen.getByText('Sustainable')).toBeInTheDocument()
  })
})
