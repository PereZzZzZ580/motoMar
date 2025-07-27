 // src/components/AuthForm.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { authAPI, auth } from '@/lib/api';

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    ciudad: '',
    departamento: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (type === 'login') {
        // Login
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });

        // Guardar token y usuario
        auth.setAuth(response.auth.token, response.user);
        
        setSuccess('¡Login exitoso! Redirigiendo...');
        
        // Redirigir al dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);

      } else {
        // Registro
        const response = await authAPI.register({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono || undefined,
          ciudad: formData.ciudad || undefined,
          departamento: formData.departamento || undefined
        });

        // Guardar token y usuario
        auth.setAuth(response.auth.token, response.user);
        
        setSuccess('¡Registro exitoso!');
        setRegistroExitoso(true);
      }
    }  catch (err) {
  console.error('Error en autenticación:', err);
  
  // Manejo de errores con tipado correcto
  let errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
  
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosError = err as { response?: { data?: { message?: string; error?: string } } };
    if (axiosError.response?.data?.message) {
      errorMessage = axiosError.response.data.message;
    } else if (axiosError.response?.data?.error) {
      errorMessage = axiosError.response.data.error;
    }
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  
  setError(errorMessage);

} finally {
      setLoading(false);
    }
  };

  const isLogin = type === 'login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-700 mb-2">
            🏍️ MotoMar
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Inicia Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin 
              ? 'Accede a tu cuenta para gestionar tus motos'
              : 'Únete al marketplace más seguro de motos'
            }
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre y Apellido (solo registro) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required={!isLogin}
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    required={!isLogin}
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder={isLogin ? "Tu contraseña" : "Mínimo 8 caracteres"}
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Debe contener mayúsculas, minúsculas, números y símbolos
                </p>
              )}
            </div>

            {/* Campos adicionales (solo registro) */}
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="3001234567"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      id="ciudad"
                      name="ciudad"
                      type="text"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Armenia"
                    />
                  </div>
                  <div>
                    <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    <select
                      id="departamento"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Antioquia">Antioquia</option>
                      <option value="Bogotá D.C.">Bogotá D.C.</option>
                      <option value="Valle del Cauca">Valle del Cauca</option>
                      <option value="Cundinamarca">Cundinamarca</option>
                      <option value="Quindío">Quindío</option>
                      <option value="Risaralda">Risaralda</option>
                      <option value="Caldas">Caldas</option>
                      <option value="Atlántico">Atlántico</option>
                      <option value="Santander">Santander</option>
                      <option value="Norte de Santander">Norte de Santander</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Mensajes de error y éxito */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
               <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg space-y-2">
                <div>{success}</div>
                {registroExitoso && (
                  <div className="flex justify-center space-x-4">
                    <Link href="/" className="text-blue-700 hover:text-blue-800 font-medium">
                      Ir a Inicio
                    </Link>
                    <span>|</span>
                    <Link href="/dashboard" className="text-blue-700 hover:text-blue-800 font-medium">
                      Ir al Dashboard
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800 active:bg-blue-900'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                </span>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </button>

            {/* Link para cambiar entre login/registro */}
            <div className="text-center">
              <p className="text-gray-600">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <a
                  href={isLogin ? '/auth/register' : '/auth/login'}
                  className="ml-2 text-blue-700 hover:text-blue-800 font-medium"
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          Al continuar, aceptas nuestros{' '}
          <a href="#" className="text-blue-700 hover:text-blue-800">
            Términos de Uso
          </a>{' '}
          y{' '}
          <a href="#" className="text-blue-700 hover:text-blue-800">
            Política de Privacidad
          </a>
        </div>
      </div>
    </div>
  );
}
