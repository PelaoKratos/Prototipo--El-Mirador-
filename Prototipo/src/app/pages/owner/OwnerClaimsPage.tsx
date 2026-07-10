import { useState } from 'react';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
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
import { Claim } from '../../types';
import { formatDate } from '../../lib/utils';
import { Plus, AlertCircle, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const priorityLabel: Record<Claim['priority'], string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

const priorityVariant: Record<Claim['priority'], 'outline' | 'warning' | 'destructive'> = {
  low: 'outline',
  medium: 'warning',
  high: 'destructive',
};

const statusConfig: Record<
  Claim['status'],
  { label: string; icon: ReactNode; variant: 'outline' | 'warning' | 'success' }
> = {
  pending: { label: 'Pendiente', icon: <Clock className="h-4 w-4" />, variant: 'warning' },
  in_progress: {
    label: 'En Proceso',
    icon: <AlertCircle className="h-4 w-4" />,
    variant: 'outline',
  },
  resolved: { label: 'Resuelto', icon: <CheckCircle2 className="h-4 w-4" />, variant: 'success' },
};

export const OwnerClaimsPage = () => {
  const { user } = useAuth();
  const { claims, addClaim } = useData();
  const ownerClaims = claims.filter((c) => c.apartmentNumber === user?.apartmentNumber);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as Claim['priority'],
  });

  const handleCreate = () => {
    if (!form.title.trim()) {
      toast.error('El titulo es requerido');
      return;
    }
    if (!form.description.trim()) {
      toast.error('La descripcion es requerida');
      return;
    }
    addClaim({
      title: form.title,
      description: form.description,
      priority: form.priority,
      residentName: user?.name || 'Residente',
      apartmentNumber: user?.apartmentNumber || '',
      status: 'pending',
      createdAt: new Date(),
    });
    toast.success('Reclamo enviado correctamente');
    setDialogOpen(false);
    setForm({ title: '', description: '', priority: 'medium' });
  };

  const kpis = {
    total: ownerClaims.length,
    pending: ownerClaims.filter((c) => c.status === 'pending').length,
    inProgress: ownerClaims.filter((c) => c.status === 'in_progress').length,
    resolved: ownerClaims.filter((c) => c.status === 'resolved').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Mis Reclamos</h1>
          <p className="text-muted-foreground">
            Departamento {user?.apartmentNumber || '-'} - Solicitudes y reclamos enviados
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Reclamo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total', value: kpis.total, color: 'text-primary' },
          { label: 'Pendientes', value: kpis.pending, color: 'text-warning' },
          { label: 'En Proceso', value: kpis.inProgress, color: 'text-foreground' },
          { label: 'Resueltos', value: kpis.resolved, color: 'text-success' },
        ].map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{k.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-semibold ${k.color}`}>{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {ownerClaims.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <MessageSquare className="h-10 w-10" />
              <p>No tienes reclamos registrados</p>
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                Crear primer reclamo
              </Button>
            </CardContent>
          </Card>
        ) : (
          ownerClaims.map((claim) => {
            const sc = statusConfig[claim.status];
            return (
              <Card key={claim.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{claim.title}</h3>
                        <Badge variant={priorityVariant[claim.priority]}>
                          Prioridad {priorityLabel[claim.priority]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{claim.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Enviado: {formatDate(claim.createdAt)}</span>
                        {claim.resolvedAt && <span>Resuelto: {formatDate(claim.resolvedAt)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sc.icon}
                      <Badge variant={sc.variant}>{sc.label}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo Reclamo o Solicitud</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titulo</Label>
              <Input
                placeholder="Ej: Fuga de agua en bano"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descripcion</Label>
              <Textarea
                placeholder="Describe el problema con el mayor detalle posible..."
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v as Claim['priority'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja - solicitud general</SelectItem>
                  <SelectItem value="medium">Media - requiere atencion pronto</SelectItem>
                  <SelectItem value="high">Alta - urgente, requiere atencion inmediata</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Enviar Reclamo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
