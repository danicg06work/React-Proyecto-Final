import { Navigate, useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/games" replace />
  }

  const handleRegister = async (credentials) => {
    await register(credentials)
    navigate('/games')
  }

  return (
    <div className="route-page">
      <LoginForm
        title="Crear cuenta"
        submitText="Registrarse"
        onSubmit={handleRegister}
        secondaryText="¿Ya tienes cuenta? Inicia sesión"
        secondaryTo="/login"
      />
    </div>
  )
}

export default RegisterPage
