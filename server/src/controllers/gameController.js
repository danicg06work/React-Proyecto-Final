import { Comment, Game, Report, User, Vote } from '../models/index.js';
import { Op } from 'sequelize';

const addVoteStats = async (games) => {
    if (!games.length) return [];

    const gameIds = games.map((game) => game.id);
    const votes = await Vote.findAll({
        where: { gameId: { [Op.in]: gameIds } },
        attributes: ['gameId', 'type']
    });

    const statsMap = new Map();
    gameIds.forEach((gameId) => {
        statsMap.set(gameId, { likesCount: 0, dislikesCount: 0 });
    });

    votes.forEach((vote) => {
        const stats = statsMap.get(vote.gameId);
        if (!stats) return;
        if (vote.type === 'like') stats.likesCount += 1;
        if (vote.type === 'dislike') stats.dislikesCount += 1;
    });

    return games.map((game) => {
        const stats = statsMap.get(game.id) || { likesCount: 0, dislikesCount: 0 };
        const plainGame = game.toJSON();
        return {
            ...plainGame,
            likesCount: stats.likesCount,
            dislikesCount: stats.dislikesCount,
            popularity: stats.likesCount - stats.dislikesCount
        };
    });
};

const buildPaginationResponse = ({ totalItems, page, limit, games }) => ({
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    pageSize: limit,
    games
});

export const getAllGames = async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const sortBy = req.query.sortBy === 'popularity' ? 'popularity' : 'createdAt';
        const offset = (page - 1) * limit;

        if (sortBy === 'popularity') {
            const allGames = await Game.findAll();
            const gamesWithStats = await addVoteStats(allGames);
            gamesWithStats.sort((a, b) => {
                if (b.popularity !== a.popularity) return b.popularity - a.popularity;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            const pagedGames = gamesWithStats.slice(offset, offset + limit);
            return res.status(200).json(buildPaginationResponse({
                totalItems: gamesWithStats.length,
                page,
                limit,
                games: pagedGames
            }));
        }

        const { count, rows } = await Game.findAndCountAll({
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        const gamesWithStats = await addVoteStats(rows);

        res.status(200).json(buildPaginationResponse({
            totalItems: count,
            page,
            limit,
            games: gamesWithStats
        }));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyGames = async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const offset = (page - 1) * limit;

        const { count, rows } = await Game.findAndCountAll({
            where: { userId: req.userId },
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        const gamesWithStats = await addVoteStats(rows);

        res.status(200).json(buildPaginationResponse({
            totalItems: count,
            page,
            limit,
            games: gamesWithStats
        }));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        const [likesCount, dislikesCount] = await Promise.all([
            Vote.count({ where: { gameId: game.id, type: 'like' } }),
            Vote.count({ where: { gameId: game.id, type: 'dislike' } })
        ]);

        res.status(200).json({
            ...game.toJSON(),
            likesCount,
            dislikesCount,
            popularity: likesCount - dislikesCount
        });
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
        res.status(201).json({ ...game.toJSON(), likesCount: 0, dislikesCount: 0, popularity: 0 });
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

export const voteGame = async (req, res) => {
    try {
        const { type } = req.body;
        const gameId = parseInt(req.params.id, 10);

        if (!['like', 'dislike'].includes(type)) {
            return res.status(400).json({ message: 'Vote type must be like or dislike' });
        }

        const game = await Game.findByPk(gameId);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        const existingVote = await Vote.findOne({ where: { userId: req.userId, gameId } });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted for this game' });
        }

        await Vote.create({ userId: req.userId, gameId, type });

        const [likesCount, dislikesCount] = await Promise.all([
            Vote.count({ where: { gameId, type: 'like' } }),
            Vote.count({ where: { gameId, type: 'dislike' } })
        ]);

        res.status(201).json({ likesCount, dislikesCount, popularity: likesCount - dislikesCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGameComments = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id, 10);
        const game = await Game.findByPk(gameId);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        const comments = await Comment.findAll({
            where: { gameId },
            include: [{ model: User, as: 'user', attributes: ['id', 'username', 'role'] }],
            order: [['createdAt', 'DESC']]
        });

        const parentIds = comments.map((comment) => comment.id);
        const replies = parentIds.length
            ? await Comment.findAll({
                where: { parentId: { [Op.in]: parentIds } },
                attributes: ['parentId']
            })
            : [];

        const repliesCountMap = new Map();
        replies.forEach((reply) => {
            const current = repliesCountMap.get(reply.parentId) || 0;
            repliesCountMap.set(reply.parentId, current + 1);
        });

        const commentsWithMeta = comments.map((comment) => ({
            ...comment.toJSON(),
            repliesCount: repliesCountMap.get(comment.id) || 0
        }));

        res.status(200).json(commentsWithMeta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createComment = async (req, res) => {
    try {
        const { content, parentId = null } = req.body;
        const gameId = parseInt(req.params.id, 10);

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const game = await Game.findByPk(gameId);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        if (parentId) {
            const parentComment = await Comment.findByPk(parentId);
            if (!parentComment || parentComment.gameId !== gameId) {
                return res.status(400).json({ message: 'Invalid parent comment' });
            }
        }

        const comment = await Comment.create({
            content: content.trim(),
            parentId,
            gameId,
            userId: req.userId
        });

        const createdComment = await Comment.findByPk(comment.id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'username', 'role'] }]
        });

        res.status(201).json({ ...createdComment.toJSON(), repliesCount: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        const comment = await Comment.findByPk(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (req.userRole !== 'admin' && comment.userId !== req.userId) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }

        if (req.userRole !== 'admin') {
            const repliesCount = await Comment.count({ where: { parentId: comment.id } });
            if (repliesCount > 0) {
                return res.status(400).json({
                    message: 'You cannot delete this comment because it has replies'
                });
            }
        }

        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const reportGame = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id, 10);
        const { reason = '' } = req.body || {};

        const game = await Game.findByPk(gameId);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        const existingReport = await Report.findOne({ where: { gameId, userId: req.userId } });
        if (existingReport) {
            return res.status(400).json({ message: 'You have already reported this game' });
        }

        await Report.create({ gameId, userId: req.userId, reason: reason?.trim() || null });
        res.status(201).json({ message: 'Game reported successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReportedGames = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                {
                    model: Game,
                    as: 'game'
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const uniqueByGame = new Map();

        reports.forEach((report) => {
            const gameId = report.gameId;
            if (!uniqueByGame.has(gameId)) {
                uniqueByGame.set(gameId, {
                    id: report.id,
                    gameId,
                    game: report.game,
                    reportCount: 1,
                    lastReason: report.reason || null,
                    lastReportedBy: report.user?.username || 'Usuario'
                });
                return;
            }

            const current = uniqueByGame.get(gameId);
            current.reportCount += 1;
            uniqueByGame.set(gameId, current);
        });

        res.status(200).json(Array.from(uniqueByGame.values()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReportedGame = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id, 10);
        const game = await Game.findByPk(gameId);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        await game.destroy();
        res.status(200).json({ message: 'Reported game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
