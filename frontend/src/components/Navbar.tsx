// src/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  calificacion_promedio: number;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.usuario);
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center transform hover:scale-105 transition-transform duration-300">
              <span className="text-2xl mr-2">🏍️</span>
              <span className="font-bold text-xl">MotoMar</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-4">
              <Link href="/dashboard" className="hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors duration-300">
                Inicio
              </Link>
              <Link href="/dashboard/mis-motos" className="hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors duration-300">
                Mis Motos
              </Link>
              <Link href="/dashboard/favoritos" className="hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors duration-300">
                Favoritos
              </Link>
              <Link href="/dashboard/publicar" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                + Publicar Moto
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user && (
              <div className="flex items-center">
                <div className="mr-4 text-right hidden md:block">
                  <p className="text-sm font-semibold">{user.nombre} {user.apellido}</p>
                  <p className="text-xs">⭐ {user.calificacion_promedio.toFixed(1)}/5.0</p>
                </div>
                
                <div className="relative group">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-transform duration-300 transform hover:scale-110"
                  >
                    <div className="h-8 w-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
                      {user.nombre.charAt(0)}
                    </div>
                  </button>

                  <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out transform ${menuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <div className="py-1">
                      <Link href="/dashboard/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        Mi Perfil
                      </Link>
                      <Link href="/dashboard/configuracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        Configuración
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none transition-transform duration-300 transform-gpu"
            >
              <svg className={`h-6 w-6 transition-transform duration-500 ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/dashboard" className="block hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors duration-300">
            Inicio
          </Link>
          <Link href="/dashboard/mis-motos" className="block hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors duration-300">
            Mis Motos
          </Link>
          <Link href="/dashboard/favoritos" className="block hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors duration-300">
            Favoritos
          </Link>
          <Link href="/dashboard/publicar" className="block bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold transition-colors duration-300">
            + Publicar Moto
          </Link>
        </div>
      </div>
    </nav>
  );
}