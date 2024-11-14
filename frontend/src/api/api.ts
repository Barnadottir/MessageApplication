import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const handleAxiosError = (error) => {
  console.log('error -> ', error);
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return new Error(`${data.detail || 'Invalid input'}`);
      case 401:
        Cookies.remove('Token');
        return new Error('Invalid credentials');
      case 404:
        return new Error('Resource not found');
      case 500:
        return new Error('Server error');
      default:
        return new Error(`${data.detail || 'Something went wrong'}`);
    }
  } else if (error.request) {
    return new Error('Network error', error.request, 'hahah');
  }
  return new Error(error.message || 'Unknown error');
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleAxiosError(error)),
);

export const signup = async (
  username: string,
  email: string,
  full_name: string,
  password: string,
) => {
  const response = await axiosInstance.post('auth/signup', {
    username,
    email,
    full_name,
    password,
  });
  return response;
};

export const getWatchlist = async () => {
  const response = await axiosInstance.get('watchlist');
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await axiosInstance.post(
    'auth/login',
    new URLSearchParams({ username, password }),
  );
  return response;
};

export const getChatMessages = async (receiver: string) => {
  const response = await axiosInstance.post('/chat_messages', {
    receiver,
  });
  return response;
};

export const getFriendsList = async () => {
  const response = await axiosInstance.get('/friends');
  return response;
};
