const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://api.kidport.tech' : 'http://localhost:4000');

export const API_BASE_URL = (() => {
  const trimmed = rawBaseUrl.replace(/\/+$/, '');
  if (trimmed.endsWith('/api/v1')) return trimmed;
  if (trimmed.endsWith('/api')) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
})();

const addProxyBypassHeaders = (headers) => {
  if (API_BASE_URL.includes('.ngrok-free.')) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }
};

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

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
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user?.userType || 'admin');
  }
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

let refreshPromise = null;

const refreshSession = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    const startedAt = performance.now();
        refreshPromise = fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_BASE_URL.includes('.ngrok-free.') ? { 'ngrok-skip-browser-warning': 'true' } : {})
      },
      body: JSON.stringify({ refreshToken })
    })
      .then(async (response) => {
        const responseAt = performance.now();
        const payload = await response.json().catch(() => ({}));
                if (!response.ok || payload.success === false) return false;
        saveSession(payload.data || {});
        return true;
      })
      .finally(() => {
                refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiRequest = async (path, options = {}, retryOnUnauthorized = true) => {
  const startedAt = performance.now();
  const requestId =
    options.requestId ||
    (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const clientSentAtIso = new Date().toISOString();
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  addProxyBypassHeaders(headers);
  headers.set('x-request-id', requestId);
  headers.set('x-client-sent-at', clientSentAtIso);

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const { requestId: _requestId, ...fetchOptions } = options;
  const init = { credentials: 'include', cache: 'no-store', ...fetchOptions, headers };
  const isFormData = options.body instanceof FormData;
  if (options.body && typeof options.body === 'object' && !isFormData) {
    headers.set('Content-Type', 'application/json');
    init.body = JSON.stringify(options.body);
  }

      const response = await fetch(`${API_BASE_URL}${path}`, init);
  const responseAt = performance.now();
  const clientReceivedAtIso = new Date().toISOString();
    const payload = await response.json().catch(() => ({}));
  const parsedAt = performance.now();

  
  if (response.status === 401 && retryOnUnauthorized) {
    const refreshStartedAt = performance.now();
    const refreshed = await refreshSession();
        if (refreshed) {
      const retried = await apiRequest(path, { ...options, requestId }, false);
            return retried;
    }
    clearSession();
  }

  if (!response.ok || payload.success === false) {
    const message = payload.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

    return payload;
};

export const apiGet = (path) => apiRequest(path);
export const apiPost = (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body });
export const apiPatch = (path, body) => apiRequest(path, { method: 'PATCH', body });
export const apiDelete = (path) => apiRequest(path, { method: 'DELETE' });
