import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar estudiante..."
            className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">Dr. Pineda</p>
            <p className="text-xs text-gray-500">Psicólogo</p>
          </div>
        </div>
      </div>
    </header>
  );
}
