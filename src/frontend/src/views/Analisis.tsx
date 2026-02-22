import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { getAnalytics } from '@/api/client';
import type { AnalyticsResponse } from '@/api/client';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

export default function Analisis() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar analíticas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Cargando analíticas...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || 'Error desconocido'}
        </div>
      </div>
    );
  }

  const riskDist = data.risk_distribution;
  const totalStudents = data.total_students;
  const highPct = totalStudents > 0 ? ((riskDist.high / totalStudents) * 100).toFixed(1) : '0';
  const medPct = totalStudents > 0 ? ((riskDist.medium / totalStudents) * 100).toFixed(1) : '0';

  const factorsForChart = data.contributing_factors.map((f, i) => ({
    name: f.name,
    value: f.value,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Análisis y Estadísticas</h2>
          <p className="text-gray-500">Visualización de datos reales del dataset — {totalStudents.toLocaleString()} estudiantes</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Prob. Promedio de Riesgo</p>
                <p className="text-2xl font-bold text-red-500">{data.avg_probability}%</p>
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
                <p className="text-sm text-gray-500">Total Evaluaciones</p>
                <p className="text-2xl font-bold text-blue-600">{totalStudents.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Alto Riesgo</p>
                <p className="text-2xl font-bold text-red-600">{riskDist.high.toLocaleString()}</p>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {highPct}% del total
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Riesgo Moderado</p>
                <p className="text-2xl font-bold text-yellow-600">{riskDist.medium.toLocaleString()}</p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {medPct}% del total
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by Degree */}
        <Card>
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg">Distribución de Riesgo por Programa</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.risk_by_degree} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="degree" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="low" name="Bajo" stackId="a" fill="#22c55e" />
                <Bar dataKey="medium" name="Moderado" stackId="a" fill="#eab308" />
                <Bar dataKey="high" name="Alto" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk by Pressure */}
        <Card>
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg">Tasa de Depresión por Presión Académica</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.risk_by_pressure} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="pressure" tick={{ fontSize: 12 }} label={{ value: 'Nivel de Presión', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: '% Depresión', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="depression_rate" name="Tasa Depresión (%)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contributing Factors */}
        <Card>
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg">Factores de Riesgo (conteo)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={factorsForChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {factorsForChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg">Estudiantes con Mayor Riesgo</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {data.recent_alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.risk_level === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}
                    >
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          alert.risk_level === 'high' ? 'text-red-500' : 'text-yellow-500'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">ID: {alert.id} — {alert.degree}</p>
                      <p className="text-sm text-gray-500">{alert.main_factor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      className={
                        alert.risk_level === 'high'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }
                    >
                      {alert.probability.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
