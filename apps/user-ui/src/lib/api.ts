import axios from 'axios';

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_SERVER_URI as string) || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(`Api Error: `, error.response.data || error.message || 'Something Went Wrong');
    return Promise.reject(error);
  },
);
