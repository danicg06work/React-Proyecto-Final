import './Header.css';
import Logo from '../assets/logo.jfif'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { session, isAuthenticated, logout } = useAuth()

  return (
    <header className="site-header">
      <div className="container header-inner">
        <img className="logo" src={Logo} alt="Logo" />
        <div className="header-text">
          <h1>Vapor</h1>
          <p className="tagline">Tus juegos al mejor precio</p>
        </div>

        <nav className="header-nav">
          <NavLink to="/games">Todos</NavLink>
          {isAuthenticated ? <NavLink to="/my-games">Mis juegos</NavLink> : null}
          {isAuthenticated ? <NavLink to="/games/new">Alta</NavLink> : null}
        </nav>

        <div className="header-actions">
          {!isAuthenticated ? <NavLink className="auth-btn" to="/login">Iniciar sesión</NavLink> : null}
          {!isAuthenticated ? <NavLink className="auth-btn secondary" to="/register">Registrarse</NavLink> : null}
          {isAuthenticated ? <span className="user-chip">{session.username}</span> : null}
          {isAuthenticated ? <button className="auth-btn" onClick={logout}>Cerrar sesión</button> : null}
        </div>
      </div>
    </header>
  )
}

export default Header