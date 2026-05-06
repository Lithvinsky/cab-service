const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="app-footer-content">
        <div className="app-footer-grid">
          <section>
            <p className="app-footer-title">CabConnect</p>
            <p className="app-footer-text">
              Internal cab booking platform for smoother office commute.
            </p>
          </section>

          <section>
            <p className="app-footer-title">Contact</p>
            <p>
              Email: <a href="mailto:support@cabconnect.local">support@cabconnect.local</a>
            </p>
            <p>
              Phone: <a href="tel:+48123456789">+48 123 456 789</a>
            </p>
          </section>
        </div>
        <p className="app-footer-copy">© {year} CabConnect. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
