import { useTranslation } from 'react-i18next'

export function NewsletterSection({
  title,
  description,
  placeholder,
  buttonLabel,
  onSubmit,
}) {
  const { t } = useTranslation()
  const resolvedTitle = title ?? t('newsletter.title')
  const resolvedDescription = description ?? t('newsletter.description')
  const resolvedPlaceholder = placeholder ?? t('newsletter.placeholder')
  const resolvedButtonLabel = buttonLabel ?? t('newsletter.buttonLabel')

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit?.({ email: formData.get('email') })
  }

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card newsletter-content">
          <h2>{resolvedTitle}</h2>
          <p>{resolvedDescription}</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder={resolvedPlaceholder} required />
            <button type="submit">{resolvedButtonLabel}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
