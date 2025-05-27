import axios from "axios";

// Detecta la URL base de la API desde .env o usa localhost:3000 por defecto
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Crea una instancia de axios
const api = axios.create({
  baseURL,
});

// Interceptor para agregar el token Authorization automáticamente si existe
api.interceptors.request.use(
  (config) => {
    // Busca el token en localStorage (ajusta si lo guardas en otro lado)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("user_token");
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
