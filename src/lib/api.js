const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://api.kidport.tech' : 'http://localhost:4000');

export const API_BASE_URL = (() => {
  const trimmed = rawBaseUrl.replace(/\/+$/, '');
  if (trimmed.endsWith('/api/v1')) return trimmed;
  if (trimmed.endsWith('/api')) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
})();

const ACCESS_REFRESH_SKEW_MS = 2 * 60 * 1000;
const REFRESH_RETRY_DELAY_MS = 400;
const SESSION_KEEPALIVE_MS = 60 * 1000;
const AUTH_NO_REFRESH_PATHS = new Set([
  '/auth/login',
  '/auth/admin/login',
  '/auth/register',
  '/auth/admin/register',
  '/auth/refresh-token'
]);

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

const decodeAccessToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

export const isAccessTokenFresh = (token = getAccessToken(), skewMs = ACCESS_REFRESH_SKEW_MS) => {
  const payload = decodeAccessToken(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 - Date.now() > skewMs;
};

export const clearSession = () => {
  stopSessionKeepAlive();
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
  startSessionKeepAlive();
};

let refreshPromise = null;
let keepAliveTimer = null;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestRefresh = async (refreshToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(API_BASE_URL.includes('.ngrok-free.') ? { 'ngrok-skip-browser-warning': 'true' } : {})
    },
    body: JSON.stringify({ refreshToken })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) return false;
  saveSession(payload.data || {});
  return Boolean(getAccessToken());
};

const refreshSession = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const currentToken = getRefreshToken();
        if (!currentToken) return false;
        try {
          if (await requestRefresh(currentToken)) return true;
        } catch {
          // Retry once on a transient network/refresh failure.
        }
        if (attempt === 0) await wait(REFRESH_RETRY_DELAY_MS);
      }
      return false;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const startSessionKeepAlive = () => {
  if (keepAliveTimer || typeof window === 'undefined') return;
  keepAliveTimer = window.setInterval(() => {
    if (getRefreshToken() && !isAccessTokenFresh()) {
      void refreshSession();
    }
  }, SESSION_KEEPALIVE_MS);
};

const stopSessionKeepAlive = () => {
  if (!keepAliveTimer) return;
  window.clearInterval(keepAliveTimer);
  keepAliveTimer = null;
};

export const ensureSession = async () => {
  const user = localStorage.getItem('user');
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!user || (!accessToken && !refreshToken)) return false;
  if (isAccessTokenFresh()) {
    startSessionKeepAlive();
    return true;
  }
  if (!refreshToken) {
    if (accessToken && isAccessTokenFresh(accessToken, 0)) {
      startSessionKeepAlive();
      return true;
    }
    clearSession();
    return false;
  }

  const refreshed = await refreshSession();
  if (refreshed || isAccessTokenFresh(getAccessToken(), 0)) {
    startSessionKeepAlive();
    return true;
  }

  clearSession();
  return false;
};

if (typeof window !== 'undefined' && getRefreshToken()) {
  startSessionKeepAlive();
}

export const apiRequest = async (path, options = {}, retryOnUnauthorized = true) => {
  const requestId =
    options.requestId ||
    (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const clientSentAtIso = new Date().toISOString();
  const canRefresh = retryOnUnauthorized && !AUTH_NO_REFRESH_PATHS.has(path);

  if (canRefresh && getRefreshToken() && !isAccessTokenFresh()) {
    await refreshSession();
  }

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
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401 && canRefresh) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return apiRequest(path, { ...options, requestId }, false);
    }
    if (!isAccessTokenFresh(getAccessToken(), 0)) {
      clearSession();
    }
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
