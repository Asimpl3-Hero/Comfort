import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppLayout } from '../../../../../src/features/components/ux/AppLayout.jsx'
import { i18nMock, resetI18nMock } from '../../../../helpers/i18n.mock.js'

describe('AppLayout', () => {
  it('renders children and store FAB, toggles language', () => {
    resetI18nMock()

    render(
      <AppLayout
        navLinks={[]}
        footerLinks={[]}
        onStoreFabClick={() => {}}
        storeFabCount={2}
      >
        <div>content</div>
      </AppLayout>,
    )

    expect(screen.getByText('content')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'navbar.toggleLanguage' }))
    expect(i18nMock.changeLanguage).toHaveBeenCalledWith('en')
  })
})
