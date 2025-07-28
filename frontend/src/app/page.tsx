 // src/app/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-700">
                🏍️ Velomark
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-700 transition-colors">
                Explorar Motos
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-700 transition-colors">
                Vender
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-700 transition-colors">
                Favoritos
              </a>
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                 Iniciar Sesión
              </Link>              
              <Link
                href="/auth/register"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Encuentra la <span className="text-blue-700">Moto Perfecta</span>
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
                className="w-full px-6 py-4 text-gray-500 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                🔍 Buscar
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex justify-center space-x-4 mb-12">
            {['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Bajaj'].map((marca) => (
              <button
                key={marca}
                className="bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:border-blue-700 hover:text-blue-700 transition-all shadow-sm"
              >
                {marca}
              </button>
            ))}
          </div>
        </div>

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
              <div className="text-3xl font-bold text-blue-700 mb-2">1,200+</div>
              <div className="text-gray-600">Motos Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700 mb-2">850+</div>
              <div className="text-gray-600">Ventas Exitosas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700 mb-2">4.8⭐</div>
              <div className="text-gray-600">Calificación Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700 mb-2">25</div>
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
            Únete a miles de usuarios que ya confían en VeloMark
          </p>
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

      {/* Footer */}
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
