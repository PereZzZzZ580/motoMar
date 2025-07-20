// src/components/MotoCard.tsx
'use client';

import Link from 'next/link';

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
    calificacion_promedio: number;
  };
  _count?: {
    favoritos: number;
  };
  es_favorito?: boolean;
}

interface MotoCardProps {
  moto: Moto;
  onFavoriteToggle?: (motoId: string) => void;
}

export default function MotoCard({ moto, onFavoriteToggle }: MotoCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegación
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(moto.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      'ACTIVA': 'bg-green-100 text-green-800',
      'VENDIDA': 'bg-gray-100 text-gray-800',
      'PAUSADA': 'bg-yellow-100 text-yellow-800',
      'ELIMINADA': 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/motos/${moto.id}`}>
          <img
            src={moto.imagenes[0]?.url || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
            alt={moto.titulo}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Botón de favorito - SOLO VISUAL, manejado por Dashboard */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              moto.es_favorito 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400 hover:text-red-400'
            }`}
            fill={moto.es_favorito ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${getEstadoBadge(moto.estado)}`}>
          {moto.estado}
        </span>
      </div>

      <div className="p-4">
        <Link href={`/motos/${moto.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
            {moto.titulo}
          </h3>
        </Link>
        
        <p className="text-2xl font-bold text-indigo-600 mt-2">
          {formatPrice(moto.precio)}
        </p>

        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {moto.ciudad}, {moto.departamento}
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {moto.cilindraje}cc • {moto.año} • {moto.kilometraje.toLocaleString()} km
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xs">
              {moto.vendedor?.nombre?.charAt(0) || 'U'}
            </div>
            <span className="ml-2 text-gray-700">
              {moto.vendedor?.nombre || 'Usuario'} {moto.vendedor?.apellido || ''}
            </span>
            <span className="ml-2 text-yellow-500">
              ⭐ {moto.vendedor?.calificacion_promedio?.toFixed(1) || '0.0'}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg 
              className={`w-4 h-4 mr-1 ${moto.es_favorito ? 'text-red-500 fill-current' : ''}`}
              fill={moto.es_favorito ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {moto._count?.favoritos || 0}
          </div>
        </div>
      </div>
    </div>
  );
}