import express from 'express';
import {
	createComment,
	createGame,
	deleteComment,
	deleteGame,
	deleteReportedGame,
	getAllGames,
	getGameById,
	getGameComments,
	getMyGames,
	getReportedGames,
	reportGame,
	voteGame
} from '../controllers/gameController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/reported', verifyToken, isAdmin, getReportedGames);
router.get('/my-games', verifyToken, getMyGames);
router.get('/:id', getGameById);
router.get('/:id/comments', getGameComments);
router.post('/', verifyToken, createGame);
router.post('/:id/vote', verifyToken, voteGame);
router.post('/:id/comments', verifyToken, createComment);
router.post('/:id/report', verifyToken, reportGame);
router.delete('/comments/:commentId', verifyToken, deleteComment);
router.delete('/reported/:id', verifyToken, isAdmin, deleteReportedGame);
router.delete('/:id', verifyToken, deleteGame);

export default router;
