import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { formatCurrency } from '../../lib/utils';
import { mockPayments } from '../../data/mockData';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';

export const ReportsPage = () => {
  const monthlyCollection = [
    { month: 'Ene', recaudado: 410000, meta: 425000 },
    { month: 'Feb', recaudado: 398000, meta: 425000 },
    { month: 'Mar', recaudado: 420000, meta: 425000 },
    { month: 'Abr', recaudado: 405000, meta: 425000 },
    { month: 'May', recaudado: 415000, meta: 425000 },
    { month: 'Jun', recaudado: 170000, meta: 425000 },
  ];

  const expensesByCategory = [
    { category: 'Mantenimiento', amount: 180000, color: '#2563EB' },
    { category: 'Agua', amount: 120000, color: '#22C55E' },
    { category: 'Luz Común', amount: 85000, color: '#F59E0B' },
    { category: 'Seguridad', amount: 150000, color: '#EF4444' },
    { category: 'Limpieza', amount: 95000, color: '#8B5CF6' },
  ];

  const morosityByApartment = [
    { apartment: '205', debt: 85000, months: 1 },
    { apartment: '402', debt: 85000, months: 1 },
    { apartment: '503', debt: 170000, months: 2 },
  ];

  const collectionRate = [
    { month: 'Ene', tasa: 96.5 },
    { month: 'Feb', tasa: 93.6 },
    { month: 'Mar', tasa: 98.8 },
    { month: 'Abr', tasa: 95.3 },
    { month: 'May', tasa: 97.6 },
    { month: 'Jun', tasa: 40.0 },
  ];

  const handleExportPDF = () => {
    toast.success('Informe exportado como PDF');
  };

  const handleExportExcel = () => {
    toast.success('Informe exportado como Excel');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Informes Financieros</h1>
          <p className="text-muted-foreground">
            Análisis detallado de ingresos, gastos y morosidad
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPIs Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recaudación Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(2418000)}</div>
            <p className="text-xs text-success">+8.5% vs año anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(630000)}</div>
            <p className="text-xs text-muted-foreground">Último mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Cobro Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">95.2%</div>
            <p className="text-xs text-success">+2.3% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Morosidad Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(340000)}</div>
            <p className="text-xs text-destructive">3 departamentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Recaudación Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyCollection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="recaudado" name="Recaudado" fill="#2563EB" radius={[8, 8, 0, 0]} />
                <Bar dataKey="meta" name="Meta" fill="#E2E8F0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasa de Cobro Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={collectionRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tasa"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Desglose de Morosidad por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={morosityByApartment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" />
                <YAxis dataKey="apartment" type="category" stroke="#64748B" />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="debt" fill="#EF4444" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
