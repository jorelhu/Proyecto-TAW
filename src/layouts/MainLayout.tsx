import Navbar from "../shared/components/Navbar";
import { Outlet } from "react-router-dom";



const MainLayout = () => {
  return (
    // Fondo de color piedra muy sutil para dar calidez y sofisticación
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />
      
      {/* El contenedor del contenido principal. 
         - Usamos un ancho máximo (max-w-7xl) para evitar que se extienda demasiado.
         - 'mx-auto' centra el contenedor.
         - Padding horizontal (px-4 sm:px-6 lg:px-8) y vertical (py-12 sm:py-16) generoso.
      */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;