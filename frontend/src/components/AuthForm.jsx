const AuthForm = ({ title, buttonText }) => {
  return (
    <form className="panel form-grid auth-form">
      <h2>{title}</h2>
      {title === 'Signup' && (
        <label>
          Full Name
          <input type="text" placeholder="Enter your name" />
        </label>
      )}
      <label>
        Email
        <input type="email" placeholder="name@company.com" />
      </label>
      <label>
        Password
        <input type="password" placeholder="Enter your password" />
      </label>
      <button className="btn btn-primary" type="submit">
        {buttonText}
      </button>
    </form>
  )
}

export default AuthForm
