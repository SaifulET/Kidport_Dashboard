import { io } from 'socket.io-client';
import { API_BASE_URL, getAccessToken } from './api';

const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/v1$/, '').replace(/\/api$/, '');

export const createSocket = () =>
  io(SOCKET_BASE_URL, {
    auth: { token: getAccessToken() },
    transports: ['websocket', 'polling']
  });
