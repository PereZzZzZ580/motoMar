 // src/app/page.tsx
"use client";

import { useState } from 'react';

export default function HomePage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-indigo-600">
                🏍️ MotoMar
              </div>
              <span className="ml-2 text-gray-500 text-sm">
                Marketplace de Motos
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Explorar Motos
              </a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Vender
              </a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Favoritos
              </a>
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                Iniciar Sesión
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Encuentra la <span className="text-indigo-600">Moto Perfecta</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            El marketplace más seguro de Colombia para comprar y vender motocicletas. 
            Con verificación automática, pagos seguros y trámites simplificados.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar motos por marca, modelo o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                🔍 Buscar
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex justify-center space-x-4 mb-12">
            {['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Bajaj'].map((marca) => (
              <button
                key={marca}
                className="bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
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
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">1,200+</div>
              <div className="text-gray-600">Motos Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">850+</div>
              <div className="text-gray-600">Ventas Exitosas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">4.8⭐</div>
              <div className="text-gray-600">Calificación Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">25</div>
              <div className="text-gray-600">Ciudades</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para encontrar tu moto ideal?
          </h2>
          <p className="text-gray-600 mb-8">
            Únete a miles de usuarios que ya confían en MotoMar
          </p>
          <div className="space-x-4">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg">
              Explorar Motos
            </button>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto">
              Vender Mi Moto
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">🏍️ MotoMar</div>
              <p className="text-gray-400">
                El marketplace más seguro para comprar y vender motos en Colombia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Explorar Motos</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Vender</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Favoritos</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Búsqueda Avanzada</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Cómo Comprar</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Cómo Vender</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Trámites RUNT</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Términos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-all duration-300 transform hover:translate-x-1 inline-block">Contacto</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MotoMar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}