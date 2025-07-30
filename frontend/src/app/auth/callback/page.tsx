"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, auth } from '@/lib/api';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Procesando autenticación...');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setError('Token no proporcionado');
      return;
    }

    localStorage.setItem('token', token);

    authAPI
      .getProfile()
      .then((user) => {
        auth.setAuth(token, user);
        setMessage('Autenticación exitosa. Redirigiendo...');
        setTimeout(() => router.push('/dashboard'), 1500);
      })
      .catch(() => {
        setError('No se pudo obtener la información del usuario');
      });
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700 font-medium">{message}</p>
    </div>
  );
}