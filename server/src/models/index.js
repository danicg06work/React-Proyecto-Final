import User from './User.js';
import Game from './Game.js';

// User can have many games
User.hasMany(Game, { foreignKey: 'userId', as: 'games' });

// Game belongs to a user (the creator/owner)
// Note: We'll make userId nullable if checking for admin or allowing system games, 
// but for the requirement "Obtener los videojuegos del usuario autenticado", ownership is key.
Game.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

export { User, Game };
