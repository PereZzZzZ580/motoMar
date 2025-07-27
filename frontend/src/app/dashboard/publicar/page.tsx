 // src/app/dashboard/publicar/page.tsx
'use client';

import api from '@/lib/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface FormData {
  titulo: string;
  descripcion: string;
  precio: string;
  marca: string;
  modelo: string;
  año: string;
  cilindraje: string;
  kilometraje: string;
  color: string;
  tipo_motor: string;
  transmision: string;
  combustible: string;
  placa_termina_en: string;
  soat_hasta: string;
  tecnomecanica_hasta: string;
  ciudad: string;
  departamento: string;
  direccion_aproximada: string;
  whatsapp: string;
  acepta_permutas: boolean;
  precio_negociable: boolean;
}

const marcasPopulares = [
  'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Bajaj', 
  'KTM', 'AKT', 'Pulsar', 'TVS', 'Hero', 'Ducati',
  'BMW', 'Harley Davidson', 'Royal Enfield', 'Benelli'
];

const tiposMotor = ['2 Tiempos', '4 Tiempos', 'Eléctrico'];
const tiposTransmision = ['MANUAL', 'AUTOMATICA', 'SEMI_AUTOMATICA'];
const tiposCombustible = ['GASOLINA', 'ELECTRICA', 'HIBRIDA'];

export default function PublicarMotoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descripcion: '',
    precio: '',
    marca: '',
    modelo: '',
    año: new Date().getFullYear().toString(),
    cilindraje: '',
    kilometraje: '',
    color: '',
    tipo_motor: '4 Tiempos',
    transmision: 'MANUAL',
    combustible: 'GASOLINA',
    placa_termina_en: '',
    soat_hasta: '',
    tecnomecanica_hasta: '',
    ciudad: 'Armenia',
    departamento: 'Quindío',
    direccion_aproximada: '',
    whatsapp: '',
    acepta_permutas: false,
    precio_negociable: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Auto-generar título si cambian marca, modelo y año
    if (name === 'marca' || name === 'modelo' || name === 'año') {
      const marca = name === 'marca' ? value : formData.marca;
      const modelo = name === 'modelo' ? value : formData.modelo;
      const año = name === 'año' ? value : formData.año;
      
      if (marca && modelo && año) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          titulo: `${marca} ${modelo} ${año}`
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 10) {
      toast.error('Máximo 10 imágenes permitidas');
      return;
    }

    // Crear previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // crear la moto y subir imágenes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Debes subir al menos una imagen');
      return;
    }

    // 1) Crear la moto sin imágenes
    const motoData = {
      ...formData,
      precio: parseFloat(formData.precio),
      año: parseInt(formData.año),
      cilindraje: parseInt(formData.cilindraje),
      kilometraje: parseInt(formData.kilometraje),
    };

    setLoading(true);
    toast.loading('Publicando moto...');

    try {
      const createResp = await api.post('/motos', motoData);
      const motoId = createResp.data.moto.id;

      // 2) Adjuntar imágenes a la misma moto
      const imagesForm = new FormData();
      images.forEach((img) => imagesForm.append('imagenes', img));

      await api.post(`/motos/${motoId}/imagenes`, imagesForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.dismiss();
      toast.success('¡Moto publicada con éxito!');
      router.push(`/motos/${motoId}`);
    } catch (error: unknown) {
      toast.dismiss();
      console.error('Error al publicar la moto:', error);
      let msg = 'Error al publicar la moto';
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as {error?: string; message?: string};
        msg = data.error || data.message || msg;
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Publicar Moto</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de Imágenes */}
        <div className="bg-white text-gray-400 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Imágenes</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            
            {images.length < 10 && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm text-gray-500 mt-1">Agregar</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Sube hasta 10 fotos. La primera será la principal.
          </p>
        </div>

        {/* Información Básica */}
        <div className="bg-white text-gray-400 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del anuncio
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ej: Honda CB 190R 2022"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <select
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Selecciona una marca</option>
                {marcasPopulares.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ej: CB 190R"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                name="año"
                value={formData.año}
                onChange={handleInputChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (COP) *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="8500000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Describe el estado de la moto, características especiales, razón de venta, etc."
              />
            </div>
          </div>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="bg-white text-gray-400 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Especificaciones Técnicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cilindraje (cc) *
              </label>
              <input
                type="number"
                name="cilindraje"
                value={formData.cilindraje}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="190"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilometraje *
              </label>
              <input
                type="number"
                name="kilometraje"
                value={formData.kilometraje}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Rojo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Motor
              </label>
              <select
                name="tipo_motor"
                value={formData.tipo_motor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {tiposMotor.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmisión
              </label>
              <select
                name="transmision"
                value={formData.transmision}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {tiposTransmision.map(tipo => (
                  <option key={tipo} value={tipo}>
                  {tipo.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Combustible
              </label>
              <select
                name="combustible"
                value={formData.combustible}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {tiposCombustible.map(tipo => (
                  <option key={tipo} value={tipo}>
                  {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documentación */}
        <div className="bg-white text-gray-400 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Documentación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placa termina en
              </label>
              <input
                type="text"
                name="placa_termina_en"
                value={formData.placa_termina_en}
                onChange={handleInputChange}
                maxLength={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SOAT vigente hasta
              </label>
              <input
                type="date"
                name="soat_hasta"
                value={formData.soat_hasta}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tecnomecánica hasta
              </label>
              <input
                type="date"
                name="tecnomecanica_hasta"
                value={formData.tecnomecanica_hasta}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Ubicación y Contacto */}
        <div className="bg-white text-gray-400 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ubicación y Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección aproximada (opcional)
              </label>
              <input
                type="text"
                name="direccion_aproximada"
                value={formData.direccion_aproximada}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ej: Cerca al Centro Comercial Calima"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp (opcional)
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="3001234567"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="acepta_permutas"
                checked={formData.acepta_permutas}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-700 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Acepto permutas
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="precio_negociable"
                checked={formData.precio_negociable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-700 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Precio negociable
              </span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publicando...' : 'Publicar Moto'}
          </button>
        </div>
      </form>
    </div>
  );
}
