import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
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
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Announcement } from '../../types';
import { formatDate } from '../../lib/utils';
import { Pin, Plus, Pencil, Trash2, Megaphone, AlertTriangle, Info, Wrench } from 'lucide-react';
import { toast } from 'sonner';

const categoryConfig: Record<
  Announcement['category'],
  { label: string; icon: React.ReactNode; variant: 'default' | 'destructive' | 'warning' }
> = {
  info: { label: 'Información', icon: <Info className="h-4 w-4" />, variant: 'default' },
  urgent: { label: 'Urgente', icon: <AlertTriangle className="h-4 w-4" />, variant: 'destructive' },
  maintenance: { label: 'Mantención', icon: <Wrench className="h-4 w-4" />, variant: 'warning' },
};

const emptyForm = { title: '', body: '', category: 'info' as Announcement['category'], pinned: false };

export const AnnouncementsPage = () => {
  const { user } = useAuth();
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, markAnnouncementRead } = useData();
  const isAdmin = user?.role === 'admin';
  const readerKey = user?.role ?? 'owner';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState(emptyForm);

  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const unreadCount = announcements.filter((a) => !a.readBy.includes(readerKey)).length;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (ann: Announcement) => {
    setEditing(ann);
    setForm({ title: ann.title, body: ann.body, category: ann.category, pinned: ann.pinned ?? false });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Completa el título y el contenido');
      return;
    }
    if (editing) {
      updateAnnouncement(editing.id, form);
      toast.success('Aviso actualizado');
    } else {
      addAnnouncement(form);
      toast.success('Aviso publicado');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAnnouncement(deleteId);
      toast.success('Aviso eliminado');
      setDeleteId(null);
    }
  };

  const handleMarkRead = (id: string) => {
    markAnnouncementRead(id, readerKey);
  };

  const handleMarkAllRead = () => {
    announcements.forEach((a) => {
      if (!a.readBy.includes(readerKey)) markAnnouncementRead(a.id, readerKey);
    });
    toast.success('Todos los avisos marcados como leídos');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tablón de Avisos</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Publica comunicados para todos los residentes' : 'Comunicados del edificio'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllRead}>
              Marcar todo leído
            </Button>
          )}
          {isAdmin && (
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Publicar Aviso
            </Button>
          )}
        </div>
      </div>

      {!isAdmin && unreadCount > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Megaphone className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">
              Tienes {unreadCount} aviso{unreadCount !== 1 ? 's' : ''} sin leer
            </p>
          </CardContent>
        </Card>
      )}

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Megaphone className="h-10 w-10" />
            <p>No hay avisos publicados</p>
            {isAdmin && (
              <Button variant="outline" onClick={openCreate}>
                Publicar primer aviso
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sorted.map((ann) => {
            const cfg = categoryConfig[ann.category];
            const isUnread = !ann.readBy.includes(readerKey);
            return (
              <Card
                key={ann.id}
                className={`transition-all ${isUnread && !isAdmin ? 'border-primary/50 shadow-sm' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {ann.pinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        {isUnread && !isAdmin && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                        <h3 className={`font-semibold ${isUnread && !isAdmin ? 'text-foreground' : ''}`}>
                          {ann.title}
                        </h3>
                        <Badge variant={cfg.variant} className="gap-1">
                          {cfg.icon}
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {ann.body}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Publicado: {formatDate(ann.createdAt)}</span>
                        {isAdmin && (
                          <span>{ann.readBy.length - 1} lectura{ann.readBy.length - 1 !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {isAdmin ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={ann.pinned ? 'Desfijar' : 'Fijar'}
                            onClick={() => updateAnnouncement(ann.id, { pinned: !ann.pinned })}
                          >
                            <Pin className={`h-4 w-4 ${ann.pinned ? 'text-primary' : ''}`} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(ann)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(ann.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : isUnread ? (
                        <Button size="sm" variant="outline" onClick={() => handleMarkRead(ann.id)}>
                          Marcar leído
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Leído</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Aviso' : 'Publicar Aviso'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej: Corte de agua programado"
              />
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <Textarea
                rows={6}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Describe el aviso en detalle..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v as Announcement['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Información</SelectItem>
                    <SelectItem value="maintenance">Mantención</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fijar aviso</Label>
                <div className="flex items-center h-10">
                  <Switch
                    checked={form.pinned}
                    onCheckedChange={(v) => setForm({ ...form, pinned: v })}
                  />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {form.pinned ? 'Fijado arriba' : 'Sin fijar'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editing ? 'Guardar Cambios' : 'Publicar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Aviso</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">¿Estás seguro de que deseas eliminar este aviso?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
