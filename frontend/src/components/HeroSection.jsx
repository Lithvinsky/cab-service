const HeroSection = () => {
  return (
    <section className="hero">
      <img
        className="hero-image"
        src="/assets/branding/hero-map.svg"
        alt="Abstract city map with highlighted cab route"
      />
      <p className="hero-kicker">Internal Employee Cab Service</p>
      <h1>Book cabs faster across your office locations</h1>
      <p className="hero-text">
        Automate employee transport with instant booking and centralized area
        management for admins.
      </p>
      <button type="button" className="btn btn-primary">
        Book a Cab
      </button>
    </section>
  )
}

export default HeroSection
