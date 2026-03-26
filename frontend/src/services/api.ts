import axios from 'axios';

const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseURL = `${base.replace(/\/$/, '').replace(/\/api\/v1$/, '')}/api/v1/`;

const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
