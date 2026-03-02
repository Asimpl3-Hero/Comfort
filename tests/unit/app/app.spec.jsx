import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/features/theme/containers/ThemeModeSync.jsx', () => ({
  ThemeModeSync: () => <div>ThemeModeSync</div>,
}))

vi.mock('../../../src/pages/home/HomePage.jsx', () => ({
  HomePage: () => <div>HomePage</div>,
}))

import App from '../../../src/App.jsx'

describe('App', () => {
  it('renders theme sync and home page', () => {
    render(<App />)
    expect(screen.getByText('ThemeModeSync')).toBeInTheDocument()
    expect(screen.getByText('HomePage')).toBeInTheDocument()
  })
})
