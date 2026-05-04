const BookingForm = () => {
  return (
    <form className="panel form-grid">
      <h2>Book a Cab</h2>
      <label>
        Pickup Area
        <input type="text" placeholder="Enter pickup area" />
      </label>
      <label>
        Drop Area
        <input type="text" placeholder="Enter drop area" />
      </label>
      <label>
        Date
        <input type="date" />
      </label>
      <label>
        Time
        <input type="time" />
      </label>
      <button className="btn btn-primary" type="submit">
        Submit Booking
      </button>
    </form>
  )
}

export default BookingForm
