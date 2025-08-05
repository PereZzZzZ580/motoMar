import Navbar from '@/components/Navbar';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Términos de Uso</h1>
        <p>Consulta las condiciones para utilizar la plataforma MotoMar.</p>
      </main>
    </div>
  );
}