import apiClient from './apiClient'

export const askAiAssistantService = async (message, history = []) => {
  try {
    const { data } = await apiClient.post('/assistant/chat', { message, history })
    return data?.answer || 'No se pudo obtener respuesta del asistente.'
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'No se pudo contactar con el asistente IA')
  }
}
