import { Home, Users, BarChart3, Settings, GraduationCap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'estudiantes', label: 'Estudiantes', icon: Users },
  { id: 'analisis', label: 'Análisis', icon: BarChart3 },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-800 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-slate-800" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Universidad</h1>
            <p className="text-slate-400 text-xs">Bienestar Estudiantil</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs text-center">
          © 2026 Sistema de Alerta Temprana
        </p>
      </div>
    </aside>
  );
}
