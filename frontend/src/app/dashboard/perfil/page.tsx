'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { authAPI, type User } from '@/lib/api';

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await authAPI.getProfile();
        setUser(data);
      } catch (error) {
        console.error('Error obteniendo perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Cargando perfil...</p>;
  }

  if (!user) {
    return <p className="p-6 text-center">No se pudo cargar el perfil.</p>;
  }

  const nombreCompleto = user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.nombre;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Mi Perfil</h1>

      <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={nombreCompleto}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-700">
              {user.nombre.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-xl font-semibold text-gray-800">{nombreCompleto}</p>
          <p className="text-gray-600">{user.email}</p>
          {user.telefono && <p className="text-gray-600">📞 {user.telefono}</p>}
          {(user.ciudad || user.departamento) && (
            <p className="text-gray-600">
              📍 {user.ciudad}
              {user.ciudad && user.departamento ? ', ' : ''}
              {user.departamento}
            </p>
          )}
          <p className="text-gray-600">
            📅 Registrado el {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <Link
            href="/dashboard/configuracion"
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Cambiar contraseña
          </Link>
        </div>
      </div>

      {/* Roles o insignias */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Roles e insignias</h2>
        <p className="text-gray-500">Próximamente...</p>
      </div>
    </div>
  );
}
