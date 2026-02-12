import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createGameService } from '../services/GameService'
import './Pages.css'

const NewGamePage = () => {
  const navigate = useNavigate()
  const { session } = useAuth()

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    compania: '',
    fecha_lanzamiento: '',
    plataformas: '',
    categorias: '',
    precio: '',
    imagen: '',
    video: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.nombre.trim() || !form.precio) {
      setError('Nombre y precio son obligatorios')
      return
    }

    setSaving(true)
    setError('')

    try {
      const created = await createGameService(session.token, {
        ...form,
        precio: Number(form.precio)
      })
      navigate(`/games/${created.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page-panel">
      <h2>Alta de videojuego</h2>
      <form className="game-form" onSubmit={handleSubmit}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" rows={4} />
        <input name="compania" value={form.compania} onChange={handleChange} placeholder="Compañía" />
        <input name="fecha_lanzamiento" value={form.fecha_lanzamiento} onChange={handleChange} placeholder="Fecha de lanzamiento" />
        <input name="plataformas" value={form.plataformas} onChange={handleChange} placeholder="Plataformas (separadas por coma)" />
        <input name="categorias" value={form.categorias} onChange={handleChange} placeholder="Categorías (separadas por coma)" />
        <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} placeholder="Precio" />
        <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL imagen" />
        <input name="video" value={form.video} onChange={handleChange} placeholder="URL video" />

        {error ? <p className="login-error">{error}</p> : null}

        <button type="submit" className="submit-btn" disabled={saving}>
          {saving ? 'Guardando...' : 'Crear videojuego'}
        </button>
      </form>
    </section>
  )
}

export default NewGamePage
