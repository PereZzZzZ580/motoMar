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
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl mr-2">🏍️</span>
              <span className="font-bold text-xl">MotoMar</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-4">
              <Link href="/" className="hover:bg-blue-800 px-3 py-2 rounded-md">
                Inicio
              </Link>
              <Link href="/dashboard/mis-motos" className="hover:bg-blue-800 px-3 py-2 rounded-md">
              Mis Motos
              </Link>
              <Link href="/dashboard/favoritos" className="hover:bg-blue-800 px-3 py-2 rounded-md">
              Favoritos
              </Link>
              <Link href="/dashboard/publicar" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold">
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
                
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                  >
                    <div className="h-8 w-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold">
                      {user.nombre.charAt(0)}
                    </div>
                  </button>

                  {menuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link href="/dashboard/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Mi Perfil
                        </Link>
                        <Link href="/dashboard/configuracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Configuración
                        </Link>
                        <button
                          onClick={handleLogout}
                          type="button"
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors hover:cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 17l5-5m0 0l-5-5m5 5H8m4 5v1m0-11V4"
                            />
                          </svg>
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block hover:bg-blue-800 px-3 py-2 rounded-md">
              Inicio
            </Link>
            <Link href="/dashboard/mis-motos" className="block hover:bg-blue-800 px-3 py-2 rounded-md">
              Mis Motos
            </Link>
            <Link href="/dashboard/favoritos" className="block hover:bg-blue-800 px-3 py-2 rounded-md">
              Favoritos
            </Link>
            <Link href="/dashboard/publicar" className="block bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold">
              + Publicar Moto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
