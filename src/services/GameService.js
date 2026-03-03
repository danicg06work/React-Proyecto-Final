import apiClient from './apiClient'

const normalizeJsonArray = (value) => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
        }
    }
    return []
}

const normalizeGame = (game) => ({
    ...game,
    plataformas: normalizeJsonArray(game.plataformas),
    categorias: normalizeJsonArray(game.categorias),
    likesCount: Number(game.likesCount || 0),
    dislikesCount: Number(game.dislikesCount || 0),
    popularity: Number(game.popularity || 0)
})

const authHeader = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
})

const normalizePaginatedResponse = (data) => {
    const games = Array.isArray(data) ? data : data.games || []
    return {
        games: games.map(normalizeGame),
        totalItems: Number(data?.totalItems || games.length || 0),
        totalPages: Number(data?.totalPages || 1),
        currentPage: Number(data?.currentPage || 1),
        pageSize: Number(data?.pageSize || games.length || 0)
    }
}

export const getAllGamesService = async ({ page = 1, limit = 10, sortBy = 'createdAt' } = {}) => {
    try {
        const { data } = await apiClient.get(`/games?page=${page}&limit=${limit}&sortBy=${sortBy}`)
        return normalizePaginatedResponse(data)
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo obtener la lista de juegos')
    }
}

export const getMyGamesService = async (token, { page = 1, limit = 10 } = {}) => {
    try {
        const { data } = await apiClient.get(`/games/my-games?page=${page}&limit=${limit}`, authHeader(token))
        return normalizePaginatedResponse(data)
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo obtener tus juegos')
    }
}

export const getGameByIdService = async (id) => {
    try {
        const { data } = await apiClient.get(`/games/${id}`)
        return normalizeGame(data)
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo obtener el videojuego')
    }
}

export const createGameService = async (token, payload) => {
    try {
        const body = {
            ...payload,
            plataformas: normalizeJsonArray(payload.plataformas),
            categorias: normalizeJsonArray(payload.categorias)
        }

        const { data } = await apiClient.post('/games', body, authHeader(token))
        return normalizeGame(data)
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo crear el videojuego')
    }
}

export const deleteGameService = async (token, id) => {
    try {
        await apiClient.delete(`/games/${id}`, authHeader(token))
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo borrar el videojuego')
    }
}

export const voteGameService = async (token, gameId, type) => {
    try {
        const { data } = await apiClient.post(`/games/${gameId}/vote`, { type }, authHeader(token))
        return data
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo registrar tu voto')
    }
}

export const getGameCommentsService = async (gameId) => {
    try {
        const { data } = await apiClient.get(`/games/${gameId}/comments`)
        return Array.isArray(data) ? data : []
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudieron obtener los comentarios')
    }
}

export const createGameCommentService = async (token, gameId, content, parentId = null) => {
    try {
        const { data } = await apiClient.post(`/games/${gameId}/comments`, { content, parentId }, authHeader(token))
        return data
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo crear el comentario')
    }
}

export const deleteGameCommentService = async (token, commentId) => {
    try {
        await apiClient.delete(`/games/comments/${commentId}`, authHeader(token))
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo borrar el comentario')
    }
}

export const reportGameService = async (token, gameId, reason = '') => {
    try {
        const { data } = await apiClient.post(`/games/${gameId}/report`, { reason }, authHeader(token))
        return data
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo reportar el videojuego')
    }
}

export const getReportedGamesService = async (token) => {
    try {
        const { data } = await apiClient.get('/games/reported', authHeader(token))
        return Array.isArray(data) ? data : []
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo obtener el listado de reportes')
    }
}

export const deleteReportedGameService = async (token, gameId) => {
    try {
        await apiClient.delete(`/games/reported/${gameId}`, authHeader(token))
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo borrar el videojuego reportado')
    }
}