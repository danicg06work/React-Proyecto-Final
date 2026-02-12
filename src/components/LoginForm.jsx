import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginForm.css'

const LoginForm = ({
  title,
  submitText,
  onSubmit,
  secondaryText,
  secondaryTo
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError('Completa usuario y contraseña')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSubmit?.({ username, password })
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login-wrapper" aria-label="Autenticación">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-head">
          <h2>{title}</h2>
        </div>

        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu usuario"
          autoComplete="username"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          autoComplete="current-password"
        />

        {error ? <p className="login-error">{error}</p> : null}

        <div className="auth-actions single">
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Procesando...' : submitText}
          </button>
        </div>

        {secondaryText && secondaryTo ? (
          <p className="auth-switch">
            <Link to={secondaryTo}>{secondaryText}</Link>
          </p>
        ) : null}
      </form>
    </section>
  )
}

export default LoginForm
