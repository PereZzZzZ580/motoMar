import Navbar from '@/components/Navbar';

export default function BusquedaAvanzadaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 text-gray-700">
        <h1 className="text-3xl font-bold mb-4">Búsqueda Avanzada</h1>
        <p>
          Aquí podrás aplicar filtros detallados como marca, precio, año y
          ubicación para encontrar la moto ideal.
        </p>
      </main>
    </div>
  );
}