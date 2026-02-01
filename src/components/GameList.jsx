import React from 'react'
import Game from './Game'


const GameList = ({ lista = [] }) => {
  if (!Array.isArray(lista) || lista.length === 0) {
    return <p className="empty-list text-muted">No hay juegos para mostrar.</p>
  }

  return (
    <section className="game-list" aria-label="Listado de juegos">
      {lista.map((juego, idx) => (
        <Game
          nombre={juego.nombre}
          descripcion={juego.descripcion}
          plataformas={juego.plataformas}
          precio={juego.precio}
          imagen={juego.imagen}
        />
      ))}
    </section>
  )
}

export default GameList