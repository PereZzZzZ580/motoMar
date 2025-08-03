'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link' ;   
import { useRouter } from 'next/navigation' ;
import api, { authAPI, auth } from '@/lib/api' ;

export default function ConfiguracionPage() {
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [cargandoPassword, setCargandoPassword] = useState(false);
  const [eliminandoCuenta, setEliminandoCuenta] = useState(false);

  const [emailsHabilitados, setEmailsHabilitados] = useState(true);
  const [alertaMensajes, setAlertaMensajes] = useState(true);
  const [alertaFavoritos, setAlertaFavoritos] = useState(true);
  const [alertaComentarios, setAlertaComentarios] = useState(true);

  const [modoOscuro, setModoOscuro] = useState(false);
  const [idioma, setIdioma] = useState('es');
  const [ubicacionPredeterminada, setUbicacionPredeterminada] = useState('');

  const router = useRouter();

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoPassword(true);
    try {
      await api.post('/auth/change-password', { passwordActual, passwordNueva });
      toast.success('Contraseña actualizada');
      setPasswordActual('');
      setPasswordNueva('');
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      let message = 'No se pudo cambiar la contraseña';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      }
      toast.error(message);
    } finally {
      setCargandoPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('¿Seguro que deseas eliminar tu cuenta?')) return;
    setEliminandoCuenta(true);
    try {
      await api.delete('/auth/account');
      toast.success('Cuenta eliminada');
      await authAPI.logout();
      auth.clearAuth();
      router.push('/');
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      toast.error('No se pudo eliminar la cuenta');
    } finally {
      setEliminandoCuenta(false);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    auth.clearAuth();
    router.push('/');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-700">Configuración</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Seguridad y Privacidad</h2>
        <form onSubmit={handleSubmitPassword} className="space-y-4">
          <div>
            <label htmlFor="passwordActual" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña Actual
            </label>
            <input
              id="passwordActual"
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="passwordNueva" className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              id="passwordNueva"
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={cargandoPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            {cargandoPassword ? 'Guardando...' : 'Guardar Contraseña'}
          </button>
        </form>
        <button
          onClick={handleDeleteAccount}
          disabled={eliminandoCuenta}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
        >
          {eliminandoCuenta ? 'Eliminando...' : 'Eliminar Cuenta'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg"
        >
          Cerrar Sesión
        </button>
        <div className="flex space-x-4">
          <Link href="/privacidad" className="text-blue-600 hover:underline">
            Política de Privacidad
          </Link>
          <Link href="/terminos" className="text-blue-600 hover:underline">
            Términos y Condiciones
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Notificaciones</h2>
        <div className="space-y-2">
          <label className="flex items-center text-gray-500">
            <input
              type="checkbox"
              checked={emailsHabilitados}
              onChange={(e) => setEmailsHabilitados(e.target.checked)}
              className="mr-2 "
            />
            Recibir correos electrónicos
          </label>
          <label className="flex items-center text-gray-500">
            <input
              type="checkbox"
              checked={alertaMensajes}
              onChange={(e) => setAlertaMensajes(e.target.checked)}
              className="mr-2"
            />
            Alertas de mensajes nuevos
          </label>
          <label className="flex items-center text-gray-500">
            <input
              type="checkbox"
              checked={alertaFavoritos}
              onChange={(e) => setAlertaFavoritos(e.target.checked)}
              className="mr-2"
            />
            Alertas de favoritos
          </label>
          <label className="flex items-center text-gray-500">
            <input
              type="checkbox"
              checked={alertaComentarios}
              onChange={(e) => setAlertaComentarios(e.target.checked)}
              className="mr-2"
            />
            Alertas de comentarios
          </label>
        </div>
        </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Preferencias</h2>
        <div className="space-y-4">
          <label className="flex items-center text-gray-500">
            <input
              type="checkbox"
              checked={modoOscuro}
              onChange={(e) => setModoOscuro(e.target.checked)}
              className="mr-2"
            />
            Tema oscuro
          </label>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
            <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-lg "
            >
              <option value="es" className="text-gray-500">Español</option>
              <option value="en" className="text-gray-500">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Predeterminada</label>
            <input
              type="text"
              value={ubicacionPredeterminada}
              onChange={(e) => setUbicacionPredeterminada(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>       
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Otros</h2>
        <div className="space-y-2">
          <button
            onClick={() => toast('Funcionalidad próximamente')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg"
          >
            Configurar cuenta de vendedor
          </button>
          <button
            onClick={() => toast('Funcionalidad próximamente')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg"
          >
            Vincular redes sociales
          </button>
          <button
            onClick={() => toast('Funcionalidad próximamente')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg"
          >
            Ver dispositivos activos
          </button>
        </div>
      </section>  
    </div>
  );
}