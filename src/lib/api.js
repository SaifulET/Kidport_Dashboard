const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://kidport.vercel.app' : 'http://localhost:4000');

export const API_BASE_URL = (() => {
  const trimmed = rawBaseUrl.replace(/\/+$/, '');
  if (trimmed.endsWith('/api/v1')) return trimmed;
  if (trimmed.endsWith('/api')) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
})();

export const getAccessToken = () => localStorage.getItem('accessToken');

export const getSessionUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD';

export const formatDateOnly = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

export const clearSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const saveSession = ({ user, accessToken, refreshToken }) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('role', user?.userType || 'admin');
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

export const apiRequest = async (path, options = {}) => {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const init = { ...options, headers };
  const isFormData = options.body instanceof FormData;
  if (options.body && typeof options.body === 'object' && !isFormData) {
    headers.set('Content-Type', 'application/json');
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    const message = payload.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
};

export const apiGet = (path) => apiRequest(path);
export const apiPost = (path, body) => apiRequest(path, { method: 'POST', body });
export const apiPatch = (path, body) => apiRequest(path, { method: 'PATCH', body });
export const apiDelete = (path) => apiRequest(path, { method: 'DELETE' });
