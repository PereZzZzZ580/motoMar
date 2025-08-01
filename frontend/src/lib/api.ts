 // src/lib/api.ts
import axios from 'axios';

// Configuración base de la API
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE_URL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`;
// Crear instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  // inhabilitado temporalmente el header de Content-Type
  //headers: {
  //  'Content-Type': 'application/json',
  //},
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Tipos de respuesta
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  ciudad?: string;
  departamento?: string;
  emailVerificado: boolean;
  calificacion: number;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  auth: {
    token: string;
    expiresIn: string;
    user: {
      userId: string;
      email: string;
      nombre: string;
      apellido: string;
      verificado: boolean;
    };
  };
}

export interface Moto {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  marca: string;
  modelo: string;
  año: number;
  cilindraje: number;
  kilometraje: number;
  color: string;
  ciudad: string;
  departamento: string;
  imagenPrincipal?: string;
  views: number;
  createdAt: string;
  imagenes?: { url: string; alt? : string }[];
  vendedor: {
    nombre: string;
    apellido: string;
    calificacion: number;
  };
}

// Funciones de autenticación
export const authAPI = {
  // Registro
  register: async (userData: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    ciudad?: string;
    departamento?: string;
    aceptaPolitica: boolean; 
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Obtener perfil actual
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // Logout
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Funciones de motos
export const motosAPI = {
  // Obtener todas las motos
  getMotos: async (filters?: {
    marca?: string;
    precioMin?: number;
    precioMax?: number;
    ciudad?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/motos?${params.toString()}`);
    return response.data;
  },

  // Obtener moto por ID
  getMotoById: async (id: string): Promise<Moto> => {
    const response = await api.get(`/motos/${id}`);
    return response.data.moto;
  },

  // Crear nueva moto
  createMoto: async (motoData: {
    titulo: string;
    descripcion: string;
    precio: number;
    marca: string;
    modelo: string;
    año: number;
    cilindraje: number;
    kilometraje: number;
    color: string;
    ciudad: string;
    departamento: string;
    combustible?: string;
    transmision?: string;
    estado?: string;
    condicion?: string;
  }) => {
    const response = await api.post('/motos', motoData);
    return response.data;
  },

  // Obtener mis motos
  getMyMotos: async () => {
    const response = await api.get('/motos/me/all');
    return response.data;  
  },

  // Obtener favoritos
  getFavoritos: async () => {
    const response = await api.get('/motos/me/favoritos');
    return response.data;
  },

  // Agregar/quitar favorito
  toggleFavorito: async (motoId: string) => {
    const response = await api.post(`/motos/${motoId}/favorito`);
    return response.data;
  },

   // Marcar moto como vendida
  marcarVendida: async (motoId: string) => {
    const response = await api.patch(`/motos/${motoId}/vender`);
    return response.data;
  },
  
  // Obtener estadísticas
  getEstadisticas: async () => {
    const response = await api.get('/motos/search/estadisticas');
    return response.data;
  },

  // Obtener marcas disponibles
  getMarcas: async () => {
    const response = await api.get('/motos/search/marcas');
    return response.data;
  },
};

// Funciones de utilidad
export const auth = {
  // Guardar token y usuario
  setAuth: (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Obtener token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Obtener usuario
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está logueado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Limpiar autenticación
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Función para obtener las motos del usuario
export const getMisMotos = async () => {
  const response = await api.get('/motos/me/all');

  // Si devuelve { motos: [...] }, retornamos el array
  if (Array.isArray(response.data.motos)) {
    return response.data.motos;
  }

  // Si ya es array directamente
  if (Array.isArray(response.data)) {
    return response.data;
  }

  // En cualquier otro caso, retornamos []
  console.warn('⚠️ Backend devolvió formato inesperado:', response.data);
  return [];
};



export default api;
