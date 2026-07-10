import { useState } from 'react';
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
import { Apartment } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Building, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '../../context/DataContext';

const typeLabel: Record<Apartment['type'], string> = {
  studio: 'Estudio',
  '1br': '1 Dormitorio',
  '2br': '2 Dormitorios',
  '3br': '3 Dormitorios',
};

const statusBadge: Record<Apartment['status'], { label: string; variant: 'success' | 'warning' | 'destructive' | 'outline' }> = {
  occupied: { label: 'Ocupado', variant: 'success' },
  vacant: { label: 'Vacante', variant: 'outline' },
  maintenance: { label: 'Mantención', variant: 'warning' },
};

const emptyApartment: Omit<Apartment, 'id'> = {
  number: '',
  floor: 1,
  type: '2br',
  surface: 60,
  status: 'vacant',
  monthlyFee: 85000,
};

export const DepartmentsPage = () => {
  const { apartments, addApartment, updateApartment, deleteApartment } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Apartment, 'id'>>(emptyApartment);

  const filtered = apartments.filter((a) => {
    const matchSearch =
      a.number.includes(search) ||
      (a.ownerName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (a.tenantName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const kpis = {
    total: apartments.length,
    occupied: apartments.filter((a) => a.status === 'occupied').length,
    vacant: apartments.filter((a) => a.status === 'vacant').length,
    maintenance: apartments.filter((a) => a.status === 'maintenance').length,
  };

  const openCreate = () => {
    setEditingApartment(null);
    setForm(emptyApartment);
    setDialogOpen(true);
  };

  const openEdit = (apt: Apartment) => {
    setEditingApartment(apt);
    setForm({ ...apt });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.number.trim()) {
      toast.error('El número de departamento es requerido');
      return;
    }
    if (editingApartment) {
      updateApartment(editingApartment.id, form);
      toast.success('Departamento actualizado');
    } else {
      addApartment(form);
      toast.success('Departamento creado');
    }
    setDialogOpen(false);
  };

  const openDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletingId) return;

    deleteApartment(deletingId);
    toast.success('Departamento eliminado');
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Departamentos</h1>
          <p className="text-muted-foreground">Administra las unidades del edificio</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Departamento
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Unidades', value: kpis.total, icon: Building, color: 'text-primary' },
          { label: 'Ocupados', value: kpis.occupied, icon: Building, color: 'text-success' },
          { label: 'Vacantes', value: kpis.vacant, icon: Building, color: 'text-muted-foreground' },
          { label: 'En Mantención', value: kpis.maintenance, icon: Building, color: 'text-warning' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o residente..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="occupied">Ocupado</SelectItem>
            <SelectItem value="vacant">Vacante</SelectItem>
            <SelectItem value="maintenance">Mantención</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Depto.</TableHead>
                <TableHead>Piso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Superficie</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Arrendatario</TableHead>
                <TableHead>Gasto Común</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((apt) => {
                const sb = statusBadge[apt.status];
                return (
                  <TableRow key={apt.id}>
                    <TableCell className="font-semibold">{apt.number}</TableCell>
                    <TableCell>{apt.floor}°</TableCell>
                    <TableCell>{typeLabel[apt.type]}</TableCell>
                    <TableCell>{apt.surface} m²</TableCell>
                    <TableCell>{apt.ownerName ?? <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{apt.tenantName ?? <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{formatCurrency(apt.monthlyFee)}</TableCell>
                    <TableCell>
                      <Badge variant={sb.variant}>{sb.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(apt)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDelete(apt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No se encontraron departamentos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingApartment ? 'Editar Departamento' : 'Nuevo Departamento'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Número</Label>
                <Input
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  placeholder="ej: 301"
                />
              </div>
              <div className="space-y-2">
                <Label>Piso</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as Apartment['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Estudio</SelectItem>
                    <SelectItem value="1br">1 Dormitorio</SelectItem>
                    <SelectItem value="2br">2 Dormitorios</SelectItem>
                    <SelectItem value="3br">3 Dormitorios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Superficie (m²)</Label>
                <Input
                  type="number"
                  min={20}
                  value={form.surface}
                  onChange={(e) => setForm({ ...form, surface: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as Apartment['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="occupied">Ocupado</SelectItem>
                  <SelectItem value="vacant">Vacante</SelectItem>
                  <SelectItem value="maintenance">En Mantención</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Propietario</Label>
                <Input
                  value={form.ownerName ?? ''}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value || undefined })}
                  placeholder="Nombre propietario"
                />
              </div>
              <div className="space-y-2">
                <Label>Arrendatario</Label>
                <Input
                  value={form.tenantName ?? ''}
                  onChange={(e) => setForm({ ...form, tenantName: e.target.value || undefined })}
                  placeholder="Nombre arrendatario"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gasto Común Mensual ($)</Label>
              <Input
                type="number"
                min={0}
                value={form.monthlyFee}
                onChange={(e) => setForm({ ...form, monthlyFee: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingApartment ? 'Guardar Cambios' : 'Crear Departamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Departamento</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar este departamento? Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
