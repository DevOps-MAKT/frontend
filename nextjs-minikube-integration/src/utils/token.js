export const setToken = (token) => {
    if (process.browser) {
      localStorage.setItem('token', token);
    }
  };
  
  export const getToken = () => {
    if (process.browser) {
      return localStorage.getItem('token');
    }
    return null;
  };
  
  export const clearToken = () => {
    if (process.browser) {
      localStorage.removeItem('token');
    }
  };