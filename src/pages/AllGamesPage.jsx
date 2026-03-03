import { useEffect, useState } from 'react'
import GameList from '../components/GameList'
import Loading from '../components/Loading'
import { getAllGamesService } from '../services/GameService'
import './Pages.css'

const AllGamesPage = () => {
  const [games, setGames] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true)
      try {
        const data = await getAllGamesService({ page: currentPage, limit: pageSize, sortBy })
        setGames(data.games)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadGames()
  }, [currentPage, pageSize, sortBy])

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
    setCurrentPage(1)
  }

  return (
    <section className="page-panel">
      <h2>Todos los videojuegos</h2>
      <div className="list-controls">
        <label>
          Juegos por página:
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
        <label>
          Ordenar:
          <select value={sortBy} onChange={handleSortChange}>
            <option value="createdAt">Más recientes</option>
            <option value="popularity">Popularidad</option>
          </select>
        </label>
      </div>
      {loading ? <Loading text="Cargando videojuegos..." /> : null}
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

export default AllGamesPage
