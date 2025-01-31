// authUtils.js
import api from './axios';

export const saveAuthData = (data) => {
  try {
    // Save auth token
    localStorage.setItem('authToken', data.token);
    // Save user data if needed
    localStorage.setItem('userData', JSON.stringify(data.user));
    // Set the token in axios default headers for subsequent requests
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return true;
  } catch (error) {
    console.error('Error saving auth data:', error);
    return false;
  }
};

export const loadAuthData = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error loading auth data:', error);
    return false;
  }
};

export const clearAuthData = () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    delete api.defaults.headers.common['Authorization'];
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};