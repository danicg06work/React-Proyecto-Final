import { askAssistant } from '../services/aiAssistantService.js';

export const chatAssistant = async (req, res) => {
    try {
        const { message, history } = req.body || {};
        const answer = await askAssistant({ message, history });

        res.status(200).json({ answer });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'No se pudo completar la consulta al asistente'
        });
    }
};
