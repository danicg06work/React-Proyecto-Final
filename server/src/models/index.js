import User from './User.js';
import Game from './Game.js';
import Vote from './Vote.js';
import Comment from './Comment.js';
import Report from './Report.js';

// User can have many games
User.hasMany(Game, { foreignKey: 'userId', as: 'games' });

// Game belongs to a user (the creator/owner)
// Note: We'll make userId nullable if checking for admin or allowing system games, 
// but for the requirement "Obtener los videojuegos del usuario autenticado", ownership is key.
Game.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

User.hasMany(Vote, { foreignKey: 'userId', as: 'votes' });
Vote.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Game.hasMany(Vote, { foreignKey: 'gameId', as: 'votes', onDelete: 'CASCADE' });
Vote.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Game.hasMany(Comment, { foreignKey: 'gameId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Game.hasMany(Report, { foreignKey: 'gameId', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

export { User, Game, Vote, Comment, Report };
