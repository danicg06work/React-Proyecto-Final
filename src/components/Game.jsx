import React from 'react'
import { Link } from 'react-router-dom'
import './Game.css'

const Game = ({ id, nombre, descripcion, plataformas = [], precio, imagen }) => {


  return (
    <article className="game-card" role="article">
      <img className="game-image" src={imagen} alt={`Imagen de ${nombre}`} />
      <div className="game-content">
        <div className="game-header">
          <h2 className="game-title">{nombre}</h2>
          <span className="game-price">{precio}</span>
        </div>
        <p className="game-desc">{descripcion}</p>
        <ul className="game-platforms">
          {(plataformas || []).map((plataforma, idx) => (
            <li key={`${plataforma}-${idx}`} className="platform-item">{plataforma}</li>
          ))}
        </ul>
        {id ? <Link className="game-link" to={`/games/${id}`}>Ver detalle</Link> : null}
      </div>
    </article>
  )
}

export default Game;
