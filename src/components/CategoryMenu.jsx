import React from 'react';
import './CategoryMenu.css';

const CategoryMenu = ({ setCategoria, selectedCategory = '' }) => {
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
      <button
        key="todas"
        className={selectedCategory === '' ? 'active' : ''}
        onClick={() => setCategoria('')}
      >
        Todas
      </button>

      {categorias.map((categoria) => (
        <button
          key={categoria}
          className={selectedCategory === categoria ? 'active' : ''}
          onClick={() => setCategoria(selectedCategory === categoria ? '' : categoria)}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
