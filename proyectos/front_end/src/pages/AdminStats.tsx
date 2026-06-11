import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { statsService,type StatsResponse } from '../services/stats.service';
import { ChevronLeft } from 'lucide-react';

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statsService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-8">{error}</div>;
  }

  if (!stats) return null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Cabecera con botón de volver */}
        <div className="mb-8 flex items-center justify-between border-b border-emerald-100 pb-4">
          <div>
            <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-emerald-900">Estadísticas y Gráficos</h1>
            <p className="text-xs uppercase tracking-widest text-emerald-600">Análisis de ventas y productos</p>
          </div>
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-xs uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Volver al Panel</span>
          </Link>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Órdenes</h3>
            <p className="text-3xl font-bold text-emerald-700">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Ingresos Totales</h3>
            <p className="text-3xl font-bold text-emerald-700">Bs{stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Valor Promedio por Orden</h3>
            <p className="text-3xl font-bold text-emerald-700">Bs{stats.averageOrderValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Gráfico de líneas */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-light text-emerald-800 mb-4">Ventas Diarias (últimos 30 días)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stats.dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="total" stroke="#10b981" name="Ingresos (€)" />
              <Line yAxisId="right" type="monotone" dataKey="count" stroke="#3b82f6" name="N° Órdenes" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de barras */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-light text-emerald-800 mb-4">Productos Más Vendidos</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="productName" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalQuantity" fill="#10b981" name="Cantidad Vendida" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de pastel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-light text-emerald-800 mb-4">Ingresos por Producto</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={stats.topProducts}
                dataKey="totalRevenue"
                nameKey="productName"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {stats.topProducts.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    
  );
};

export default AdminStats;