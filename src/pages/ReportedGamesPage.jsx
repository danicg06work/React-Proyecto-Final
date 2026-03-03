import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import { deleteReportedGameService, getReportedGamesService } from '../services/GameService'
import './Pages.css'

const ReportedGamesPage = () => {
  const { session } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReportedGamesService(session.token)
        setReports(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [session.token])

  if (session.role !== 'admin') {
    return <Navigate to="/games" replace />
  }

  const handleDeleteGame = async (gameId) => {
    const confirmed = window.confirm('¿Seguro que quieres borrar este videojuego reportado?')
    if (!confirmed) return

    try {
      await deleteReportedGameService(session.token, gameId)
      setReports((prev) => prev.filter((report) => report.gameId !== gameId))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="page-panel">
      <h2>Videojuegos reportados</h2>
      {loading ? <Loading text="Cargando reportes..." /> : null}
      {error ? <p className="empty-list text-muted">{error}</p> : null}

      {!loading && !error ? (
        <div className="comment-list">
          {reports.length === 0 ? <p className="text-muted">No hay videojuegos reportados.</p> : null}
          {reports.map((report) => (
            <article key={report.id} className="comment-card">
              <p><strong>Juego:</strong> {report.game?.nombre || 'No disponible'}</p>
              <p><strong>Total reportes:</strong> {report.reportCount || 1}</p>
              <p><strong>Último reporte por:</strong> {report.lastReportedBy || 'Usuario'}</p>
              <p><strong>Última razón:</strong> {report.lastReason || 'Sin detalle'}</p>
              <button className="danger-btn" onClick={() => handleDeleteGame(report.gameId)}>
                Eliminar videojuego
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default ReportedGamesPage
