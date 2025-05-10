"use client";
import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility to handle errors
const handleError = (error: AxiosError) => {
  if (error.response) {
    throw new Error('An error occurred');
  } else if (error.request) {
    throw new Error('No response received from the server');
  } else {
    throw new Error(error.message);
  }
};

// Add an interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Utility to set authorization header
const setAuthHeader = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Define request/response types
interface SignupData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  try {
    const response = await api.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const removeAccessToken = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

export const getAccessToken = () => {
  return localStorage.getItem('token');
};

export const login = async (data: LoginData) => {
  try {
    const response = await api.post('/auth/login', data);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setAuthHeader(access_token);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const changePassword = async (id: number, data: any) => {
  const response = await api.post(`/auth/change-password/${id}`, data);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getMoviesByCategory = async (categoryId: number) => {
  const response = await api.get(`/movies/category/${categoryId}`);
  return response.data;
};

export const getMovies = async () => {
  const response = await api.get('/movies');
  return response.data;
};

export const updateUserProfile = async (id: number, data: any) => {
  try {
    const response = await api.post(`/auth/oneuser/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export async function getMovieRating(movieId: number) {
  const response = await api.get(`/movies/${movieId}/rating`);
  const data = await response.data;
  return data;
}

export const rateMovie = async (movieId: number, rating: number, userId: number) => {
  try {
    const response = await api.patch(`/movies/rate`, { movieId, rating, userId });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getRecommendedMovies = async (userId: number) => {
  try {
    const response = await api.get(`/movies/recommend/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getProfilelow = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getProfile = async (id: number) => {
  try {
    const response = await api.post(`/auth/oneuser/${id}`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// Function to upload profile picture
export const uploadProfilePicture = async (userId: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/auth/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getLoggedInUsers = async () => {
  const response = await api.get('/auth/loggedinusers', {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
};

export const getUsersInDb = async () => {
  const response = await api.get('/auth');
  return response.data;
};

// Define message request/response types
interface MessageData {
  senderId: number;
  receiverId?: number;
  content: string;
  groupId?: number;
  isGroupMessage?: boolean;  // Add the isGroupMessage property
}


export const postMessage = async (data: MessageData) => {
  try {
    const response = await api.post('/messages', data);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getMessages = async (senderId: number, receiverId: number) => {
  try {
    const response = await api.get('/messages', {
      params: {
        senderId,
        receiverId,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const createGroup = async (groupData: { groupName: string; memberIds: number[] }) => {
  try {
    const response = await api.post('/auth/create-group', groupData);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};

export const getChatGroups = async () => {
  try {
    const response = await api.get('/auth/chat-groupsreal');
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
  }
};





