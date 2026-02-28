export function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          <h2>Join the Comfort Club</h2>
          <p>
            Sign up for our newsletter to receive 15% off your first order and
            exclusive access to new launches.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="button">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  )
}
