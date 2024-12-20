import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const handleAxiosError = (error) => {
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

console.log('API URL is:', __VITE_BACKEND_URI__);

const axiosInstance = axios.create({
  baseURL: __VITE_BACKEND_URI__,
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
  const response = await axiosInstance.post('/auth/signup', {
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

export const sendMessage = async (message: string, receiver: string) => {
  const response = await axiosInstance.post('/send_message', {
    message,
    receiver,
  });
  return response;
};

export const searchUsers = async (query: string) => {
  const response = await axiosInstance.get('search_users', {
    params: { query: query },
  });
  return response;
};

export const logout = async () => {
  const response = await axiosInstance.get('/auth/logout');
  return response;
};

export const addFriend = async (friend: string) => {
  const response = await axiosInstance.post('/add_friend', null, {
    params: { friend_username: friend },
  });
  return response.data;
};
