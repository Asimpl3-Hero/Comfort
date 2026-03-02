import '../styles/ui/transaction-result-modal.css'

import { useTranslation } from 'react-i18next'

import { useEscapeKey } from '../../../app/hooks/index.js'

export function TransactionResultModal({
  isOpen = false,
  status = null,
  transactionId = '',
  orderId = '',
  onClose,
}) {
  const { t } = useTranslation()

  useEscapeKey(onClose, isOpen)

  if (!isOpen || !status) {
    return null
  }

  const isApproved = status === 'APPROVED'
  const title = isApproved
    ? t('transactionResult.approvedTitle')
    : t('transactionResult.declinedTitle')
  const message = isApproved
    ? t('transactionResult.approvedMessage')
    : t('transactionResult.declinedMessage')

  return (
    <div
      className="transaction-result-modal"
      role="dialog"
      aria-modal="true"
      aria-label={t('transactionResult.ariaLabel')}
      onClick={onClose}
    >
      <div className="transaction-result-backdrop" />
      <div className="transaction-result-panel" onClick={(event) => event.stopPropagation()}>
        <div className={`transaction-result-badge ${isApproved ? 'is-approved' : 'is-declined'}`}>
          <span className="material-symbols-outlined" aria-hidden="true">
            {isApproved ? 'check_circle' : 'cancel'}
          </span>
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="transaction-result-details">
          <p>
            <strong>{t('transactionResult.transactionIdLabel')}:</strong>{' '}
            {transactionId || t('transactionResult.unavailable')}
          </p>
          <p>
            <strong>{t('transactionResult.orderIdLabel')}:</strong>{' '}
            {orderId || t('transactionResult.unavailable')}
          </p>
        </div>

        <button type="button" className="transaction-result-close-btn" onClick={onClose}>
          {t('transactionResult.close')}
        </button>
      </div>
    </div>
  )
}
