import axios from 'axios';
import { getToken, clearToken } from '@/utils/token';
import { env } from 'next-runtime-env';

const services = (service) => {
  return {
    'user': env('NEXT_PUBLIC_USER_SERVICE_API'),
    'accommodation': env('NEXT_PUBLIC_ACCOMMODATION_SERVICE_API'),
    'reservation': env('NEXT_PUBLIC_RESERVATION_SERVICE_API')
  }[service]
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
    const response = await httpService.post(`${services(service)}${route}`, body, headers);
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
    const response = await axios.post(`${services(service)}${route}`, body, {
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
    const response = await httpService.get(`${services(service)}${route}`, headers);
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
    const response = await httpService.patch(`${services(service)}${route}`, body, headers);
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
    const response = await httpService.put(`${services(service)}${route}`, body, headers);
    if (response.status >= 300) {
      throw new Error(`Status ${response.status}: ${response.statusText}`)
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
