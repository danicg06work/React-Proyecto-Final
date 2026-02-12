import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import AllGamesPage from './pages/AllGamesPage'
import MyGamesPage from './pages/MyGamesPage'
import NewGamePage from './pages/NewGamePage'
import GameDetailPage from './pages/GameDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/games" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/games" element={<AllGamesPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/my-games" element={<MyGamesPage />} />
            <Route path="/games/new" element={<NewGamePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/games" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
