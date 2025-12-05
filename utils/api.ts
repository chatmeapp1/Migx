export const API_BASE_URL = 'https://39a92673-735e-4054-b921-48dce70c2664-00-3jcu8mla3p9d4.pike.replit.dev';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    COUNTRIES: `${API_BASE_URL}/api/auth/countries`,
    GENDERS: `${API_BASE_URL}/api/auth/genders`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/api/user/profile`,
    UPDATE: `${API_BASE_URL}/api/user/update`,
  },
  ROOM: {
    LIST: `${API_BASE_URL}/api/room/list`,
    JOIN: `${API_BASE_URL}/api/room/join`,
    LEAVE: `${API_BASE_URL}/api/room/leave`,
  },
  CREDIT: {
    BALANCE: `${API_BASE_URL}/api/credit/balance`,
    TRANSFER: `${API_BASE_URL}/api/credit/transfer`,
    HISTORY: `${API_BASE_URL}/api/credit/history`,
  },
  MESSAGE: {
    SEND: `${API_BASE_URL}/api/message/send`,
    HISTORY: `${API_BASE_URL}/api/message/history`,
  },
};

export default API_BASE_URL;
