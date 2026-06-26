import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { DollarSign, Users, AlertCircle, TrendingUp, Plus, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../../context/DataContext';

export const AdminDashboard = () => {
  const { payments, claims, residents } = useData();
  const totalCollected = payments
    .filter(p => p.status === 'paid' && p.month === '2026-06')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDebt = payments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeResidents = residents.filter((r) => r.status === 'active').length;
  const inactiveResidents = residents.filter((r) => r.status === 'inactive').length;
  const openClaims = claims.filter(c => c.status !== 'resolved').length;

  const recentPayments = payments.slice(0, 5);
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const paidCount = payments.filter(p => p.status === 'paid').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  const monthlyData = [
    { month: 'Ene', recaudado: 410000, deuda: 85000 },
    { month: 'Feb', recaudado: 398000, deuda: 82000 },
    { month: 'Mar', recaudado: 420000, deuda: 80000 },
    { month: 'Abr', recaudado: 405000, deuda: 90000 },
    { month: 'May', recaudado: 415000, deuda: 75000 },
    { month: 'Jun', recaudado: totalCollected, deuda: totalDebt },
  ];

  const morosityData = [
    { name: 'Al día', value: paidCount, color: '#34D399' },
    { name: 'Pendiente', value: pendingCount, color: '#FBBF24' },
    { name: 'Moroso', value: overdueCount, color: '#F87171' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general de El Mirador</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generar Informe
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Gasto
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(totalCollected)}</div>
            <p className="text-xs text-muted-foreground">Este mes (Junio 2026)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deuda Pendiente</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status !== 'paid').length} pago(s) pendiente(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Residentes Activos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{activeResidents}</div>
            <p className="text-xs text-muted-foreground">{inactiveResidents} inactivo(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reclamos Abiertos</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{openClaims}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recaudación Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243244" />
                <XAxis dataKey="month" stroke="#93A4B8" />
                <YAxis stroke="#93A4B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#243244',
                    color: '#E5ECF5',
                  }}
                  cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                />
                <Bar dataKey="recaudado" fill="#38BDF8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Pagos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={morosityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {morosityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#243244',
                    color: '#E5ECF5',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Residente</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.residentName}</div>
                        <div className="text-sm text-muted-foreground">
                          Depto {payment.apartmentNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === 'paid'
                            ? 'success'
                            : payment.status === 'overdue'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {payment.status === 'paid'
                          ? 'Pagado'
                          : payment.status === 'overdue'
                          ? 'Vencido'
                          : 'Pendiente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Residentes Morosos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Residente</TableHead>
                  <TableHead>Deuda</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overduePayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.residentName}</div>
                        <div className="text-sm text-muted-foreground">
                          Depto {payment.apartmentNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-destructive">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Notificar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
