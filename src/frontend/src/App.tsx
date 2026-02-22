import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/views/Dashboard';
import Estudiantes from '@/views/Estudiantes';
import Analisis from '@/views/Analisis';
import Configuracion from '@/views/Configuracion';

const pageTitles: Record<string, string> = {
  inicio: 'Dashboard - Sistema de Alerta Temprana',
  estudiantes: 'Gestión de Estudiantes',
  analisis: 'Análisis y Estadísticas',
  configuracion: 'Configuración del Sistema',
};

function App() {
  const [activeTab, setActiveTab] = useState('inicio');

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <Dashboard />;
      case 'estudiantes':
        return <Estudiantes />;
      case 'analisis':
        return <Analisis />;
      case 'configuracion':
        return <Configuracion />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header title={pageTitles[activeTab]} />

        {/* Page Content */}
        <main className="overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
