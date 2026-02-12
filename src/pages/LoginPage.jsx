import { Navigate, useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/games" replace />
  }

  const handleLogin = async (credentials) => {
    await login(credentials)
    navigate('/games')
  }

  return (
    <div className="route-page">
      <LoginForm
        title="Iniciar sesión"
        submitText="Entrar"
        onSubmit={handleLogin}
        secondaryText="¿No tienes cuenta? Regístrate"
        secondaryTo="/register"
      />
    </div>
  )
}

export default LoginPage
