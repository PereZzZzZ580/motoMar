"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MotoCard from '@/components/MotoCard';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
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

export default function HomePage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [stats, setStats] = useState({
    total_motos: 0,
    total_usuarios: 0,
    total_transacciones: 0,
    marcas_populares: [] as string[],
  });

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

  useEffect(() => {
    fetchMotos();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(fetchMotos, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSelectedMarca('');
  };

  const handleMarcaClick = (marca: string) => {
    setSelectedMarca(marca);
    handleFilterChange({ marca });
  };


  const toggleFavorito = async (motoId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión para agregar a favoritos');
      router.push('/auth/login');
      return;
    }
    try {
      await api.post(`/motos/${motoId}/favorito`);
      setMotos((prev) =>
        prev.map((moto) =>
          moto.id === motoId
            ? {
                ...moto,
                es_favorito: !moto.es_favorito,
                _count: {
                  ...moto._count,
                  favoritos: !moto.es_favorito
                    ? (moto._count?.favoritos || 0) + 1
                    : (moto._count?.favoritos || 0) - 1,
                },
              }
            : moto
        )
      );
      const motoActual = motos.find((m) => m.id === motoId);
      toast.success(
        !motoActual?.es_favorito ? '¡Agregado a favoritos!' : 'Eliminado de favoritos'
      );
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      toast.error('Error al actualizar favoritos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Encuentra la <span className="text-blue-700">Moto Perfecta</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            El marketplace más seguro de Colombia para comprar y vender motocicletas.
            Con verificación automática, pagos seguros y trámites simplificados.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar motos por marca, modelo o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-gray-500 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                🔍 Buscar
              </button>
            </div>
          </form>
          <div className="flex justify-center space-x-4 mb-12">
            {['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Bajaj'].map((marca) => (
              <button
                key={marca}
                onClick={() => handleMarcaClick(marca)}
                className={`px-4 py-2 rounded-full border transition-all shadow-sm ${
                  selectedMarca === marca
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-700 hover:text-blue-700'
                }`}
              >
                {marca}
              </button>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-700">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.110 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <div className="p-3 rounded-full bg-blue-100 text-blue-700">
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

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form className="flex gap-4 mb-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por marca, modelo, ciudad..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <button
              type="button"
              onClick={fetchMotos}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
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
          {showFilters && (
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                  <select
                    value={filters.marca || ''}
                    onChange={(e) => handleFilterChange({ marca: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Mínimo</label>
                  <input
                    type="number"
                    value={filters.precioMin || ''}
                    onChange={(e) => handleFilterChange({ precioMin: parseInt(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máximo</label>
                  <input
                    type="number"
                    value={filters.precioMax || ''}
                    onChange={(e) => handleFilterChange({ precioMax: parseInt(e.target.value) })}
                    placeholder="50000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={filters.ciudad || ''}
                    onChange={(e) => handleFilterChange({ ciudad: e.target.value })}
                    placeholder="Ej: Armenia"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <select
                    value={filters.departamento || ''}
                    onChange={(e) => handleFilterChange({ departamento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                  <select
                    value={filters.ordenPor || ''}
                    onChange={(e) => handleFilterChange({ ordenPor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
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
              <div className="mt-4 text-sm text-gray-500 text-center">{motos.length} motos encontradas</div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando motos...</p>
          </div>
        ) : motos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {motos.map((moto) => (
              <MotoCard key={moto.id} moto={moto} onFavoriteToggle={() => toggleFavorito(moto.id)} />
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl text-gray-500 font-semibold mb-3">Compra Segura</h3>
            <p className="text-gray-600">
              Verificación automática de documentos, historial del vehículo y pagos protegidos.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="text-xl text-gray-500 font-semibold mb-3">Trámites Fáciles</h3>
            <p className="text-gray-600">
              Gestionamos todos los trámites del RUNT y agendamos citas automáticamente.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl text-gray-500 font-semibold mb-3">Chat Directo</h3>
            <p className="text-gray-600">
              Comunícate directamente con vendedores verificados en tiempo real.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para encontrar tu moto ideal?</h2>
          <p className="text-gray-600 mb-8">Únete a miles de usuarios que ya confían en VeloMark</p>
          <div className="space-x-4">
            <button className="bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-800 transition-colors shadow-lg">
              Explorar Motos
            </button>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors shadow-lg">
              Vender Mi Moto
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">🏍️ Velomark</div>
              <p className="text-gray-400">
                El marketplace más seguro para comprar y vender motos en Colombia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Explorar Motos</li>
                <li>Vender</li>
                <li>Favoritos</li>
                <li>Búsqueda Avanzada</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Cómo Comprar</li>
                <li>Cómo Vender</li>
                <li>Trámites RUNT</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Términos de Uso</li>
                <li>Política de Privacidad</li>
                <li>Contacto</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VeloMark. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
