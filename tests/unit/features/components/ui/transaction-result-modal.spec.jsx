import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TransactionResultModal } from '../../../../../src/features/components/ui/TransactionResultModal.jsx'

describe('TransactionResultModal', () => {
  it('does not render when closed', () => {
    render(<TransactionResultModal isOpen={false} status="APPROVED" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders approved content with transaction id and closes', () => {
    const onClose = vi.fn()
    render(
      <TransactionResultModal
        isOpen
        status="APPROVED"
        orderId="order-1"
        transactionId="tx-1"
        onClose={onClose}
      />,
    )

    expect(screen.getByText('transactionResult.approvedTitle')).toBeInTheDocument()
    expect(screen.getByText(/tx-1/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'transactionResult.close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
