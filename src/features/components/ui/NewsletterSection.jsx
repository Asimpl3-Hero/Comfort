export function NewsletterSection({
  title = 'Join the Comfort Club',
  description = 'Sign up for our newsletter to receive 15% off your first order and exclusive access to new launches.',
  placeholder = 'Enter your email',
  buttonLabel = 'Subscribe',
  onSubmit,
}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit?.({ email: formData.get('email') })
  }

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card newsletter-content">
          <h2>{title}</h2>
          <p>{description}</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder={placeholder} required />
            <button type="submit">{buttonLabel}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
