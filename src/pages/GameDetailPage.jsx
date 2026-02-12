import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { getGameByIdService } from '../services/GameService'
import './Pages.css'

const GameDetailPage = () => {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadGame = async () => {
      try {
        const data = await getGameByIdService(id)
        setGame(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [id])

  if (loading) {
    return (
      <section className="page-panel">
        <Loading text="Cargando detalle..." />
      </section>
    )
  }

  if (error || !game) {
    return (
      <section className="page-panel">
        <p className="empty-list text-muted">{error || 'No se encontró el videojuego'}</p>
      </section>
    )
  }

  return (
    <section className="page-panel detail-panel">
      {game.imagen ? <img src={game.imagen} alt={game.nombre} className="detail-image" /> : null}
      <h2>{game.nombre}</h2>
      <p>{game.descripcion}</p>
      <p><strong>Compañía:</strong> {game.compania || 'Sin dato'}</p>
      <p><strong>Fecha lanzamiento:</strong> {game.fecha_lanzamiento || 'Sin dato'}</p>
      <p><strong>Precio:</strong> {game.precio}</p>
      <p><strong>Plataformas:</strong> {(game.plataformas || []).join(', ') || 'Sin dato'}</p>
      <p><strong>Categorías:</strong> {(game.categorias || []).join(', ') || 'Sin dato'}</p>
      {game.video ? (
        <a href={game.video} target="_blank" rel="noreferrer" className="detail-link">Ver video</a>
      ) : null}
    </section>
  )
}

export default GameDetailPage
