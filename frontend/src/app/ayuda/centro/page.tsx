import Navbar from '@/components/Navbar';

export default function CentroAyudaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Centro de Ayuda</h1>
        <p>Resuelve tus dudas con nuestras preguntas frecuentes y guías.</p>
      </main>
    </div>
  );
}