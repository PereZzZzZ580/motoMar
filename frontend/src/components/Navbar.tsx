// src/components/Navbar.tsx
'use client';

import api, { auth, authAPI, type User } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(auth.getUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    auth.clearAuth();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl mr-2">🏍️</span>
              <span className="font-bold text-xl">MotoMar</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-4">
              <Link href="/dashboard" className="hover:bg-indigo-700 px-3 py-2 rounded-md">
                Inicio
              </Link>
              <Link href="/dashboard/mis-motos" className="hover:bg-indigo-700 px-3 py-2 rounded-md">
                Mis Motos
              </Link>
              <Link href="/dashboard/favoritos" className="hover:bg-indigo-700 px-3 py-2 rounded-md">
                Favoritos
              </Link>
              <Link href="/dashboard/publicar" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold">
                + Publicar Moto
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <div className="mr-4 text-right hidden md:block">
                  <p className="text-sm font-semibold">{user.nombre} {user.apellido}</p>
                  <p className="text-xs">⭐ {user.calificacion.toFixed(1)}/5.0</p>
                </div>
                
                <div className="relative group">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
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
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                 <button
                  onClick={handleLogout}
                  type="button"
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md hidden md:inline-block" 
                  >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-4">
                <Link href="/auth/login" className="hover:bg-blue-800 px-3 py-2 rounded-md">
                  Iniciar Sesión
                </Link>
                <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none"
            >
              <svg className={`h-6 w-6 transition-transform duration-500 ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <Link href="/dashboard" className="block hover:bg-indigo-700 px-3 py-2 rounded-md">
              Inicio
            </Link>
            <Link href="/dashboard/mis-motos" className="block hover:bg-indigo-700 px-3 py-2 rounded-md">
              Mis Motos
            </Link>
            <Link href="/dashboard/favoritos" className="block hover:bg-indigo-700 px-3 py-2 rounded-md">
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
