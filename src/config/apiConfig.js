/**
 * NE-Logi Mind AI - Central API & WebSocket Configuration
 * Automatically switches between Production Cloud Backend and Local Development
 */

const getHostUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? 'http://localhost:8000' : `http://${window.location.hostname}:8000`;
  }
  return 'http://localhost:8000';
};

export const BACKEND_URL = getHostUrl();

export const WS_URL = BACKEND_URL.replace(/^http/, 'ws');

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BACKEND_URL}${cleanEndpoint}`;
};

export const getWsUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${WS_URL}${cleanEndpoint}`;
};
