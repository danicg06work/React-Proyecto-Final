import { useEffect, useState } from 'react'
import GameList from '../components/GameList'
import Loading from '../components/Loading'
import { getAllGamesService } from '../services/GameService'
import './Pages.css'

const AllGamesPage = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await getAllGamesService()
        setGames(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadGames()
  }, [])

  return (
    <section className="page-panel">
      <h2>Todos los videojuegos</h2>
      {loading ? <Loading text="Cargando videojuegos..." /> : null}
      {error ? <p className="empty-list text-muted">{error}</p> : null}
      {!loading && !error ? <GameList lista={games} /> : null}
    </section>
  )
}

export default AllGamesPage
