import axios from 'axios'

/**
 * All requests send credentials for httpOnly JWT cookie set by the API.
 * In development, Vite proxies /api to the Express server.
 */
const baseURL = import.meta.env.VITE_API_URL?.trim() || '/api'

export const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err.response?.data?.error ||
      err.response?.data?.errors?.[0]?.msg ||
      err.message ||
      'Request failed'
    return Promise.reject(new Error(msg))
  }
)
