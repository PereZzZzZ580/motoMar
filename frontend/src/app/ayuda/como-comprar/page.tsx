import Navbar from '@/components/Navbar';

export default function ComoComprarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Cómo Comprar</h1>
        <p>Guía paso a paso para adquirir tu moto de forma segura.</p>
      </main>
    </div>
  );
}