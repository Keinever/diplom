import axios from "axios";
import Cookies from 'js-cookie';

const apiUrl = "http://localhost:8000";

export function get_csrf() {
  return Cookies.get('csrftoken');
}

const api = axios.create({
  baseURL: import.meta.env.BACKEND_API_URL ? import.meta.env.BACKEND_API_URL : apiUrl,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

api.get('/api/csrf_token/')
    .catch(error => console.error('CSRF token fetch error:', error));

export default api;