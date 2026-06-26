import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Plus, Search, Edit, Trash2, Key } from 'lucide-react';
import { Resident } from '../../types';
import { toast } from 'sonner';
import { useData } from '../../context/DataContext';

function generateTenantCode() {
  return 'ARR' + Math.floor(1000 + Math.random() * 9000).toString();
}

type FormData = Omit<Resident, 'id'>;

const emptyForm: FormData = {
  name: '',
  email: '',
  phone: '',
  apartmentNumber: '',
  role: 'owner',
  status: 'active',
  tenantCode: '',
};

export const ResidentsPage = () => {
  const { residents, apartments, addResident, updateResident, deleteResident } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const filteredResidents = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.apartmentNumber.includes(searchTerm)
  );

  // For tenants: only apartments that don't already have a tenant assigned
  const availableForTenant = apartments.filter((apt) => {
    const hasTenant = residents.some(
      (r) => r.role === 'tenant' && r.apartmentNumber === apt.number && r.id !== editingResident?.id
    );
    return !hasTenant;
  });

  const handleOpenDialog = (resident?: Resident) => {
    if (resident) {
      setEditingResident(resident);
      setFormData({
        name: resident.name,
        email: resident.email,
        phone: resident.phone,
        apartmentNumber: resident.apartmentNumber,
        role: resident.role,
        status: resident.status,
        tenantCode: resident.tenantCode ?? '',
      });
    } else {
      setEditingResident(null);
      setFormData({ ...emptyForm, tenantCode: generateTenantCode() });
    }
    setIsDialogOpen(true);
  };

  const handleRoleChange = (role: 'owner' | 'tenant') => {
    setFormData((prev) => ({
      ...prev,
      role,
      tenantCode: role === 'tenant' ? (prev.tenantCode || generateTenantCode()) : '',
      apartmentNumber: '',
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) { toast.error('El nombre es requerido'); return; }
    if (!formData.email.trim()) { toast.error('El email es requerido'); return; }
    if (!formData.apartmentNumber.trim()) { toast.error('El departamento es requerido'); return; }

    const dataToSave: Omit<Resident, 'id'> = {
      ...formData,
      tenantCode: formData.role === 'tenant' ? formData.tenantCode : undefined,
    };

    if (editingResident) {
      updateResident(editingResident.id, dataToSave);
      toast.success('Residente actualizado correctamente');
    } else {
      addResident(dataToSave);
      toast.success('Residente registrado correctamente');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteResident(id);
    toast.success('Residente eliminado correctamente');
    setDeleteDialog(null);
  };

  const aptTypeLabel = (type: string) => {
    if (type === 'studio') return 'Estudio';
    if (type === '1br') return '1 Dorm.';
    if (type === '2br') return '2 Dorm.';
    return '3 Dorm.';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Residentes</h1>
          <p className="text-muted-foreground">
            Administra la información de propietarios y arrendatarios
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Residente
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Código Acceso</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResidents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell className="font-medium">{resident.name}</TableCell>
                <TableCell>{resident.apartmentNumber}</TableCell>
                <TableCell>{resident.email}</TableCell>
                <TableCell>{resident.phone}</TableCell>
                <TableCell>
                  <Badge variant={resident.role === 'owner' ? 'default' : 'secondary'}>
                    {resident.role === 'owner' ? 'Propietario' : 'Arrendatario'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={resident.status === 'active' ? 'success' : 'outline'}>
                    {resident.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {resident.tenantCode ? (
                    <div className="flex items-center gap-1 text-sm font-mono">
                      <Key className="h-3 w-3 text-muted-foreground" />
                      {resident.tenantCode}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(resident)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteDialog(resident.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredResidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron residentes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingResident ? 'Editar Residente' : 'Registrar Nuevo Residente'}
            </DialogTitle>
            <DialogDescription>Completa la información del residente</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre Completo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Correo Electrónico</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@ejemplo.cl"
                />
              </div>
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo de Residente</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => handleRoleChange(v as 'owner' | 'tenant')}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Propietario</SelectItem>
                    <SelectItem value="tenant">Arrendatario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    setFormData({ ...formData, status: v as 'active' | 'inactive' })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Departamento</Label>
              {formData.role === 'tenant' ? (
                <>
                  <Select
                    value={formData.apartmentNumber}
                    onValueChange={(v) => setFormData({ ...formData, apartmentNumber: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un departamento..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableForTenant.map((apt) => (
                        <SelectItem key={apt.id} value={apt.number}>
                          Depto. {apt.number} — Piso {apt.floor} · {aptTypeLabel(apt.type)} · {apt.surface} m²
                          {apt.ownerName ? ` · Prop: ${apt.ownerName}` : ''}
                        </SelectItem>
                      ))}
                      {availableForTenant.length === 0 && (
                        <SelectItem value="__none__" disabled>
                          Todos los departamentos tienen arrendatario
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Solo se listan departamentos sin arrendatario asignado actualmente
                  </p>
                </>
              ) : (
                <Select
                  value={formData.apartmentNumber}
                  onValueChange={(v) => setFormData({ ...formData, apartmentNumber: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento..." />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map((apt) => (
                      <SelectItem key={apt.id} value={apt.number}>
                        Depto. {apt.number} — Piso {apt.floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {formData.role === 'tenant' && (
              <div className="grid gap-2">
                <Label>Código de Acceso del Arrendatario</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.tenantCode}
                    onChange={(e) => setFormData({ ...formData, tenantCode: e.target.value })}
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({ ...formData, tenantCode: generateTenantCode() })
                    }
                  >
                    Regenerar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  El arrendatario usa este código para acceder al portal. Entrégeselo de forma
                  segura.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingResident ? 'Guardar Cambios' : 'Registrar Residente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Residente</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar este residente? Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteDialog!)}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
