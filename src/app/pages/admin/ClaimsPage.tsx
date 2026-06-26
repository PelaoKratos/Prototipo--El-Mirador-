import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
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
import { Plus, Clock, PlayCircle, CheckCircle } from 'lucide-react';
import { Claim } from '../../types';
import { formatDate } from '../../lib/utils';
import { toast } from 'sonner';
import { useData } from '../../context/DataContext';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const priorityColors = {
  low: 'pending',
  medium: 'warning',
  high: 'destructive',
} as const;

interface ClaimCardProps {
  claim: Claim;
}

function ClaimCard({ claim }: ClaimCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: claim.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3 cursor-move hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm">{claim.title}</h4>
            <Badge variant={priorityColors[claim.priority]} className="shrink-0">
              {claim.priority === 'high' ? 'Alta' : claim.priority === 'medium' ? 'Media' : 'Baja'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{claim.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {claim.residentName} - Depto {claim.apartmentNumber}
            </span>
            <span className="text-muted-foreground">{formatDate(claim.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const ClaimsPage = () => {
  const { claims, addClaim, updateClaim } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    residentName: '',
    apartmentNumber: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const pendingClaims = claims.filter(c => c.status === 'pending');
  const inProgressClaims = claims.filter(c => c.status === 'in_progress');
  const resolvedClaims = claims.filter(c => c.status === 'resolved');

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeClaim = claims.find(c => c.id === active.id);
      const overColumn = over.data.current?.sortable?.containerId;

      if (activeClaim && overColumn) {
        updateClaim(active.id, {
          status: overColumn as Claim['status'],
          resolvedAt: overColumn === 'resolved' ? new Date() : undefined,
        });
        toast.success('Estado del reclamo actualizado');
      }
    }

    setActiveId(null);
  };

  const handleCreateClaim = () => {
    addClaim({
      ...formData,
      status: 'pending',
      createdAt: new Date(),
    });
    toast.success('Reclamo creado correctamente');
    setIsDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      residentName: '',
      apartmentNumber: '',
      priority: 'medium',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Gestión de Reclamos</h1>
          <p className="text-muted-foreground">
            Administra solicitudes y reclamos de los residentes
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Solicitud
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-6 md:grid-cols-3">
          {/* Pendiente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              <h3 className="font-medium">Pendiente</h3>
              <Badge variant="pending">{pendingClaims.length}</Badge>
            </div>
            <SortableContext
              items={pendingClaims.map(c => c.id)}
              strategy={verticalListSortingStrategy}
              id="pending"
            >
              <div className="min-h-[200px] rounded-lg bg-muted/30 p-3">
                {pendingClaims.map(claim => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* En Proceso */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              <h3 className="font-medium">En Proceso</h3>
              <Badge variant="default">{inProgressClaims.length}</Badge>
            </div>
            <SortableContext
              items={inProgressClaims.map(c => c.id)}
              strategy={verticalListSortingStrategy}
              id="in_progress"
            >
              <div className="min-h-[200px] rounded-lg bg-muted/30 p-3">
                {inProgressClaims.map(claim => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Resuelto */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <h3 className="font-medium">Resuelto</h3>
              <Badge variant="success">{resolvedClaims.length}</Badge>
            </div>
            <SortableContext
              items={resolvedClaims.map(c => c.id)}
              strategy={verticalListSortingStrategy}
              id="resolved"
            >
              <div className="min-h-[200px] rounded-lg bg-muted/30 p-3">
                {resolvedClaims.map(claim => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <ClaimCard claim={claims.find(c => c.id === activeId)!} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Solicitud o Reclamo</DialogTitle>
            <DialogDescription>
              Registra una nueva solicitud o reclamo de un residente
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Fuga de agua en el hall"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-input-background px-3 py-2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el problema o solicitud..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="residentName">Residente</Label>
                <Input
                  id="residentName"
                  value={formData.residentName}
                  onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="apartmentNumber">Departamento</Label>
                <Input
                  id="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridad</Label>
              <select
                id="priority"
                className="flex h-10 w-full rounded-lg border border-input bg-input-background px-3 py-2"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })
                }
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateClaim}>Crear Reclamo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
