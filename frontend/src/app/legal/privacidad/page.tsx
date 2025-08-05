import Navbar from '@/components/Navbar';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Política de Privacidad</h1>
        <p>Conoce cómo protegemos y tratamos tus datos personales.</p>
      </main>
    </div>
  );
}