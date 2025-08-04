'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const modoGuardado = localStorage.getItem('modoOscuro') === 'true';
    setModoOscuro(modoGuardado);
    if (modoGuardado) {
        document.documentElement.classList.toggle('modo-oscuro', modoGuardado);
    }
  }, []);

  const manejarModoOscuro = (activo: boolean) => {
    setModoOscuro(activo);
    if (activo) {
    document.documentElement.classList.toggle('modo-oscuro', activo);
    localStorage.setItem('modoOscuro', 'true');
    } else {
    document.documentElement.classList.remove('modo-oscuro');
    localStorage.setItem('modoOscuro', 'false');
    }
  };

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
    <div className="p-6 max-w-3xl mx-auto space-y-8 transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-500 transition-colors duration-300">
        Configuración
      </h1>

      <section className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
          Seguridad y Privacidad
        </h2>
        <form onSubmit={handleSubmitPassword} className="space-y-4">
          <div>
            <label htmlFor="passwordActual" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña Actual
            </label>
            <input
              id="passwordActual"
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                text-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                transition-all duration-300"
            />
          </div>
          {/* Similar update for passwordNueva input */}
          <button
            type="submit"
            disabled={cargandoPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300"
          >
            {cargandoPassword ? 'Guardando...' : 'Guardar Contraseña'}
          </button>
        </form>
        
        <button
          onClick={handleDeleteAccount}
          disabled={eliminandoCuenta}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors duration-300"
        >
          {eliminandoCuenta ? 'Eliminando...' : 'Eliminar Cuenta'}
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
            text-gray-700 dark:text-gray-200 py-2 rounded-lg transition-colors duration-300"
        >
          Cerrar Sesión
        </button>
      </section>

      <section className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
          Notificaciones
        </h2>
        <div className="space-y-2">
          {/* Update each checkbox label with similar dark mode classes */}
          <label className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <input
              type="checkbox"
              checked={emailsHabilitados}
              onChange={(e) => setEmailsHabilitados(e.target.checked)}
              className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 
                transition-colors duration-300"
            />
            Recibir correos electrónicos
          </label>
          {/* Similar updates for other checkboxes */}
        </div>
      </section>

      <section className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
          Preferencias
        </h2>
        <div className="space-y-4">
          <label className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <input
              type="checkbox"
              checked={modoOscuro}
              onChange={(e) => manejarModoOscuro(e.target.checked)}
              className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 
                transition-colors duration-300"
            />
            Tema oscuro
          </label>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Idioma
            </label>
            <select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-300"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ubicación Predeterminada
            </label>
            <input
              type="text"
              value={ubicacionPredeterminada}
              onChange={(e) => setUbicacionPredeterminada(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-300"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
          Otros
        </h2>
        <div className="space-y-2">
          <button
            onClick={() => toast('Funcionalidad próximamente')}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
              text-gray-700 dark:text-gray-200 py-2 rounded-lg transition-colors duration-300"
          >
            Configurar cuenta de vendedor
          </button>
          {/* Similar updates for other buttons */}
        </div>
      </section>
    </div>
  );
}