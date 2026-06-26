import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { mockPayments, mockResidents } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';
import { AlertCircle, Send, DollarSign, Users, TrendingDown, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface DelinquentRecord {
  residentId: string;
  residentName: string;
  apartmentNumber: string;
  email: string;
  phone: string;
  totalDebt: number;
  overdueMonths: number;
  payments: typeof mockPayments;
  lastNotified?: string;
}

export const DelinquentsPage = () => {
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<DelinquentRecord | null>(null);
  const [message, setMessage] = useState('');
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  const overduePayments = mockPayments.filter((p) => p.status === 'overdue' || p.status === 'pending');

  const delinquentMap: Record<string, DelinquentRecord> = {};
  overduePayments.forEach((p) => {
    const resident = mockResidents.find((r) => r.id === p.residentId);
    if (!delinquentMap[p.residentId]) {
      delinquentMap[p.residentId] = {
        residentId: p.residentId,
        residentName: p.residentName,
        apartmentNumber: p.apartmentNumber,
        email: resident?.email ?? 'sin-email@ejemplo.cl',
        phone: resident?.phone ?? '—',
        totalDebt: 0,
        overdueMonths: 0,
        payments: [],
      };
    }
    delinquentMap[p.residentId].totalDebt += p.amount;
    delinquentMap[p.residentId].overdueMonths += 1;
    delinquentMap[p.residentId].payments.push(p);
  });

  const delinquents = Object.values(delinquentMap).sort((a, b) => b.totalDebt - a.totalDebt);

  const totalDebt = delinquents.reduce((sum, d) => sum + d.totalDebt, 0);

  const openNotify = (d: DelinquentRecord) => {
    setSelectedResident(d);
    setMessage(
      `Estimado/a ${d.residentName},\n\nLe informamos que tiene una deuda pendiente de ${formatCurrency(d.totalDebt)} correspondiente a gastos comunes.\n\nPor favor regularice su situación a la brevedad.\n\nAtentamente,\nAdministración El Mirador`
    );
    setNotifyDialogOpen(true);
  };

  const handleSendNotification = () => {
    if (!selectedResident) return;
    setNotifiedIds((prev) => new Set([...prev, selectedResident.residentId]));
    toast.success(`Notificación enviada a ${selectedResident.residentName}`);
    setNotifyDialogOpen(false);
  };

  const handleNotifyAll = () => {
    const ids = delinquents.map((d) => d.residentId);
    setNotifiedIds(new Set(ids));
    toast.success(`Se enviaron ${ids.length} notificaciones`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Residentes Morosos</h1>
          <p className="text-muted-foreground">Seguimiento de deudas y notificaciones</p>
        </div>
        <Button onClick={handleNotifyAll} variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Notificar a Todos
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deuda Total</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-destructive">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-muted-foreground">Monto total por cobrar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Residentes con Deuda</CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{delinquents.length}</div>
            <p className="text-xs text-muted-foreground">
              {overduePayments.filter((p) => p.status === 'overdue').length} vencidos ·{' '}
              {overduePayments.filter((p) => p.status === 'pending').length} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Morosidad</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {Math.round((delinquents.length / mockResidents.filter((r) => r.status === 'active').length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Del total de residentes activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Delinquent Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Morosidad</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Residente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Meses Adeudados</TableHead>
                <TableHead>Deuda Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delinquents.map((d) => {
                const hasOverdue = d.payments.some((p) => p.status === 'overdue');
                const wasNotified = notifiedIds.has(d.residentId);
                return (
                  <TableRow key={d.residentId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{d.residentName}</div>
                        <div className="text-sm text-muted-foreground">Depto. {d.apartmentNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{d.email}</div>
                        <div className="text-sm text-muted-foreground">{d.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {d.payments.map((p) => (
                          <span key={p.id} className="text-sm">
                            {p.month}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-destructive">
                      {formatCurrency(d.totalDebt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hasOverdue ? 'destructive' : 'warning'}>
                        {hasOverdue ? 'Vencido' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {wasNotified ? (
                          <Badge variant="outline" className="gap-1">
                            <Mail className="h-3 w-3" />
                            Notificado
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => openNotify(d)}>
                            <Send className="mr-1 h-4 w-4" />
                            Notificar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {delinquents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-8 w-8" />
                      <p>No hay residentes con deudas pendientes</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Detail per delinquent */}
      {delinquents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Pagos Pendientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Residente</TableHead>
                  <TableHead>Depto.</TableHead>
                  <TableHead>Mes</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overduePayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.residentName}</TableCell>
                    <TableCell>{p.apartmentNumber}</TableCell>
                    <TableCell>{p.month}</TableCell>
                    <TableCell>{formatCurrency(p.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'overdue' ? 'destructive' : 'warning'}>
                        {p.status === 'overdue' ? 'Vencido' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Notify Dialog */}
      <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Notificación de Cobro</DialogTitle>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p>
                  <strong>Para:</strong> {selectedResident.residentName} ({selectedResident.email})
                </p>
                <p>
                  <strong>Deuda:</strong> {formatCurrency(selectedResident.totalDebt)}
                </p>
              </div>
              <Textarea
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendNotification}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Notificación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
