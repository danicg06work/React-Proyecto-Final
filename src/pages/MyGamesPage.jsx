import { useEffect, useState } from 'react'
import GameList from '../components/GameList'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import { getMyGamesService } from '../services/GameService'
import './Pages.css'

const MyGamesPage = () => {
  const { session } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMyGames = async () => {
      try {
        const data = await getMyGamesService(session.token)
        setGames(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMyGames()
  }, [session.token])

  return (
    <section className="page-panel">
      <h2>Mis videojuegos</h2>
      {loading ? <Loading text="Cargando tus videojuegos..." /> : null}
      {error ? <p className="empty-list text-muted">{error}</p> : null}
      {!loading && !error ? <GameList lista={games} /> : null}
    </section>
  )
}

export default MyGamesPage
