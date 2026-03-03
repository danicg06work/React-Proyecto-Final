import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import {
  createGameCommentService,
  deleteGameCommentService,
  deleteGameService,
  getGameByIdService,
  getGameCommentsService,
  reportGameService,
  voteGameService
} from '../services/GameService'
import './Pages.css'

const GameDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, session } = useAuth()
  const [game, setGame] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [voting, setVoting] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [sendingComment, setSendingComment] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadGame = async () => {
      try {
        const [data, commentsData] = await Promise.all([
          getGameByIdService(id),
          getGameCommentsService(id)
        ])
        setGame(data)
        setComments(commentsData)
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

  const handleDelete = async () => {
    const confirmed = window.confirm('¿Seguro que quieres borrar este videojuego?')
    if (!confirmed) return

    setDeleting(true)
    setError('')

    try {
      await deleteGameService(session.token, id)
      navigate('/games')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleVote = async (type) => {
    if (!isAuthenticated || voting) return
    setVoting(true)
    setError('')

    try {
      const stats = await voteGameService(session.token, id, type)
      setGame((prev) => ({ ...prev, ...stats }))
    } catch (err) {
      setError(err.message)
    } finally {
      setVoting(false)
    }
  }

  const handleReport = async () => {
    if (!isAuthenticated || reporting) return
    setReporting(true)
    setError('')

    try {
      await reportGameService(session.token, id)
      alert('Videojuego reportado correctamente.')
    } catch (err) {
      setError(err.message)
    } finally {
      setReporting(false)
    }
  }

  const handleCreateComment = async (event) => {
    event.preventDefault()
    if (!isAuthenticated || !commentText.trim()) return

    setSendingComment(true)
    setError('')
    try {
      const createdComment = await createGameCommentService(session.token, id, commentText)
      setComments((prev) => [createdComment, ...prev])
      setCommentText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSendingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) return
    setError('')

    try {
      await deleteGameCommentService(session.token, commentId)
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    } catch (err) {
      setError(err.message)
    }
  }

  const canDeleteComment = (comment) => {
    if (!isAuthenticated) return false
    if (session.role === 'admin') return true
    return comment.userId === session?.id || comment.user?.username === session?.username
  }

  return (
    <section className="page-panel detail-panel">
      {game.imagen ? <img src={game.imagen} alt={game.nombre} className="detail-image" /> : null}
      <h2>{game.nombre}</h2>
      <p>{game.descripcion}</p>
      <p><strong>Compañía:</strong> {game.compania || 'Sin dato'}</p>
      <p><strong>Fecha lanzamiento:</strong> {game.fecha_lanzamiento || 'Sin dato'}</p>
      <p><strong>Precio:</strong> {game.precio}</p>
      <p><strong>Likes:</strong> {game.likesCount || 0}</p>
      <p><strong>Dislikes:</strong> {game.dislikesCount || 0}</p>
      <p><strong>Popularidad:</strong> {game.popularity || 0}</p>
      <p><strong>Plataformas:</strong> {(game.plataformas || []).join(', ') || 'Sin dato'}</p>
      <p><strong>Categorías:</strong> {(game.categorias || []).join(', ') || 'Sin dato'}</p>
      {error ? <p className="login-error">{error}</p> : null}

      {isAuthenticated ? (
        <div className="detail-actions">
          <button onClick={() => handleVote('like')} disabled={voting}>👍 Like</button>
          <button onClick={() => handleVote('dislike')} disabled={voting}>👎 Dislike</button>
          <button onClick={handleReport} disabled={reporting}>
            {reporting ? 'Reportando...' : 'Reportar inapropiado'}
          </button>
        </div>
      ) : null}

      {isAuthenticated ? (
        <button className="danger-btn" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Borrando...' : 'Borrar juego'}
        </button>
      ) : null}

      {game.video ? (
        <a href={game.video} target="_blank" rel="noreferrer" className="detail-link">Ver video</a>
      ) : null}

      <section>
        <h3>Comentarios</h3>
        {isAuthenticated ? (
          <form className="game-form" onSubmit={handleCreateComment}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Escribe un comentario"
              rows={3}
            />
            <button type="submit" disabled={sendingComment || !commentText.trim()}>
              {sendingComment ? 'Enviando...' : 'Comentar'}
            </button>
          </form>
        ) : null}

        <div className="comment-list">
          {comments.length === 0 ? <p className="text-muted">No hay comentarios todavía.</p> : null}
          {comments.map((comment) => (
            <article key={comment.id} className="comment-card">
              <p>
                <strong>{comment.user?.username || 'Usuario'}</strong> · {new Date(comment.createdAt).toLocaleString()}
              </p>
              <p>{comment.content}</p>
              {(session?.role === 'admin' || (canDeleteComment(comment) && comment.repliesCount === 0)) ? (
                <button onClick={() => handleDeleteComment(comment.id)} className="danger-btn">
                  Borrar comentario
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default GameDetailPage
