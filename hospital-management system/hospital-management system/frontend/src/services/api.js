// import axios from 'axios';

// const api = axios.create({
//   baseURL: '/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// const token = localStorage.getItem('token');
// if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/api",
  withCredentials: true
});

export default api;