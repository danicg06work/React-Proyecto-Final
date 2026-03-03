import { useEffect, useState } from 'react'
import GameList from '../components/GameList'
import Loading from '../components/Loading'
import { getAllGamesService } from '../services/GameService'
import './Pages.css'

const AllGamesPage = () => {
  const [games, setGames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
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

  const normalizeCategory = (value = '') => value.replace(/\s*\(.*\)\s*/, '').toLowerCase()

  const filteredGames = games.filter((game) => {
    const gameName = String(game.nombre || '').toLowerCase()
    const gameCompany = String(game.compania || '').toLowerCase()
    const query = searchTerm.trim().toLowerCase()

    const matchesSearch = query
      ? gameName.includes(query) || gameCompany.includes(query)
      : true

    const matchesCategory = categoryFilter
      ? (game.categorias || []).some((category) => normalizeCategory(category) === normalizeCategory(categoryFilter))
      : true

    const matchesPlatform = platformFilter
      ? (game.plataformas || []).some((platform) => platform.toLowerCase().includes(platformFilter.toLowerCase()))
      : true

    return matchesSearch && matchesCategory && matchesPlatform
  })

  return (
    <section className="page-panel">
      <h2>Todos los videojuegos</h2>
      <div className="list-controls">
        <label>
          Buscar:
          <input
            aria-label="Buscar"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre o compañía"
          />
        </label>
        <label>
          Categoría:
          <select aria-label="Categoría" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">Todas</option>
            <option value="Lucha">Lucha</option>
            <option value="Arcade">Arcade</option>
            <option value="Plataformas">Plataformas</option>
            <option value="Shooter">Shooter</option>
            <option value="Estrategia">Estrategia</option>
            <option value="Simulación">Simulación</option>
            <option value="Deporte">Deporte</option>
            <option value="Aventura">Aventura</option>
            <option value="Rol (RPG)">Rol (RPG)</option>
            <option value="Educación">Educación</option>
            <option value="Puzzle">Puzzle</option>
          </select>
        </label>
        <label>
          Plataforma:
          <select aria-label="Plataforma" value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)}>
            <option value="">Todas</option>
            <option value="PS5">PS5</option>
            <option value="Switch">Switch</option>
            <option value="Android">Android</option>
            <option value="PC">PC</option>
            <option value="iOS">iOS</option>
            <option value="Xbox">Xbox</option>
          </select>
        </label>
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
      {!loading && !error ? <GameList lista={filteredGames} /> : null}

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
