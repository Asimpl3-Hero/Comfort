import '../styles/ui/push-notification-toast.css'

import { useTranslation } from 'react-i18next'

export function PushNotificationToast({ notification, onClose }) {
  const { t } = useTranslation()

  if (!notification) {
    return null
  }

  const iconName = notification.kind === 'warning' ? 'warning' : 'check_circle'

  return (
    <aside className="push-toast-shell" aria-live="polite" aria-atomic="true">
      <div className={`push-toast push-toast-${notification.kind ?? 'success'}`} role="status">
        <div className="push-toast-icon">
          <span className="material-symbols-outlined" aria-hidden="true">
            {iconName}
          </span>
        </div>
        <div className="push-toast-copy">
          <p className="push-toast-title">
            {notification.title ?? t('home.notifications.cartUpdated')}
          </p>
          <p className="push-toast-message">{notification.message}</p>
        </div>
        <button type="button" className="push-toast-close" onClick={onClose} aria-label={t('home.dismiss')}>
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </button>
      </div>
    </aside>
  )
}
