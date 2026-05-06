const AreaList = ({ areas }) => {
  return (
    <section className="panel">
      <h2>Available Cab Areas</h2>
      <p className="section-subtitle">Choose from active pickup and drop locations.</p>
      <div className="area-grid">
        {areas.map((area) => (
          <article key={area} className="area-item">
            {area}
          </article>
        ))}
      </div>
    </section>
  )
}

export default AreaList
