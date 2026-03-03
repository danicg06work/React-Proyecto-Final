import { useEffect, useState } from 'react'
import GameList from '../components/GameList'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import { getMyGamesService } from '../services/GameService'
import './Pages.css'

const MyGamesPage = () => {
  const { session } = useAuth()
  const [games, setGames] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMyGames = async () => {
      setLoading(true)
      try {
        const data = await getMyGamesService(session.token, { page: currentPage, limit: pageSize })
        setGames(data.games)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMyGames()
  }, [session.token, currentPage, pageSize])

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }

  return (
    <section className="page-panel">
      <h2>Mis videojuegos</h2>
      <div className="list-controls">
        <label>
          Juegos por página:
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>
      {loading ? <Loading text="Cargando tus videojuegos..." /> : null}
      {error ? <p className="empty-list text-muted">{error}</p> : null}
      {!loading && !error ? <GameList lista={games} /> : null}
      {!loading && !error ? (
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>Página {currentPage} de {Math.max(totalPages, 1)}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages}>
            Siguiente
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default MyGamesPage
