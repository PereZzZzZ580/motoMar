import Navbar from '@/components/Navbar';

export default function ComoVenderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Cómo Vender</h1>
        <p>Aprende a publicar y gestionar tus motos de manera efectiva.</p>
      </main>
    </div>
  );
}