import axios from 'axios'

function resolveBaseURL() {
  const fromEnv = import.meta.env.VITE_API_URL
  if (typeof fromEnv === 'string' && fromEnv.trim() !== '') {
    return fromEnv.trim().replace(/\/$/, '')
  }
  if (import.meta.env.DEV) {
    return '/api'
  }
  return 'http://127.0.0.1:5000/api'
}

const api = axios.create({
  baseURL: resolveBaseURL(),
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cab_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    const status = error.response?.status
    if (typeof data === 'string' && /<\s*!doctype html/i.test(data)) {
      error.response.data = {
        message:
          status === 404
            ? 'API route not found. Use `npm run dev` from the project root (starts backend + frontend), or ensure the backend is on port 5000.'
            : 'Server returned a web page instead of JSON — is the CabConnect backend running?',
      }
    }
    return Promise.reject(error)
  },
)

export default api
