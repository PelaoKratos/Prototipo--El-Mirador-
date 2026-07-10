import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { formatCurrency, formatDate } from '../../lib/utils';
import { mockPayments } from '../../data/mockData';
import { CreditCard, Receipt, AlertCircle, Download, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const OwnerDashboard = () => {
  const userPayments = mockPayments.filter(p => p.residentId === '1');
  const currentDebt = userPayments.find(p => p.status !== 'paid' && p.month === '2026-06');
  const lastPayment = userPayments.find(p => p.status === 'paid');

  const handlePayment = () => {
    toast.success('Redirigiendo al sistema de pago...');
  };

  const handleDownloadReceipt = (paymentId: string) => {
    toast.success('Recibo descargado correctamente');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Mi Dashboard</h1>
        <p className="text-muted-foreground">Departamento 301</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deuda Actual</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {currentDebt ? formatCurrency(currentDebt.amount) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentDebt ? `Mes: ${currentDebt.month}` : 'Sin deudas pendientes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Pago</CardTitle>
            <Receipt className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {lastPayment ? formatCurrency(lastPayment.amount) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastPayment?.paidAt ? formatDate(lastPayment.paidAt) : 'No hay pagos registrados'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Vencimiento</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">15 Jun 2026</div>
            <p className="text-xs text-muted-foreground">Gastos Comunes Junio</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment CTA */}
      {currentDebt && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-medium">Pago Pendiente</h3>
                <p className="text-sm text-muted-foreground">
                  Tienes un pago pendiente de {formatCurrency(currentDebt.amount)}
                </p>
              </div>
            </div>
            <Button onClick={handlePayment} size="lg">
              <CreditCard className="mr-2 h-4 w-4" />
              Pagar Ahora
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Pago</TableHead>
                <TableHead className="text-right">Recibo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.month}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
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
                  <TableCell>
                    {payment.paidAt ? formatDate(payment.paidAt) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.status === 'paid' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment.id)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Descargar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nuevo recibo disponible</p>
                <p className="text-sm text-muted-foreground">
                  Tu recibo de Mayo 2026 está disponible para descargar
                </p>
                <p className="text-xs text-muted-foreground mt-1">Hace 2 días</p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Recordatorio de pago</p>
                <p className="text-sm text-muted-foreground">
                  Los gastos comunes de Junio vencen en 6 días
                </p>
                <p className="text-xs text-muted-foreground mt-1">Hace 5 días</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
