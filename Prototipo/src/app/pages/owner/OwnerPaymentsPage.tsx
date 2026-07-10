import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Payment } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { CreditCard, AlertCircle, CheckCircle2, Clock, Droplets, Flame, Lightbulb, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

type BasicBill = {
  id: string;
  concept: string;
  amount: number;
  icon: ReactNode;
  status: 'pending' | 'paid';
};

export const OwnerPaymentsPage = () => {
  const { user } = useAuth();
  const { payments, expenses, addPayment, updatePayment } = useData();
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedBasicBill, setSelectedBasicBill] = useState<BasicBill | null>(null);
  const [payMethod, setPayMethod] = useState<'transfer' | 'cash' | 'check'>('transfer');
  const [transferRef, setTransferRef] = useState('');
  const [basicBills, setBasicBills] = useState<BasicBill[]>([
    { id: 'water', concept: 'Agua', amount: 18500, icon: <Droplets className="h-4 w-4" />, status: 'pending' },
    { id: 'electricity', concept: 'Luz', amount: 32600, icon: <Lightbulb className="h-4 w-4" />, status: 'pending' },
    { id: 'gas', concept: 'Gas', amount: 21400, icon: <Flame className="h-4 w-4" />, status: 'pending' },
    { id: 'internet', concept: 'Internet', amount: 24990, icon: <Wifi className="h-4 w-4" />, status: 'pending' },
  ]);

  const currentExpense = useMemo(
    () =>
      [...expenses]
        .filter((expense) => expense.status === 'published')
        .sort((a, b) => b.month.localeCompare(a.month))[0],
    [expenses]
  );

  const userPayments = payments.filter((p) => p.residentId === user?.id);
  const hasCurrentCommonExpense =
    !!currentExpense && userPayments.some((p) => p.category !== 'basic' && p.month === currentExpense.month);

  const payableCommonExpenses: Payment[] =
    currentExpense && !hasCurrentCommonExpense && user
      ? [
          {
            id: `new-common-${user.id}-${currentExpense.month}`,
            residentId: user.id,
            residentName: user.name,
            apartmentNumber: user.apartmentNumber || '',
            concept: currentExpense.concept,
            category: 'common',
            amount: currentExpense.amount,
            month: currentExpense.month,
            status: 'pending',
          },
          ...userPayments,
        ]
      : userPayments;

  const pendingCommon = payableCommonExpenses.filter((p) => p.status !== 'paid');
  const pendingBasics = basicBills.filter((b) => b.status !== 'paid');
  const totalPending =
    pendingCommon.reduce((sum, p) => sum + p.amount, 0) +
    pendingBasics.reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = userPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const openPayCommon = (payment: Payment) => {
    setSelectedPayment(payment);
    setSelectedBasicBill(null);
    setPayMethod('transfer');
    setTransferRef('');
    setPayDialogOpen(true);
  };

  const openPayBasic = (bill: BasicBill) => {
    setSelectedBasicBill(bill);
    setSelectedPayment(null);
    setPayMethod('transfer');
    setTransferRef('');
    setPayDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    if (payMethod === 'transfer' && !transferRef.trim()) {
      toast.error('Ingresa el numero de referencia de la transferencia');
      return;
    }

    if (selectedPayment && user) {
      const paidData = { status: 'paid' as const, paidAt: new Date(), method: payMethod };
      if (selectedPayment.id.startsWith('new-common-')) {
        addPayment({ ...selectedPayment, ...paidData });
      } else {
        updatePayment(selectedPayment.id, paidData);
      }
      toast.success('Pago de gasto comun registrado correctamente.');
      setPayDialogOpen(false);
      return;
    }

    if (selectedBasicBill && user) {
      addPayment({
        residentId: user.id,
        residentName: user.name,
        apartmentNumber: user.apartmentNumber || '',
        concept: selectedBasicBill.concept,
        category: 'basic',
        amount: selectedBasicBill.amount,
        month: new Date().toISOString().slice(0, 7),
        status: 'paid',
        paidAt: new Date(),
        method: payMethod,
      });
      setBasicBills((prev) =>
        prev.map((bill) => (bill.id === selectedBasicBill.id ? { ...bill, status: 'paid' } : bill))
      );
      toast.success(`Pago de ${selectedBasicBill.concept.toLowerCase()} registrado correctamente.`);
      setPayDialogOpen(false);
    }
  };

  const selectedConcept = selectedPayment?.concept || selectedBasicBill?.concept || 'Pago';
  const selectedAmount = selectedPayment?.amount || selectedBasicBill?.amount || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Mis Pagos</h1>
        <p className="text-muted-foreground">
          Departamento {user?.apartmentNumber || '-'} - Gastos comunes y servicios basicos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de Pago</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {totalPending > 0 ? formatCurrency(totalPending) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingCommon.length + pendingBasics.length > 0
                ? `${pendingCommon.length + pendingBasics.length} pago(s) pendiente(s)`
                : 'Sin deudas pendientes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {userPayments.filter((p) => p.status === 'paid').length} pagos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proximo Vencimiento</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">15 Jul 2026</div>
            <p className="text-xs text-muted-foreground">Gastos comunes Julio</p>
          </CardContent>
        </Card>
      </div>

      {pendingCommon.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-medium">Tienes gastos comunes pendientes</h3>
                  <p className="text-sm text-muted-foreground">
                    Monto total: {formatCurrency(pendingCommon.reduce((sum, p) => sum + p.amount, 0))}
                  </p>
                </div>
              </div>
              <Button onClick={() => openPayCommon(pendingCommon[0])}>
                <CreditCard className="mr-2 h-4 w-4" />
                Pagar Ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Gastos Basicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {basicBills.map((bill) => (
              <Card key={bill.id} className="border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      {bill.icon}
                      {bill.concept}
                    </div>
                    <Badge variant={bill.status === 'paid' ? 'success' : 'warning'}>
                      {bill.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </Badge>
                  </div>
                  <div className="text-2xl font-semibold">{formatCurrency(bill.amount)}</div>
                  <Button
                    className="w-full"
                    variant={bill.status === 'paid' ? 'outline' : 'default'}
                    disabled={bill.status === 'paid'}
                    onClick={() => openPayBasic(bill)}
                  >
                    {bill.status === 'paid' ? 'Pagado' : 'Pagar'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Pago</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead className="text-right">Accion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payableCommonExpenses.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.month}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.concept || 'Gastos Comunes'}
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
                  <TableCell>{payment.paidAt ? formatDate(payment.paidAt) : '-'}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {payment.method === 'transfer'
                      ? 'Transferencia'
                      : payment.method === 'cash'
                      ? 'Efectivo'
                      : payment.method === 'check'
                      ? 'Cheque'
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.status !== 'paid' && (
                      <Button size="sm" onClick={() => openPayCommon(payment)}>
                        Pagar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Concepto</span>
                <span className="font-medium">{selectedConcept}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monto</span>
                <span className="font-semibold">{formatCurrency(selectedAmount)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Metodo de Pago</Label>
              <Select value={payMethod} onValueChange={(v) => setPayMethod(v as typeof payMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="check">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {payMethod === 'transfer' && (
              <div className="space-y-2">
                <Label>Nro. de Referencia / Comprobante</Label>
                <Input
                  placeholder="Ej: 202606050001"
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                />
                <div className="rounded-lg border p-3 text-sm space-y-1">
                  <p className="font-medium">Datos bancarios:</p>
                  <p className="text-muted-foreground">Banco Estado - Cta. Cte. 1234567890</p>
                  <p className="text-muted-foreground">RUT: 12.345.678-9 - Condominio El Mirador</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmPayment}>
              <CreditCard className="mr-2 h-4 w-4" />
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
