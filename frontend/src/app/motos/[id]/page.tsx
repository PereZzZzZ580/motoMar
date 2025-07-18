 // src/app/motos/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
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
  color: string;
  tipo_motor?: string;
  transmision?: string;
  combustible?: string;
  placa_termina_en?: string;
  soat_hasta?: string;
  tecnomecanica_hasta?: string;
  ciudad: string;
  departamento: string;
  direccion_aproximada?: string;
  whatsapp?: string;
  acepta_permutas: boolean;
  precio_negociable: boolean;
  estado: string;
  createdAt: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    calificacion_promedio: number;
    _count: {
      motos_vendidas: number;
    };
  };
  imagenes: {
    id: string;
    url: string;
    orden: number;
  }[];
  _count: {
    favoritos: number;
    visitas: number;
  };
  es_favorito?: boolean;
}

export default function MotoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [moto, setMoto] = useState<Moto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchMoto();
    checkCurrentUser();
  }, [params.id]);

  const checkCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUserId(response.data.usuario.id);
    } catch (error) {
      console.error('No autenticado');
    }
  };

  const fetchMoto = async () => {
    try {
      const response = await api.get(`/motos/${params.id}`);
      setMoto(response.data);
      setIsFavorite(response.data.es_favorito || false);
      
      // Incrementar visitas
      await api.post(`/motos/${params.id}/visita`);
    } catch (error) {
      console.error('Error al cargar moto:', error);
      toast.error('Error al cargar la información de la moto');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!userId) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      router.push('/auth/login');
      return;
    }

    try {
      const response = await api.post(`/motos/${params.id}/favorito`);
      setIsFavorite(response.data.es_favorito);
      toast.success(response.data.es_favorito ? 'Agregado a favoritos' : 'Eliminado de favoritos');
    } catch (error) {
      toast.error('Error al actualizar favoritos');
    }
  };

  const handleContact = () => {
    if (!userId) {
      toast.error('Debes iniciar sesión para contactar al vendedor');
      router.push('/auth/login');
      return;
    }
    setShowContactInfo(true);
  };

  const handleWhatsApp = () => {
    if (moto?.whatsapp) {
      const message = `Hola, estoy interesado en tu ${moto.titulo} publicada en MotoMar`;
      window.open(`https://wa.me/57${moto.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!moto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Moto no encontrada</p>
      </div>
    );
  }

  const isOwner = userId === moto.usuario.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al listado
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galería de imágenes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Imagen principal */}
              <div className="relative h-96 bg-gray-100">
                <img
                  src={moto.imagenes[selectedImage]?.url || 'https://via.placeholder.com/800x600?text=Sin+Imagen'}
                  alt={moto.titulo}
                  className="w-full h-full object-contain"
                />
                
                {/* Navegación de imágenes */}
                {moto.imagenes.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : moto.imagenes.length - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev < moto.imagenes.length - 1 ? prev + 1 : 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Indicador de estado */}
                <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded ${
                  moto.estado === 'ACTIVA' ? 'bg-green-100 text-green-800' :
                  moto.estado === 'VENDIDA' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {moto.estado}
                </span>
              </div>

              {/* Miniaturas */}
              {moto.imagenes.length > 1 && (
                <div className="flex overflow-x-auto gap-2 p-4">
                  {moto.imagenes.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-indigo-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${moto.titulo} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Descripción y especificaciones */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold mb-4">Descripción</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{moto.descripcion}</p>

              <h3 className="text-xl font-bold mt-6 mb-4">Especificaciones Técnicas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Marca:</span>
                  <span className="ml-2 font-semibold">{moto.marca}</span>
                </div>
                <div>
                  <span className="text-gray-600">Modelo:</span>
                  <span className="ml-2 font-semibold">{moto.modelo}</span>
                </div>
                <div>
                  <span className="text-gray-600">Año:</span>
                  <span className="ml-2 font-semibold">{moto.año}</span>
                </div>
                <div>
                  <span className="text-gray-600">Cilindraje:</span>
                  <span className="ml-2 font-semibold">{moto.cilindraje}cc</span>
                </div>
                <div>
                  <span className="text-gray-600">Kilometraje:</span>
                  <span className="ml-2 font-semibold">{moto.kilometraje.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-gray-600">Color:</span>
                  <span className="ml-2 font-semibold">{moto.color}</span>
                </div>
                {moto.tipo_motor && (
                  <div>
                    <span className="text-gray-600">Tipo de Motor:</span>
                    <span className="ml-2 font-semibold">{moto.tipo_motor}</span>
                  </div>
                )}
                {moto.transmision && (
                  <div>
                    <span className="text-gray-600">Transmisión:</span>
                    <span className="ml-2 font-semibold">{moto.transmision}</span>
                  </div>
                )}
                {moto.combustible && (
                  <div>
                    <span className="text-gray-600">Combustible:</span>
                    <span className="ml-2 font-semibold">{moto.combustible}</span>
                  </div>
                )}
                {moto.placa_termina_en && (
                  <div>
                    <span className="text-gray-600">Placa termina en:</span>
                    <span className="ml-2 font-semibold">{moto.placa_termina_en}</span>
                  </div>
                )}
              </div>

              {(moto.soat_hasta || moto.tecnomecanica_hasta) && (
                <>
                  <h3 className="text-xl font-bold mt-6 mb-4">Documentación</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {moto.soat_hasta && (
                      <div>
                        <span className="text-gray-600">SOAT vigente hasta:</span>
                        <span className="ml-2 font-semibold">{formatDate(moto.soat_hasta)}</span>
                      </div>
                    )}
                    {moto.tecnomecanica_hasta && (
                      <div>
                        <span className="text-gray-600">Tecnomecánica hasta:</span>
                        <span className="ml-2 font-semibold">{formatDate(moto.tecnomecanica_hasta)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Información lateral */}
          <div className="space-y-6">
            {/* Precio y acciones */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl font-bold text-indigo-600">
                {formatPrice(moto.precio)}
              </div>
              
              <div className="mt-4 space-y-2">
                {moto.precio_negociable && (
                  <p className="text-sm text-green-600 font-semibold">
                    ✓ Precio negociable
                  </p>
                )}
                {moto.acepta_permutas && (
                  <p className="text-sm text-green-600 font-semibold">
                    ✓ Acepta permutas
                  </p>
                )}
              </div>

              {/* Botones de acción */}
              <div className="mt-6 space-y-3">
                {!isOwner && (
                  <>
                    <button
                      onClick={handleContact}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      Contactar al vendedor
                    </button>
                    
                    {moto.whatsapp && (
                      <button
                        onClick={handleWhatsApp}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                      </button>
                    )}
                  </>
                )}

                {isOwner && (
                  <Link
                    href={`/dashboard/mis-motos/editar/${moto.id}`}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition text-center block"
                  >
                    Editar publicación
                  </Link>
                )}

                <button
                  onClick={handleFavoriteToggle}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`}
                    fill={isFavorite ? 'currentColor' : 'none'}
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
                  {isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                </button>
              </div>

              {/* Información de contacto */}
              {showContactInfo && !isOwner && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Información de contacto:</h4>
                  <p className="text-sm text-gray-700">Teléfono: {moto.usuario.telefono || 'No disponible'}</p>
                  <p className="text-sm text-gray-700">Email: {moto.usuario.email}</p>
                  {moto.whatsapp && (
                    <p className="text-sm text-gray-700">WhatsApp: {moto.whatsapp}</p>
                  )}
                </div>
              )}
            </div>

            {/* Información del vendedor */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Vendedor</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {moto.usuario.nombre.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{moto.usuario.nombre} {moto.usuario.apellido}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{moto.usuario.calificacion_promedio.toFixed(1)}/5.0</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>{moto.usuario._count.motos_vendidas} motos vendidas</p>
                <p>Miembro desde {formatDate(moto.createdAt)}</p>
              </div>

              {!isOwner && (
                <Link
                  href={`/vendedor/${moto.usuario.id}`}
                  className="mt-4 block text-center text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Ver perfil del vendedor
                </Link>
              )}
            </div>

            {/* Ubicación */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Ubicación</h3>
              
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Ciudad:</span>
                  <span className="ml-2 font-semibold">{moto.ciudad}</span>
                </p>
                <p>
                  <span className="text-gray-600">Departamento:</span>
                  <span className="ml-2 font-semibold">{moto.departamento}</span>
                </p>
                {moto.direccion_aproximada && (
                  <p>
                    <span className="text-gray-600">Zona:</span>
                    <span className="ml-2 font-semibold">{moto.direccion_aproximada}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>👁️ {moto._count.visitas} visitas</span>
                <span>❤️ {moto._count.favoritos} favoritos</span>
              </div>
              <p className="mt-2 text-xs">Publicado {formatDate(moto.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
