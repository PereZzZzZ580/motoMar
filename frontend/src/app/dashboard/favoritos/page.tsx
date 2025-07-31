'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MotoCard from '@/components/MotoCard';
import toast from 'react-hot-toast';

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
  vendedor: {
    nombre: string;
    apellido: string;
    calificacion: number;
  };
  _count?: {
    favoritos: number;
  };
  es_favorito?: boolean;
}

export default function FavoritosPage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerFavoritos();
  }, []);

  const obtenerFavoritos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/motos/me/favoritos');
      setMotos(response.data.favoritos);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      toast.error('No se pudieron cargar tus favoritos');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorito = async (motoId: string) => {
    try {
      await api.post(`/motos/${motoId}/favorito`);
      setMotos((prev) =>
        prev.filter((moto) => moto.id !== motoId)
      );
      toast.success('Eliminado de favoritos');
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      toast.error('No se pudo actualizar el favorito');
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Mis Favoritos</h1>
      {motos.length === 0 ? (
        <p className="text-gray-600">No tienes motos favoritas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {motos.map((moto) => (
            <MotoCard key={moto.id} moto={moto} onFavoriteToggle={() => toggleFavorito(moto.id)} />
          ))}
        </div>
      )}
    </div>
  );
}