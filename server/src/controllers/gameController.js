import { Game, User } from '../models/index.js';

export const getAllGames = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await Game.findAndCountAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
            // Include owner username if needed
            // include: [{ model: User, as: 'owner', attributes: ['username'] }] 
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            games: rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyGames = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await Game.findAndCountAll({
            where: { userId: req.userId },
            offset: parseInt(offset),
            limit: parseInt(limit)
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            games: rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGame = async (req, res) => {
    try {
        // userId comes from verifyToken middleware
        const gameData = {
            ...req.body,
            userId: req.userId,
            // Ensure arrays are stringified if sent as arrays (though frontend usually sends JSON)
            // Sequelize with DataTypes.JSON handles objects/arrays automatically if dialect supports it or via parsing.
            // For sqlite, it just stores string.
        };
        const game = await Game.create(gameData);
        res.status(201).json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGame = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        // Check permissions: owner or admin
        // Note: req.userId is number, game.userId might be number or null.
        if (game.userId !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Require Admin or Owner Role!' });
        }

        await game.destroy();
        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
