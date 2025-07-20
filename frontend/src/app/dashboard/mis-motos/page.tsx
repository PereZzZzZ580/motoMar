'use client';

import { useEffect, useState } from 'react';
import MotoCard from '@/components/MotoCard';
import { getMisMotos } from '@/lib/api';
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
  _count?: {
    favoritos: number;
  };
  es_favorito?: boolean;
}

export default function MisMotosPage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'TODAS' | 'ACTIVA' | 'VENDIDA' | 'PAUSADA'>('TODAS');
  const router = useRouter();

  useEffect(() => {
    const fetchMotos = async () => {
      try {
        const data = await getMisMotos();

        // ✅ Asegura que lo que llegue sea un array antes de asignar
        if (Array.isArray(data)) {
          setMotos(data);
        } else {
          console.warn('⚠️ getMisMotos no retornó un array:', data);
          setMotos([]);
        }
      } catch (error) {
        console.error('❌ Error cargando mis motos:', error);
        setMotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMotos();
  }, []);

  // ✅ Siempre aseguramos que motosFiltradas sea un array
  const motosFiltradas = Array.isArray(motos)
    ? filtro === 'TODAS'
      ? motos
      : motos.filter((m) => m.estado === filtro)
    : [];

  return (
    <div className="p-6">
      <h1 className="text-3xl text-gray-400 font-bold mb-4">Mis Motos</h1>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        {['TODAS', 'ACTIVA', 'VENDIDA', 'PAUSADA'].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado as typeof filtro)}
            className={`px-4 py-2 rounded-full border ${
              filtro === estado ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-700">Cargando tus motos...</p>
      ) : motosFiltradas.length === 0 ? (
        <p className ="text-gray-700"> No tienes motos en este estado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {motosFiltradas.map((moto) => (
            <MotoCard key={moto.id} moto={moto} />
          ))}
        </div>
      )}
    </div>
  );
}
