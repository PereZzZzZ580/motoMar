import Navbar from '@/components/Navbar';

export default function TramitesRuntPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Trámites RUNT</h1>
        <p>Información sobre registros y procesos necesarios ante el RUNT.</p>
      </main>
    </div>
  );
}