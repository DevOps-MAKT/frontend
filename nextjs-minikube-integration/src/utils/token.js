export const setToken = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.jwt);
    localStorage.setItem('role', data.role);
    localStorage.setItem('email', data.email);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('role');
  }
  return null;
};

export const getEmail = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('email');
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  }
};