import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { Payment } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'sonner';
import { useData } from '../../context/DataContext';

export const PaymentsPage = () => {
  const { payments, updatePayment } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [confirmData, setConfirmData] = useState({
    method: 'transfer' as 'transfer' | 'cash' | 'check',
    paidAt: new Date().toISOString().split('T')[0],
  });

  const totalCollected = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleConfirmPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  const handleSaveConfirmation = () => {
    if (selectedPayment) {
      updatePayment(selectedPayment.id, {
        status: 'paid',
        paidAt: new Date(confirmData.paidAt),
        method: confirmData.method,
      });
      toast.success('Pago confirmado correctamente');
    }
    setIsDialogOpen(false);
  };

  const handleGenerateReceipt = (payment: Payment) => {
    toast.success('Recibo generado correctamente');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Gestión de Pagos</h1>
        <p className="text-muted-foreground">
          Administra los pagos de gastos comunes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-success">
              {formatCurrency(totalCollected)}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === 'paid').length} pagos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-warning">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status !== 'paid').length} pagos pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Cobro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {Math.round((payments.filter(p => p.status === 'paid').length / payments.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Del total de cuotas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Residente</TableHead>
              <TableHead>Mes</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Pago</TableHead>
              <TableHead>Método</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{payment.residentName}</div>
                    <div className="text-sm text-muted-foreground">
                      Depto {payment.apartmentNumber}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{payment.month}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.concept || 'Gastos Comunes'}
                    </div>
                  </div>
                </TableCell>
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
                <TableCell>
                  {payment.method
                    ? payment.method === 'transfer'
                      ? 'Transferencia'
                      : payment.method === 'cash'
                      ? 'Efectivo'
                      : 'Cheque'
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {payment.status !== 'paid' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmPayment(payment)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Confirmar
                      </Button>
                    )}
                    {payment.status === 'paid' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateReceipt(payment)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Recibo
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Pago</DialogTitle>
            <DialogDescription>
              Registra la confirmación del pago recibido
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Residente</p>
                  <p className="font-medium">{selectedPayment.residentName}</p>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted-foreground">Monto</p>
                  <p className="text-lg font-semibold">{formatCurrency(selectedPayment.amount)}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="paidAt">Fecha de Pago</Label>
                  <Input
                    id="paidAt"
                    type="date"
                    value={confirmData.paidAt}
                    onChange={(e) =>
                      setConfirmData({ ...confirmData, paidAt: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="method">Método de Pago</Label>
                  <select
                    id="method"
                    className="flex h-10 w-full rounded-lg border border-input bg-input-background px-3 py-2"
                    value={confirmData.method}
                    onChange={(e) =>
                      setConfirmData({
                        ...confirmData,
                        method: e.target.value as 'transfer' | 'cash' | 'check',
                      })
                    }
                  >
                    <option value="transfer">Transferencia</option>
                    <option value="cash">Efectivo</option>
                    <option value="check">Cheque</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfirmation}>
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
