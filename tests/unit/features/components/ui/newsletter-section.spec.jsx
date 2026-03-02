import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NewsletterSection } from '../../../../../src/features/components/ui/NewsletterSection.jsx'

describe('NewsletterSection', () => {
  it('submits email', () => {
    const onSubmit = vi.fn()
    render(<NewsletterSection onSubmit={onSubmit} />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test@mail.com' } })
    fireEvent.submit(screen.getByRole('button', { name: 'newsletter.buttonLabel' }).closest('form'))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@mail.com' })
  })
})
