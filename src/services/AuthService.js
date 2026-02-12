import apiClient from './apiClient'

export const loginService = async ({ username, password }) => {
  try {
    const { data } = await apiClient.post('/auth/login', { username, password })
    return data
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'No se pudo iniciar sesión')
  }
}

export const registerService = async ({ username, password }) => {
  try {
    const { data } = await apiClient.post('/auth/register', { username, password })
    return data
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'No se pudo registrar el usuario')
  }
}
