import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Navbar } from '../../../../../src/features/components/ux/Navbar.jsx'

describe('Navbar', () => {
  it('renders links and invokes action handlers', () => {
    const onSearchClick = vi.fn()
    const onThemeToggle = vi.fn()
    const onLanguageToggle = vi.fn()

    render(
      <Navbar
        links={[{ id: 'shop', href: '/shop', label: 'Shop' }]}
        labels={{
          primaryNav: 'Primary',
          search: 'Search',
          toggleTheme: 'Theme',
          toggleLanguage: 'Language',
        }}
        onSearchClick={onSearchClick}
        onThemeToggle={onThemeToggle}
        onLanguageToggle={onLanguageToggle}
      />,
    )

    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Search' }))
    fireEvent.click(screen.getByRole('button', { name: 'Theme' }))
    fireEvent.click(screen.getByRole('button', { name: 'Language' }))

    expect(onSearchClick).toHaveBeenCalledTimes(1)
    expect(onThemeToggle).toHaveBeenCalledTimes(1)
    expect(onLanguageToggle).toHaveBeenCalledTimes(1)
  })
})
