import './Header.css';
import Logo from '../assets/logo.jfif'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AppBar, Box, Button, Chip, Toolbar, Typography } from '@mui/material'

const Header = () => {
  const { session, isAuthenticated, logout } = useAuth()

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'linear-gradient(90deg, rgba(115,35,255,0.95), rgba(96,27,143,0.92))',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)'
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: 78 }}>
        <img className="logo" src={Logo} alt="Logo" />

        <Box sx={{ minWidth: 120 }}>
          <Typography variant="h6" sx={{ lineHeight: 1.15, fontWeight: 700 }}>Vapor</Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>Tus juegos al mejor precio</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto', flexWrap: 'wrap' }}>
          <Button color="inherit" component={NavLink} to="/games">Todos</Button>
          {isAuthenticated ? <Button color="inherit" component={NavLink} to="/my-games">Mis juegos</Button> : null}
          {isAuthenticated ? <Button color="inherit" component={NavLink} to="/games/new">Alta</Button> : null}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {!isAuthenticated ? (
            <Button variant="contained" component={NavLink} to="/login">Iniciar sesión</Button>
          ) : null}
          {!isAuthenticated ? (
            <Button variant="outlined" color="inherit" component={NavLink} to="/register">Registrarse</Button>
          ) : null}
          {isAuthenticated ? <Chip label={session.username} color="secondary" size="small" /> : null}
          {isAuthenticated ? <Button variant="contained" color="error" onClick={logout}>Cerrar sesión</Button> : null}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header