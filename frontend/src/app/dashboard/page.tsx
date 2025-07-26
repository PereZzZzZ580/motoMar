 // src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MotoCard from '@/components/MotoCard';
import toast from 'react-hot-toast';
//import { Response } from 'express';
import api,{ authAPI } from '@/lib/api';

interface Moto {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  marca: string;
  modelo: string;
  año: number;
  cilindraje: number;
  kilometraje: number;
  ciudad: string;
  departamento: string;
  estado: string;
  imagenes: { url: string }[];
  vendedor: {
    nombre: string;
    apellido: string;
    calificacion_promedio: number;
  };
  
  _count?: {
    favoritos: number;
  };
  es_favorito?: boolean;
}

interface FilterOptions {
  marca?: string;
  precioMin?: number;
  precioMax?: number;
  ciudad?: string;
  departamento?: string;
  ordenPor?: string;
}

export default function DashboardPage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total_motos: 0,
    total_usuarios: 0,
    total_transacciones: 0,
    marcas_populares: []
  });

   const handleLogout = async () => {
    try {
      await authAPI.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    fetchMotos();
    fetchStats();
  }, [filters]);

  const fetchMotos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.marca) params.append('marca', filters.marca);
      if (filters.precioMin) params.append('precioMin', filters.precioMin.toString());
      if (filters.precioMax) params.append('precioMax', filters.precioMax.toString());
      if (filters.ciudad) params.append('ciudad', filters.ciudad);
      if (filters.departamento) params.append('departamento', filters.departamento);
      if (filters.ordenPor) params.append('ordenPor', filters.ordenPor);
      if (searchTerm) params.append('busqueda', searchTerm);

      const response = await api.get(`/motos?${params.toString()}`);
      setMotos(response.data.motos);
    } catch (error) {
      console.error('Error al cargar motos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/motos/search/estadisticas');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // se elimino la funcion handlesearch y se reemplazo por un useEffect que se ejecuta automáticamente

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMotos();
    }, 500); // Búsqueda automática después de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]); // Se ejecuta cuando cambia searchTerm o filters

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const toggleFavorito = async (motoId: string) => {
  try {
    const Response = await api.post(`/motos/${motoId}/favorito`);
    
    // Actualizar el estado local inmediatamente
    setMotos(prev => prev.map(moto => 
      moto.id === motoId 
        ? { 
            ...moto, 
            es_favorito: !moto.es_favorito,
            _count: {
              ...moto._count,
              favoritos: !moto.es_favorito 
                ? (moto._count?.favoritos || 0) + 1 
                : (moto._count?.favoritos || 0) - 1
            }
          }
        : moto
    ));

    const motoActual = motos.find(m => m.id === motoId);
    toast.success(!motoActual?.es_favorito ? '¡Agregado a favoritos!' : 'eliminado de favoritos');
  } catch (error) {
    console.error('Error al actualizar favorito:', error);
    toast.error('Error al actualizar favoritos');
  }
};


  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header con estadísticas */}
      <div className="mb-8">
         <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Marketplace de Motos
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Cerrar Sesión
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Motos Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_motos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_usuarios}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Transacciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_transacciones}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Crecimiento</p>
                <p className="text-2xl font-bold text-green-600">+42%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por marca, modelo, ciudad..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Filtros
          </button>
        </form>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <select
                  value={filters.marca || ''}
                  onChange={(e) => handleFilterChange({ marca: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Todas las marcas</option>
                  <option value="Honda">Honda</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Kawasaki">Kawasaki</option>
                  <option value="Bajaj">Bajaj</option>
                  <option value="KTM">KTM</option>
                  <option value="AKT">AKT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Mínimo
                </label>
                <input
                  type="number"
                  value={filters.precioMin || ''}
                  onChange={(e) => handleFilterChange({ precioMin: parseInt(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Máximo
                </label>
                <input
                  type="number"
                  value={filters.precioMax || ''}
                  onChange={(e) => handleFilterChange({ precioMax: parseInt(e.target.value) })}
                  placeholder="50000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={filters.ciudad || ''}
                  onChange={(e) => handleFilterChange({ ciudad: e.target.value })}
                  placeholder="Ej: Armenia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  value={filters.departamento || ''}
                  onChange={(e) => handleFilterChange({ departamento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Todos los departamentos</option>
                  <option value="Antioquia">Antioquia</option>
                  <option value="Bogotá D.C.">Bogotá D.C.</option>
                  <option value="Valle del Cauca">Valle del Cauca</option>
                  <option value="Quindío">Quindío</option>
                  <option value="Cundinamarca">Cundinamarca</option>
                  <option value="Atlántico">Atlántico</option>
                  <option value="Santander">Santander</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={filters.ordenPor || ''}
                  onChange={(e) => handleFilterChange({ ordenPor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Más recientes</option>
                  <option value="precio_asc">Precio: Menor a Mayor</option>
                  <option value="precio_desc">Precio: Mayor a Menor</option>
                  <option value="kilometraje_asc">Menor kilometraje</option>
                  <option value="año_desc">Año más reciente</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              {motos.length} motos encontradas
            </div>
          </div>
        )}
      </div>

      {/* Grid de motos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando motos...</p>
        </div>
      ) : motos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {motos.map((moto) => (
            <MotoCard
              key={moto.id}
              moto={moto}
              onFavoriteToggle={() => toggleFavorito(moto.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay motos disponibles</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.keys(filters).length > 0
              ? 'Intenta con otros filtros o términos de búsqueda'
              : 'Sé el primero en publicar una moto'}
          </p>
        </div>
      )}
    </div>
  );
}
