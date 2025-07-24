// src/app/dashboard/mis-motos/page.tsx

'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import MotoCard from '@/components/MotoCard';

interface Moto {
  id: string;
  titulo: string;
  precio: number;
  estado: 'ACTIVA' | 'VENDIDA' | 'PAUSADA';
  imagenPrincipal?: string | null;
  _count?: { favoritos: number };
}

type Filtro = 'TODAS' | 'ACTIVA' | 'VENDIDA' | 'PAUSADA';
const estados: Filtro[] = ['TODAS', 'ACTIVA', 'VENDIDA', 'PAUSADA'];


export default function MisMotosPage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>('TODAS');
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || '';

  // 1) Fetch de mis motos
  useEffect(() => {
    api
      .get<{ motos: Moto[] }>('/motos/mis-motos')
      .then(res => setMotos(res.data.motos))
      .catch(err => {
        console.error(err);
        toast.error('Error cargando tus motos');
      })
      .finally(() => setLoading(false));
  }, []);

  // 2) Filtrado en cliente
  const motosFiltradas = filtro === 'TODAS'
    ? motos
    : motos.filter(m => m.estado === filtro);

  // 3) Eliminación quirúrgica + refresh
  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta moto?')) return;
    try {
      await api.delete(`/motos/${id}`);
      toast.success('Moto eliminada');
      // Opción A: quitarla del estado local
      setMotos(prev => prev.filter(m => m.id !== id));
      // Opción B: forzar revalidación completa
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('No se pudo eliminar la moto');
    }
  };

  if (loading) {
    return <p className="p-6">Cargando tus motos…</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl text-gray-500 font-bold mb-4">Mis Motos</h1>

      {/* Botones de filtro */}
      <div className="flex gap-3 mb-6">
        {estados.map((estado)) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-3 py-1 rounded-full border ${
              filtro === estado ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {motosFiltradas.length === 0 ? (
        <p className="text-gray-600">No tienes motos en este estado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {motosFiltradas.map(moto => (
            <div key={moto.id} className="relative group">
              <Link href={`/dashboard/mis-motos/${moto.id}`}>
                {moto.imagenPrincipal ? (
                  <Image
                    src={`${API}/uploads/${moto.imagenPrincipal}`}
                    alt={moto.titulo}
                    width={400}
                    height={300}
                    className="object-cover w-full h-48"
                    priority
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    Sin imagen
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{moto.titulo}</h3>
                  <p className="text-green-600 font-bold">
                    ${moto.precio.toLocaleString()}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleDelete(moto.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
