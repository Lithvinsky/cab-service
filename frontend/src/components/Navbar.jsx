import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">CabConnect</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/book">Book</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </header>
  )
}

export default Navbar
