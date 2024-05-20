import axios from 'axios';
import { getToken, clearToken } from './token';

const services = {
    'user': 'http://localhost:8001/user-service',
    'accomodation': 'http://localhost:8002/accommodation-service',
}

const headers = {headers: {'Content-Type': 'application/json'}}

const httpService = axios.create();

httpService.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const post = async (service, route, body) => {
  try {
    const response = await httpService.post(`${services[service]}${route}`, body, headers);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};