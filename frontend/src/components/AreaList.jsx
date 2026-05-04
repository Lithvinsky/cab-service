const AreaList = ({ areas }) => {
  return (
    <section className="panel">
      <h2>Available Cab Areas</h2>
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
