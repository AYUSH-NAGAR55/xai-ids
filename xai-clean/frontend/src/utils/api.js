// utils/api.js
import axios from 'axios'

// Base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://xai-ids-production.up.railway.app/api",
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
})

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('xai_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 SHOW REAL ERROR (important for debugging)
    console.error("API ERROR:", error.response?.data || error.message)

    if (error.response?.status === 401) {
      localStorage.removeItem('xai_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)


// ---------------- AUTH ----------------
export const login = (data) => api.post('/auth/login', data)
export const signup = (data) => api.post('/auth/signup', data)
export const getMe = () => api.get('/auth/me')


// ---------------- UPLOAD ----------------
export const uploadCSV = (formData) =>
  api.post('/upload-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const getUploads = () => api.get('/uploads')


// ---------------- TRAIN ----------------
export const trainModel = (body) => api.post('/train-model', body)
export const getTrainingLogs = () => api.get('/training-logs')


// ---------------- PREDICT ----------------
export const predict = (body) => api.post('/predict', body)
export const predictBatch = (body) => api.post('/predict-batch', body)
export const getPredictions = () => api.get('/predictions')
export const getDashboardStats = () => api.get('/dashboard-stats')


// ---------------- EXPLAIN ----------------
export const getLimeExplanation = (body) =>
  api.post('/get-explanation', body)

export const getShapGlobal = (model, samples = 100) =>
  api.get(`/shap-global?model=${model}&samples=${samples}`)

export const getPlotUrl = (filename) =>
 `${import.meta.env.VITE_API_URL || "https://xai-ids-production.up.railway.app/api"}/plots/${filename}`


// Export instance
export default api
