'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import React from 'react';


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
  color: string;
  ciudad: string;
  departamento: string;
  acepta_permutas: boolean;
  precio_negociable: boolean;
  estado: string;
  createdAt: string;
  vendedor?: {
    id: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    calificacion: number;
    totalVentas: number;
    ciudad: string;
    departamento: string;
  };
  imagenes?: {
    id: string;
    url: string;
    orden: number;
  }[];
  _count?: {
    favoritos: number;
    visitas?: number;
  };
  esFavorito?: boolean;
}

export default function MotoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [moto, setMoto] = useState<Moto | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const placeholder = 'https://images.unsplash.com/photo-…'; // Ruta al placeholder de imagen
  const motoId = params.id as string;

   const contactarWhatsApp = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión');
      router.push('/auth/login');
      return;
    }
    if (moto?.vendedor?.telefono) {
      window.open(`https://wa.me/${moto.vendedor.telefono}`, '_blank');
    } else {
      toast.error('El vendedor no ha registrado número de contacto');
    }
  };

  const toggleFavorito = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión');
      router.push('/auth/login');
      return;
    }
    if (!moto) return;
    try {
      await api.post(`/motos/${moto.id}/favorito`);
      setMoto({
        ...moto,
        esFavorito: !moto.esFavorito,
        _count: {
          ...moto._count,
          favoritos: !moto.esFavorito
            ? (moto._count?.favoritos || 0) + 1
            : (moto._count?.favoritos || 0) - 1,
        },
      });
      toast.success(!moto.esFavorito ? '¡Agregado a favoritos!' : 'Eliminado de favoritos');
    } catch (err) {
      console.error('Error al actualizar favorito:', err);
      toast.error('Error al actualizar favorito');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión');
      router.push('/auth/login');
    }
  }, []);

  useEffect(() => {
    if (motoId) {
      fetchMoto();
    }
  }, [motoId]);

  const fetchMoto = async () => {
    console.log('🚀 Iniciando fetch para ID:', motoId);
    
    try {
      const response = await api.get(`/motos/${motoId}`);
      console.log('✅ Respuesta recibida:', response.data);
      
      if (response.data && response.data.moto) {
        setMoto(response.data.moto);
        console.log('✅ Moto establecida:', response.data.moto);
      } else {
        throw new Error('No se encontró la moto');
      }
    } catch (error) {
      console.error('❌ Error al cargar moto:', error);
      setError('Error al cargar la moto');
      toast.error('Error al cargar la información de la moto');
    } finally {
      console.log('🏁 Finalizando carga');
      setLoading(false);
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de la moto...</p>
          <p className="text-sm text-gray-400">ID: {motoId}</p>
        </div>
      </div>
    );
  }

  if (error || !moto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar la moto</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const imgs = moto.imagenes || [];
  const total = imgs.length;
  const currentImage = imgs[currentIdx] ?? null;
  


  // Renderizado principal
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-700 hover:text-blue-900 flex items-center mb-4"
          >
            ← Volver al Inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{moto.titulo}</h1>
          <p className="text-gray-600">{moto.ciudad}, {moto.departamento}</p>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="relative w-full h-96 bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={currentImage?.url  || placeholder}            
              alt={`${moto.titulo} imagen ${currentIdx + 1}`}
              fill       //cubre todo el contenedor
              style ={{ objectFit: 'cover' }}   // Mantiene la proporción de la imagen
              priority
            />
            {total > 1 && (
              <>
                <button
                  onClick={() => setCurrentIdx((currentIdx - 1 + total) % total)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentIdx((currentIdx + 1) % total)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Precio */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${moto.precio.toLocaleString('es-CO')}
              </div>
              {moto.precio_negociable && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Precio Negociable
                </span>
              )}
            </div>

            {/* Detalles técnicos */}
            <div className="bg-white text-gray-500 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Detalles Técnicos</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-900">Marca:</span>
                  <span className="ml-2 font-medium">{moto.marca}</span>
                </div>
                <div>
                  <span className="text-gray-900">Modelo:</span>
                  <span className="ml-2 font-medium">{moto.modelo}</span>
                </div>
                <div>
                  <span className="text-gray-900">Año:</span>
                  <span className="ml-2 font-medium">{moto.año}</span>
                </div>
                <div>
                  <span className="text-gray-900">Cilindraje:</span>
                  <span className="ml-2 font-medium">{moto.cilindraje} cc</span>
                </div>
                <div>
                  <span className="text-gray-900">Kilometraje:</span>
                  <span className="ml-2 font-medium">{moto.kilometraje.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-gray-900">Color:</span>
                  <span className="ml-2 font-medium">{moto.color}</span>
                </div>
              </div>
            </div>

            {/* Vendedor */}
            {moto.vendedor && (
              <div className="bg-white p-6  text-gray-500 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Vendedor</h3>
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                    {moto.vendedor.nombre.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{moto.vendedor.nombre} {moto.vendedor.apellido}</p>
                    <p className="text-sm text-gray-500">{moto.vendedor.ciudad}, {moto.vendedor.departamento}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>⭐ {moto.vendedor.calificacion.toFixed(1)}/5.0</span>
                  <span>{moto.vendedor.totalVentas} ventas</span>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={contactarWhatsApp}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                💬 Contactar por WhatsApp
              </button>
                <button
                onClick={toggleFavorito}
                className="w-full bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                ❤️ Agregar a Favoritos
              </button>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-8 bg-white  text-gray-500 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Descripción</h3>
          <p className="text-gray-700 leading-relaxed">{moto.descripcion}</p>
        </div>
      </div>
    </div>
  );
}