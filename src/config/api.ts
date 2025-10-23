/**
 * API Configuration
 *
 * Production: Uses Render.com backend
 * Development: Uses local backend
 */

const API_BASE_URL = import.meta.env.PROD
  ? 'https://hi-food-backend.onrender.com/api'
  : 'http://localhost:3000/api';

export { API_BASE_URL };
