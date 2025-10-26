/**
 * API Configuration
 *
 * Production: Uses Render.com backend
 * Development: Uses local backend (only if running locally)
 *
 * If VITE_API_URL is set, it will override everything
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || // Переменная окружения имеет высший приоритет
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://hifoodv1.onrender.com/api' // Если не localhost, используем Render
    : import.meta.env.PROD
      ? 'https://hifoodv1.onrender.com/api' // Production build
      : 'http://localhost:3000/api'); // Local development

console.log('🔧 API_BASE_URL:', API_BASE_URL);

export { API_BASE_URL };
