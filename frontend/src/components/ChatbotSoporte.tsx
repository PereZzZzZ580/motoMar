"use client";

import { useState } from 'react';

interface Mensaje {
  autor: 'usuario' | 'bot';
  texto: string;
}

export default function ChatbotSoporte() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [entrada, setEntrada] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async () => {
    if (!entrada.trim()) return;
    const nuevo: Mensaje = { autor: 'usuario', texto: entrada };
    const historial = [...mensajes, nuevo];
    setMensajes(historial);
    setEntrada('');
    setCargando(true);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: historial }),
      });
      if (!resp.ok) {
        const texto = await resp.text();
        throw new Error(texto);
      }
      const datos = await resp.json();
      setMensajes((m) => [...m, { autor: 'bot', texto: datos.respuesta }]);
    } catch (error) {
      console.error('Error al consultar /api/chat:', error);
      setMensajes((m) => [...m, { autor: 'bot', texto: 'Error al obtener respuesta' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="border rounded-lg p-4 bg-white shadow">
        <div className="h-64 overflow-y-auto mb-4">
          {mensajes.map((m, i) => (
            <div key={i} className={`mb-2 ${m.autor === 'usuario' ? 'text-right' : 'text-left'}`}>
              <span
                className={`inline-block px-2 py-1 rounded-lg ${
                  m.autor === 'usuario'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {m.texto}
              </span>
            </div>
          ))}
          {cargando && <p className="text-sm text-gray-500">Pensando...</p>}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviarMensaje();
          }}
          className="flex gap-2"
        >
          <input
            className="flex-1 border rounded px-2 py-1"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            placeholder="Escribe tu pregunta..."
          />
          <button type="submit" className="bg-blue-700 text-white px-3 py-1 rounded">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}