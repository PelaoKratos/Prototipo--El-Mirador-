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
import { Download, DollarSign, Receipt, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

export const TenantDashboard = () => {
  const userPayments = mockPayments.filter(p => p.residentId === '2');
  const currentDebt = userPayments.find(p => p.status !== 'paid' && p.month === '2026-06');

  const handleDownloadReceipt = (paymentId: string) => {
    toast.success('Recibo descargado correctamente');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Portal de Arrendatario</h1>
        <p className="text-muted-foreground">Departamento 402 - María González</p>
      </div>

      {/* Info Banner */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Acceso como Arrendatario</h3>
            <p className="text-sm text-muted-foreground">
              Estás accediendo con un código de arrendatario. Tienes acceso limitado a la información del departamento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2">
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
            <CardTitle className="text-sm font-medium">Estado de Cuenta</CardTitle>
            <Receipt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {currentDebt ? 'Pendiente' : 'Al día'}
            </div>
            <p className="text-xs text-muted-foreground">
              {userPayments.length} registros en historial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Notice */}
      {currentDebt && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Pago Pendiente Detectado</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Hay un pago pendiente de {formatCurrency(currentDebt.amount)} para el mes de {currentDebt.month}.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Nota:</strong> Si tienes autorización del propietario para realizar pagos, contacta con la administración.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos del Departamento</CardTitle>
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
                          : 'warning'
                      }
                    >
                      {payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
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
                        Ver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Administración</p>
              <p className="font-medium">admin@elmirador.cl</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">+56 2 2345 6789</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horario de Atención</p>
              <p className="font-medium">Lunes a Viernes, 9:00 - 18:00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
