import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Download, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { getStudents } from '@/api/client';
import type { StudentRecord, StudentsResponse } from '@/api/client';

export default function Estudiantes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentsResponse | null>(null);
  const [error, setError] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getStudents({
        search: searchTerm || undefined,
        risk_filter: filterRisk,
        page,
        page_size: 30,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterRisk, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, searchTerm ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchStudents, searchTerm]);

  const handleExportCSV = () => {
    if (!data || !data.students || data.students.length === 0) return;
    
    // Crear cabeceras
    const headers = ['ID', 'Género', 'Edad', 'Programa', 'CGPA', 'Presión Académica', 'Probabilidad', 'Nivel de Riesgo'];
    
    // Crear filas
    const rows = data.students.map(s => [
      s.id,
      s.gender,
      s.age,
      s.degree,
      s.cgpa,
      s.academic_pressure,
      `${s.probability}%`,
      s.risk_level
    ]);
    
    // Unir cabeceras y filas con comas y saltos de línea
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `estudiantes_riesgo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge className="bg-red-500 text-white">Alto Riesgo</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">Riesgo Moderado</Badge>;
      default:
        return <Badge className="bg-green-500 text-white">Bajo Riesgo</Badge>;
    }
  };

  const stats = data?.stats ?? { total: 0, high_risk: 0, medium_risk: 0, low_risk: 0 };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Estudiantes</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">&#128101;</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Alto Riesgo</p>
                <p className="text-2xl font-bold text-red-500">{stats.high_risk.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Riesgo Moderado</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.medium_risk.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bajo Riesgo</p>
                <p className="text-2xl font-bold text-green-500">{stats.low_risk.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">&#10003;</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">Lista de Estudiantes</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar por ID..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'low', 'medium', 'high'] as const).map((risk) => (
                <button
                  key={risk}
                  onClick={() => { setFilterRisk(risk); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterRisk === risk
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {risk === 'all' ? 'Todos' : risk === 'low' ? 'Bajo' : risk === 'medium' ? 'Medio' : 'Alto'}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-500">Cargando estudiantes...</span>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Género</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Edad</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Programa</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">CGPA</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Presión Acad.</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prob. Riesgo</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nivel de Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.students ?? []).map((student: StudentRecord) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {student.id.slice(-2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-800">{student.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{student.gender === 'Male' ? 'M' : 'F'}</td>
                        <td className="py-3 px-4 text-gray-600">{student.age}</td>
                        <td className="py-3 px-4 text-gray-600">{student.degree}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              student.cgpa >= 7 ? 'text-green-600' : student.cgpa >= 5 ? 'text-yellow-600' : 'text-red-600'
                            }`}
                          >
                            {student.cgpa.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{student.academic_pressure}/5</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            student.probability >= 70 ? 'text-red-600' : student.probability >= 40 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {student.probability}%
                          </span>
                        </td>
                        <td className="py-3 px-4">{getRiskBadge(student.risk_level)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data && data.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Página {data.page} de {data.total_pages} ({stats.total.toLocaleString()} registros)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.total_pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
