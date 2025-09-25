// src/app/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-indigo-600 transform hover:scale-105 transition-transform duration-300">
                <a href="#">🏍️ MotoMar</a>
              </div>
              <span className="ml-2 text-gray-500 text-sm hidden sm:inline">
                Marketplace de Motos
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-indigo-600 transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full">
                Explorar Motos
              </a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full">
                Vender
              </a>
              <a href="#" className="text-gray-700 hover:text-indigo-600 transition-all duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full">
                Favoritos
              </a>
            </nav>

            {/* Desktop Auth buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-all duration-300 transform hover:scale-105">
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                Registrarse
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-indigo-600 focus:outline-none transition-transform duration-300 transform-gpu" aria-label="Abrir menú">
                <svg className={`h-6 w-6 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-white border-t transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <nav className="flex flex-col space-y-2 p-4">
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-all duration-300 py-2 transform hover:translate-x-2">
              Explorar Motos
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-all duration-300 py-2 transform hover:translate-x-2">
              Vender
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-all duration-300 py-2 transform hover:translate-x-2">
              Favoritos
            </a>
            <div className="border-t my-2"></div>
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium py-2 text-left transition-all duration-300 transform hover:translate-x-2">
              Iniciar Sesión
            </Link>
            <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 w-full transform hover:scale-105 text-center">
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-down">
            Encuentra la <span className="text-indigo-600">Moto Perfecta</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up">
            El marketplace más seguro de Colombia para comprar y vender motocicletas. 
            Con verificación automática, pagos seguros y trámites simplificados.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative transform hover:scale-105 transition-transform duration-300">
              <input
                type="text"
                placeholder="Buscar motos por marca, modelo o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-lg text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm sm:text-base transform hover:scale-110 active:scale-95">
                🔍 Buscar
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
            {['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Bajaj'].map((marca, index) => (
              <button
                key={marca}
                className="bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all duration-300 shadow-sm text-sm transform hover:scale-110 hover:shadow-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {marca}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-3">Compra Segura</h3>
            <p className="text-gray-600">
              Verificación automática de documentos, historial del vehículo y pagos protegidos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '200ms' }}>
            <div className="text-3xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-3">Trámites Fáciles</h3>
            <p className="text-gray-600">
              Gestionamos todos los trámites del RUNT y agendamos citas automáticamente.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '400ms' }}>
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-3">Chat Directo</h3>
            <p className="text-gray-600">
              Comunícate directamente con vendedores verificados en tiempo real.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-2">1,200+</div>
              <div className="text-gray-600">Motos Disponibles</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-2">850+</div>
              <div className="text-gray-600">Ventas Exitosas</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-2">4.8⭐</div>
              <div className="text-gray-600">Calificación Promedio</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
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
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto">
              Explorar Motos
            </button>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto">
              Vender Mi Moto
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4 transform hover:scale-105 transition-transform duration-300">🏍️ MotoMar</div>
              <p className="text-gray-400 text-sm">
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 MotoMar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}