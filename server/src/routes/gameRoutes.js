import express from 'express';
import { getAllGames, getMyGames, getGameById, createGame, deleteGame } from '../controllers/gameController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/my-games', verifyToken, getMyGames);
router.get('/:id', getGameById);
router.post('/', verifyToken, createGame);
router.delete('/:id', verifyToken, deleteGame);

export default router;
