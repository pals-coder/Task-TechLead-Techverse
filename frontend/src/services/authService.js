import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const getToken = () => localStorage.getItem('authToken');
