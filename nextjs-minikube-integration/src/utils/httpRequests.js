import axios from 'axios';
import { getToken, clearToken } from './token';

const services = {
    'user': 'http://localhost:8001/user-service',
    'accommodation': 'http://localhost:8002/accommodation-service',
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
    if (response.status >= 300) {
      throw new Error(`Status ${response.status}: ${response.statusText}`)
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const postImage = async (service, route, body) => {
  try {
    const token = getToken();
    const response = await axios.post(`${services[service]}${route}`, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
    if (response.status >= 300) {
      throw new Error(`Status ${response.status}: ${response.statusText}`)
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const get = async (service, route) => {
  try {
    const response = await httpService.get(`${services[service]}${route}`, headers);
    if (response.status !== 200) {
      throw new Error(`Status ${response.status}: ${response.statusText}`)
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const patch = async (service, route, body) => {
  try {
    const response = await httpService.patch(`${services[service]}${route}`, body, headers);
    if (response.status >= 300) {
      throw new Error(`Status ${response.status}: ${response.statusText}`)
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const put = async (service, route, body) => {
  try {
    const response = await httpService.put(`${services[service]}${route}`, body, headers);
    if (response.status >= 300) {
      throw new Error(`Status ${response.status}: ${response.statusText}`)
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
