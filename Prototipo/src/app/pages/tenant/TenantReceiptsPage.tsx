import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockPayments } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Download, FileText, Info } from 'lucide-react';
import { toast } from 'sonner';

export const TenantReceiptsPage = () => {
  const paidPayments = mockPayments.filter((p) => p.residentId === '2' && p.status === 'paid');

  const handleDownload = () => {
    toast.success('Recibo descargado en formato PDF');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Recibos</h1>
        <p className="text-muted-foreground">Departamento 402 — Comprobantes de pago disponibles</p>
      </div>

      <Card className="border-primary bg-primary/5">
        <CardContent className="flex items-center gap-4 p-5">
          <Info className="h-5 w-5 text-primary flex-shrink-0" />
          <p className="text-sm">
            Como arrendatario, puedes ver los recibos de pagos realizados en el departamento. Para consultas adicionales contacta al propietario o a la administración.
          </p>
        </CardContent>
      </Card>

      {paidPayments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <FileText className="h-10 w-10" />
            <p>No hay recibos disponibles</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paidPayments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Gastos Comunes</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{payment.month}</p>
                  </div>
                  <Badge variant="success">Pagado</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departamento</span>
                    <span className="font-medium">{payment.apartmentNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Período</span>
                    <span className="font-medium">{payment.month}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-muted-foreground">Monto</span>
                    <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha</span>
                    <span>{payment.paidAt ? formatDate(payment.paidAt) : '—'}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleDownload}>
                  <Download className="mr-1 h-4 w-4" />
                  Descargar PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
