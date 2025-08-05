'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function ContactoPage() {
  const [formulario, setFormulario] = useState({ nombre: '', email: '', mensaje: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se podría enviar la información al backend
    alert('Mensaje enviado');
    setFormulario({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Contacto</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={formulario.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formulario.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              required
              value={formulario.mensaje}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Enviar</button>
        </form>
      </main>
    </div>
  );
}