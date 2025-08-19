import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

// For fetch API calls, get the base URL
export const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || '';

export default api; 