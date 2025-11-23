import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const method = (config.method || "get").toLowerCase();

  if (!config.headers["Content-Type"] && method !== "get") {
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
  }

  config.params = {
    ...config.params || {},
    client: "web",
  };


  return config;
},
(error) => {
  return Promise.reject(error);
})

export default axiosInstance;