import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { statsService, type StatsResponse } from '../services/stats.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const generatePDF = async () => {
    if (!reportRef.current) {
      alert('No se encontró el contenido para generar el PDF.');
      return;
    }
    setGeneratingPdf(true);
    try {
      // Pequeña pausa para garantizar que todos los gráficos están renderizados
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,          // Para imágenes externas
        allowTaint: false,
        // Mejorar captura de SVG (Recharts)
        onclone: (clonedDoc, element) => {
          // Opcional: forzar estilos en el clon si fuera necesario
          const svgs = element.querySelectorAll('svg');
          svgs.forEach(svg => {
            svg.setAttribute('width', String(svg.clientWidth));
            svg.setAttribute('height', String(svg.clientHeight));
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const imgWidth = 210; // mm
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 0;
      let remainingHeight = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight;

      while (remainingHeight > 0) {
        position = remainingHeight - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
      }

      pdf.save(`reporte_estadisticas_${new Date().toISOString().slice(0,19)}.pdf`);
    } catch (error) {
      console.error('Error detallado al generar PDF:', error);
      alert(`Ocurrió un error al generar el PDF: ${error instanceof Error ? error.message : error}`);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
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
        {/* Cabecera con botón de volver y botón PDF */}
        <div className="mb-8 flex items-center justify-between border-b border-emerald-100 pb-4 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-emerald-900">
              Estadísticas y Gráficos
            </h1>
            <p className="text-xs uppercase tracking-widest text-emerald-600">
              Análisis de ventas y productos
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generatePDF}
              disabled={generatingPdf}
              className="flex items-center space-x-2 bg-emerald-700 px-4 py-2 text-xs uppercase tracking-widest text-white rounded hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{generatingPdf ? 'Generando PDF...' : 'Reporte PDF'}</span>
            </button>
            <Link
              to="/admin"
              className="flex items-center space-x-2 text-xs uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Volver al Panel</span>
            </Link>
          </div>
        </div>

        {/* Contenido que se capturará para el PDF */}
        <div ref={reportRef} className="bg-white p-6 rounded-lg shadow-sm">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-50 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Total Órdenes</h3>
              <p className="text-3xl font-bold text-emerald-700">{stats.totalOrders}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Ingresos Totales</h3>
              <p className="text-3xl font-bold text-emerald-700">Bs{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Valor Promedio por Orden</h3>
              <p className="text-3xl font-bold text-emerald-700">Bs{stats.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>

          {/* Gráfico de ventas diarias */}
          <div className="mb-8">
            <h2 className="text-xl font-light text-emerald-800 mb-4">Ventas Diarias (últimos 30 días)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={stats.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="total" stroke="#10b981" name="Ingresos (Bs)" />
                <Line yAxisId="right" type="monotone" dataKey="count" stroke="#3b82f6" name="N° Órdenes" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de productos más vendidos */}
          <div className="mb-8">
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

          {/* Gráfico de ingresos por producto */}
          <div className="mb-8">
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

          {/* Tabla resumen de productos */}
          {stats.topProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-light text-emerald-800 mb-4">Detalle de Productos</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-right">Cantidad vendida</th>
                      <th className="px-4 py-2 text-right">Ingresos (Bs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((p) => (
                      <tr key={p.productId} className="border-t">
                        <td className="px-4 py-2">{p.productName}</td>
                        <td className="px-4 py-2 text-right">{p.totalQuantity}</td>
                        <td className="px-4 py-2 text-right">{p.totalRevenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;