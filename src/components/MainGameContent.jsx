import React, { useEffect, useState } from 'react'


import './MainGameContent.css'

import getGames from '../services/GameService'
import PlatformMenu from "./PlatformMenu"
import CategoryMenu from "./CategoryMenu"
import GameList from "./GameList"


const MainGameContent = () => {

    const [games, setGames] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedPlatform, setSelectedPlatform] = useState('')

    useEffect(() => {
        const loadGames = async () => {
            try {
                const data = await getGames()
                setGames(data)
            } catch (error) {
                console.error("Error cargando juegos:", error)
            }
        }

        loadGames()
    }, [])

    const normalizeCategory = (cat = '') => cat.replace(/\s*\(.*\)\s*/, '').toLowerCase()

    const filteredGames = games.filter((game) => {
      const catOk = selectedCategory
        ? (game.categorias || []).some(c => c.toLowerCase() === normalizeCategory(selectedCategory))
        : true

      const platOk = selectedPlatform
        ? (game.plataformas || []).some(p => p.toLowerCase().includes(selectedPlatform.toLowerCase()))
        : true

      return catOk && platOk
    })

    return (
    <div className="main-game-content">
      <div className="top-menus">
        <CategoryMenu setCategoria={setSelectedCategory} selectedCategory={selectedCategory} />
      </div>

      <div className="content-area">
        <GameList lista = {filteredGames} />
        <PlatformMenu selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />
      </div>
    </div>
  )
}


export default MainGameContent