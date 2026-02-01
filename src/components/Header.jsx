import './header.css';
import Logo from '../assets/logo.jfif'

const Header = () => {

  return (
    <header className="site-header">
      <div className="container header-inner">
        <img className="logo" src={Logo} alt="Logo" />
        <div className="header-text">
          <h1>Vapor</h1>
          <p className="tagline">Tus juegos al mejor precio</p>
        </div>
      </div>
    </header>
  )
}

export default Header