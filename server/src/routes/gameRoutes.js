import express from 'express';
import { getAllGames, getMyGames, getGameById, createGame, deleteGame } from '../controllers/gameController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply middleware to protect all routes
router.use(verifyToken);

router.get('/', getAllGames);
router.get('/my-games', getMyGames);
router.get('/:id', getGameById);
router.post('/', createGame);
router.delete('/:id', deleteGame);

export default router;
