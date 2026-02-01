import React from 'react';
import './CategoryMenu.css';

const CategoryMenu = ({ setCategoria }) => {
  const categorias = [
    "Lucha",
    "Arcade",
    "Plataformas",
    "Shooter",
    "Estrategia",
    "Simulación",
    "Deporte",
    "Aventura",
    "Rol (RPG)",
    "Educación",
    "Puzzle"
  ];

  return (
    <div className="category-menu">
      {categorias.map((categoria) => (
        <button key={categoria} onClick={() => setCategoria(categoria)}>
          {categoria}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
