import { Game } from '../models/index.js';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'lfm2.5-thinking';

const normalizeList = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return value.split(',').map((item) => item.trim()).filter(Boolean);
        }
    }
    return [];
};

const serializeGame = (game) => ({
    id: game.id,
    nombre: game.nombre,
    descripcion: game.descripcion || '',
    compania: game.compania || '',
    categorias: normalizeList(game.categorias),
    plataformas: normalizeList(game.plataformas),
    precio: game.precio
});

const buildSystemPrompt = (games) => {
    const gamesJson = JSON.stringify(games, null, 2);

    return [
        'Eres un asistente especializado en videojuegos de esta plataforma.',
        'Debes responder SOLO sobre videojuegos que aparecen en la base de datos proporcionada.',
        'Si el usuario pregunta por juegos que no están en la base de datos, indícale que no tienes información de ese juego en la base actual.',
        'Si la pregunta no trata de videojuegos o no se puede responder con esta base de datos, rechaza amablemente y redirige a preguntar por los videojuegos disponibles.',
        'No inventes videojuegos, precios, plataformas ni características que no aparezcan en la base de datos.',
        'Debes responder EXCLUSIVAMENTE en formato JSON válido con este esquema:',
        '{"type":"games|reject","recommendedGameIds":[1,2],"message":"texto breve en español"}',
        'Solo puedes usar IDs existentes en la base de datos en recommendedGameIds.',
        'No incluyas markdown, texto adicional ni bloque de código.',
        'BASE DE DATOS ACTUAL DE VIDEOJUEGOS:',
        gamesJson
    ].join('\n');
};

const extractJsonObject = (text) => {
    if (!text) return null;
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    const jsonCandidate = text.slice(start, end + 1);
    try {
        return JSON.parse(jsonCandidate);
    } catch {
        return null;
    }
};

const buildFallbackReply = (games) => {
    const sample = games.slice(0, 3).map((game) => game.nombre).join(', ');
    return `Puedo ayudarte solo con videojuegos de la base de datos actual. Por ejemplo: ${sample}.`;
};

export const askAssistant = async ({ message, history = [] }) => {
    if (!message || !message.trim()) {
        throw new Error('Message is required');
    }

    const gameRows = await Game.findAll({ order: [['nombre', 'ASC']] });
    const games = gameRows.map(serializeGame);
    const gamesById = new Map(games.map((game) => [game.id, game]));

    const systemPrompt = buildSystemPrompt(games);
    const normalizedHistory = Array.isArray(history)
        ? history
            .filter((item) => item?.role === 'user' || item?.role === 'assistant')
            .slice(-8)
            .map((item) => ({ role: item.role, content: String(item.content || '') }))
        : [];

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            stream: false,
            messages: [
                { role: 'system', content: systemPrompt },
                ...normalizedHistory,
                { role: 'user', content: message.trim() }
            ]
        })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Assistant provider request failed');
    }

    const data = await response.json();
    const modelText = data?.message?.content || '';
    const parsed = extractJsonObject(modelText);

    if (!parsed || typeof parsed !== 'object') {
        return buildFallbackReply(games);
    }

    const ids = Array.isArray(parsed.recommendedGameIds)
        ? parsed.recommendedGameIds
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && gamesById.has(id))
        : [];

    if (parsed.type === 'reject') {
        return String(parsed.message || buildFallbackReply(games));
    }

    if (!ids.length) {
        return String(parsed.message || buildFallbackReply(games));
    }

    const selectedGames = ids.slice(0, 5).map((id) => gamesById.get(id));
    const recommendations = selectedGames
        .map((game) => `- ${game.nombre} (${game.compania || 'Compañía no disponible'}, ${game.precio}€)`)
        .join('\n');

    const intro = String(parsed.message || 'Te recomiendo estos videojuegos de la base de datos:');

    return `${intro}\n${recommendations}`;
};
