import '../styles/ui/cart-status-modal.css'

import { useEscapeKey } from '../../../app/hooks/index.js'

function formatMoney(amountInCents, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amountInCents) / 100)
}

export function CartStatusModal({
  isOpen = false,
  onClose,
  items = [],
  totalQuantity = 0,
  totalInCents = 0,
  currency = 'COP',
  onClearCart,
  onProceedToPayment,
}) {
  useEscapeKey(onClose, isOpen)

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="cart-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      onClick={onClose}
    >
      <div className="cart-modal-backdrop" />
      <div className="cart-modal-panel" onClick={(event) => event.stopPropagation()}>
        <header className="cart-modal-header">
          <h2>Cart status</h2>
          <button type="button" className="cart-modal-close" onClick={onClose}>
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </header>

        <div className="cart-modal-body">
          {items.length === 0 ? (
            <div className="cart-modal-empty">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <>
              <ul className="cart-modal-list">
                {items.map((item) => (
                  <li key={item.productId} className="cart-modal-item">
                    <div className="cart-modal-item-main">
                      <p className="cart-modal-item-title">{item.product.name}</p>
                      <p className="cart-modal-item-meta">
                        Qty: {item.quantity} | Stock: {item.product.stock}
                      </p>
                    </div>
                    <p className="cart-modal-item-total">
                      {formatMoney(item.totalInCents, item.product.currency)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="cart-modal-summary">
                <p>Items: {totalQuantity}</p>
                <p>Total: {formatMoney(totalInCents, currency)}</p>
              </div>
            </>
          )}
        </div>

        <footer className="cart-modal-footer">
          <button
            type="button"
            className="cart-secondary-btn"
            onClick={onClearCart}
            disabled={items.length === 0}
          >
            Vaciar carrito
          </button>
          <button
            type="button"
            className="cart-primary-btn"
            onClick={onProceedToPayment}
            disabled={items.length === 0}
          >
            Proceder al pago
          </button>
        </footer>
      </div>
    </div>
  )
}
