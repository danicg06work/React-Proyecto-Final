import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginForm.css'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'

const textFieldSx = {
  '& .MuiInputLabel-root': {
    color: 'var(--muted)'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--text)'
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: 'var(--text)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.35)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--accent)'
    }
  },
  '& .MuiInputBase-input': {
    color: 'var(--text)'
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'var(--muted)',
    opacity: 1
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.06) inset',
    WebkitTextFillColor: 'var(--text)',
    transition: 'background-color 9999s ease-in-out 0s'
  }
}

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
      <Paper
        component="form"
        className="login-card"
        onSubmit={handleSubmit}
        elevation={6}
        sx={{
          backgroundColor: 'rgba(42, 42, 42, 0.92)',
          color: 'var(--text)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Typography variant="h5" sx={{ mb: 0.4, color: 'var(--text)' }}>{title}</Typography>

        <Stack spacing={1.2}>
          <TextField
            id="username"
            label="Usuario"
            size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
            fullWidth
            sx={textFieldSx}
          />

          <TextField
            id="password"
            label="Contraseña"
            type="password"
            size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
            fullWidth
            sx={textFieldSx}
          />
        </Stack>

        {error ? <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert> : null}

        <Box className="auth-actions single" sx={{ mt: 1 }}>
          <Button
            className="submit-btn"
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: 'var(--accent)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'var(--accent)'
              }
            }}
          >
            {loading ? 'Procesando...' : submitText}
          </Button>
        </Box>

        {secondaryText && secondaryTo ? (
          <p className="auth-switch">
            <Link to={secondaryTo}>{secondaryText}</Link>
          </p>
        ) : null}
      </Paper>
    </section>
  )
}

export default LoginForm
