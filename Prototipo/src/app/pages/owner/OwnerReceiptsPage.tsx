import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockPayments } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Download, FileText, Printer } from 'lucide-react';
import { toast } from 'sonner';

export const OwnerReceiptsPage = () => {
  const paidPayments = mockPayments.filter((p) => p.residentId === '1' && p.status === 'paid');

  const handleDownload = (paymentId: string) => {
    toast.success('Recibo descargado en formato PDF');
  };

  const handlePrint = (paymentId: string) => {
    toast.success('Enviando a impresora...');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Mis Recibos</h1>
          <p className="text-muted-foreground">Departamento 301 — Comprobantes de pago</p>
        </div>
      </div>

      {paidPayments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <FileText className="h-10 w-10" />
            <p>No tienes recibos disponibles aún</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paidPayments.map((payment) => (
            <Card key={payment.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Gastos Comunes</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{payment.month}</p>
                  </div>
                  <Badge variant="success">Pagado</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Receipt Preview */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Residente</span>
                    <span className="font-medium">{payment.residentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departamento</span>
                    <span className="font-medium">{payment.apartmentNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Período</span>
                    <span className="font-medium">{payment.month}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-muted-foreground">Monto Pagado</span>
                    <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de Pago</span>
                    <span>{payment.paidAt ? formatDate(payment.paidAt) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método</span>
                    <span className="capitalize">
                      {payment.method === 'transfer'
                        ? 'Transferencia'
                        : payment.method === 'cash'
                        ? 'Efectivo'
                        : 'Cheque'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(payment.id)}
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Descargar PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePrint(payment.id)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Sobre los recibos</p>
              <p className="text-muted-foreground mt-1">
                Los recibos corresponden a los gastos comunes pagados. Guárdalos como
                comprobante. Para obtener recibos de meses anteriores contacta a la administración
                en admin@elmirador.cl.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
