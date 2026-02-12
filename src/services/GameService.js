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
    categorias: normalizeJsonArray(game.categorias)
})

const authHeader = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const getAllGamesService = async () => {
    try {
        const { data } = await apiClient.get('/games?limit=1000')
        const games = Array.isArray(data) ? data : data.games || []
        return games.map(normalizeGame)
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'No se pudo obtener la lista de juegos')
    }
}

export const getMyGamesService = async (token) => {
    try {
        const { data } = await apiClient.get('/games/my-games?limit=1000', authHeader(token))
        const games = Array.isArray(data) ? data : data.games || []
        return games.map(normalizeGame)
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