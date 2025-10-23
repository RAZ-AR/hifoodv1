/**
 * API Configuration
 *
 * Production: Uses Render.com backend
 * Development: Uses local backend
 */

const API_BASE_URL = import.meta.env.PROD
  ? 'https://hifoodv1.onrender.com/api'
  : 'http://localhost:3000/api';

export { API_BASE_URL };
