// src/app/dashboard/mis-motos/page.tsx

'use client';
export const dynamic = 'force-dynamic';

import api, { getMisMotos } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface Moto {
  id: string;
  titulo: string;
  precio: number;
  estado: 'ACTIVA' | 'VENDIDA' | 'PAUSADA';
  imagenPrincipal?: string | null;
}

type Filtro = 'TODAS' | Moto['estado'];
const ESTADOS: Filtro[] = ['TODAS', 'ACTIVA', 'VENDIDA', 'PAUSADA'];

export default function MisMotosPage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>('TODAS');


  // ─── 1) Traer SOLO con getMisMotos(), sin llamadas extra que fallen ─────────
  const fetchMotos = async () => {
    try {
      const data = await getMisMotos();  // realiza la llamada al backend
      setMotos(data);
    } catch (err) {
      console.error('❌ Error cargando tus motos:', err);
      toast.error('No se pudieron cargar tus motos');
      setMotos([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── 2) Al montar, cargar la lista real del backend ──────────────────────────
  useEffect(() => {
    fetchMotos();
  }, []);

  // ─── 3) Filtrado en cliente ─────────────────────────────────────────────────
  const safeMotos = Array.isArray(motos) ? motos : [];
  const motosFiltradas = useMemo(
    () =>
      filtro === 'TODAS'
        ? safeMotos
        : safeMotos.filter((m) => m.estado === filtro),
    [safeMotos, filtro]
  );

  // Eliminación optimizada: borra en el backend y luego actualizas el estado
  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta moto?')) return;
    try {
      // 1) Petición al backend (asegúrate que la ruta existe y devuelve 200)
      await api.delete(`/motos/${id}`);
      toast.success('Moto eliminada');

      // 2) Actualizas el estado local (sin volver a fetch)
      setMotos((prev) => prev.filter((m) => m.id !== id));

    } catch (err) {
      console.error('❌ Error al eliminar la moto:', err);
      toast.error('No se pudo eliminar la moto');
    }
  };

  // ─── 5) Render ──────────────────────────────────────────────────────────────
  if (loading) {
    return <p className="p-6 text-center">Cargando tus motos…</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl text-gray-500 font-bold mb-4">Mis Motos</h1>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {ESTADOS.map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`px-3 py-1 rounded-full border ${
              filtro === e ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Listado o mensaje si está vacío */}
      {motosFiltradas.length === 0 ? (
        <p className="text-gray-600">No tienes motos en este estado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {motosFiltradas.map((moto) => (
            <div
              key={moto.id}
              className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
            >
              <Link href={`/motos/${moto.id}`}>
                {moto.imagenPrincipal ? (
                  <Image
                    src={moto.imagenPrincipal}
                    alt={moto.titulo}
                    width={400}
                    height={300}
                    className="w-full h-60 object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    Sin imagen
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg text-gray-500 font-semibold">{moto.titulo}</h3>
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
