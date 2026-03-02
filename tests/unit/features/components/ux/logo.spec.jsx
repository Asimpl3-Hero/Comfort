import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Logo } from '../../../../../src/features/components/ux/Logo.jsx'

describe('Logo', () => {
  it('renders brand name by default', () => {
    render(<Logo brandName="Comfort" icon="spa" />)
    expect(screen.getByText('Comfort')).toBeInTheDocument()
  })

  it('hides label in compact mode', () => {
    render(<Logo compact brandName="Comfort" />)
    expect(screen.queryByText('Comfort')).not.toBeInTheDocument()
  })
})
