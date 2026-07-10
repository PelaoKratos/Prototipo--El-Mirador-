import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Message } from '../../types';
import { formatDate } from '../../lib/utils';
import { Send, Inbox, Reply, PenSquare, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

function roleLabel(role: string) {
  if (role === 'admin') return 'Administración';
  if (role === 'owner') return 'Propietario';
  if (role === 'tenant') return 'Arrendatario';
  if (role === 'all') return 'Todos los residentes';
  return role;
}

function toLabel(m: Message) {
  if (m.toRole === 'all') return 'Todos los residentes';
  if (m.toApartment) return `Depto. ${m.toApartment}`;
  return roleLabel(m.toRole);
}

export const MessagesPage = () => {
  const { user } = useAuth();
  const { messages, apartments, addMessage, markMessageRead } = useData();
  const role = user?.role ?? 'owner';
  const apartment = user?.apartmentNumber;
  const readerKey = role;

  const [composeOpen, setComposeOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);
  const [form, setForm] = useState({ toRole: 'admin' as Message['toRole'], toApartment: '', subject: '', body: '' });

  // Filter inbox: messages addressed to this role or broadcast
  const inbox = messages.filter((m) => {
    if (m.fromRole === role && (role !== 'admin' || m.toRole !== 'admin')) return false;
    if (role === 'admin') return m.toRole === 'admin' || m.toRole === 'all';
    if (role === 'owner')
      return (
        m.toRole === 'all' ||
        (m.toRole === 'owner' && (!m.toApartment || m.toApartment === apartment))
      );
    if (role === 'tenant')
      return (
        m.toRole === 'all' ||
        (m.toRole === 'tenant' && (!m.toApartment || m.toApartment === apartment))
      );
    return false;
  });

  const sent = messages.filter((m) => {
    if (role === 'admin') return m.fromRole === 'admin';
    if (role === 'owner') return m.fromRole === 'owner' && m.fromApartment === apartment;
    if (role === 'tenant') return m.fromRole === 'tenant' && m.fromApartment === apartment;
    return false;
  });

  const unread = inbox.filter((m) => !m.readBy.includes(readerKey)).length;

  const openMessage = (m: Message) => {
    setSelected(m);
    if (!m.readBy.includes(readerKey)) {
      markMessageRead(m.id, readerKey);
    }
  };

  const openCompose = (reply?: Message) => {
    if (reply) {
      setReplyTo(reply);
      setForm({
        toRole: reply.fromRole as Message['toRole'],
        toApartment: reply.fromApartment ?? '',
        subject: reply.subject.startsWith('RE:') ? reply.subject : `RE: ${reply.subject}`,
        body: '',
      });
    } else {
      setReplyTo(null);
      setForm({ toRole: role === 'admin' ? 'all' : 'admin', toApartment: '', subject: '', body: '' });
    }
    setComposeOpen(true);
  };

  const handleSend = () => {
    if (!form.subject.trim() || !form.body.trim()) {
      toast.error('Completa el asunto y el mensaje');
      return;
    }
    addMessage({
      fromRole: role as Message['fromRole'],
      fromName: user?.name ?? role,
      fromApartment: apartment,
      toRole: form.toRole,
      toApartment: form.toApartment || undefined,
      subject: form.subject,
      body: form.body,
      parentId: replyTo?.id,
    });
    toast.success('Mensaje enviado');
    setComposeOpen(false);
  };

  const MessageRow = ({ m, showFrom }: { m: Message; showFrom: boolean }) => {
    const isUnread = !m.readBy.includes(readerKey);
    return (
      <button
        className={cn(
          'w-full text-left p-4 border-b border-border hover:bg-accent/50 transition-colors',
          isUnread && 'bg-primary/5',
          selected?.id === m.id && 'bg-accent'
        )}
        onClick={() => openMessage(m)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isUnread && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
              <span className={cn('text-sm truncate', isUnread ? 'font-semibold' : 'font-medium')}>
                {showFrom ? m.fromName : toLabel(m)}
                {m.fromApartment && !showFrom ? '' : m.fromApartment ? ` (Depto. ${m.fromApartment})` : ''}
              </span>
            </div>
            <div className="text-sm text-foreground mt-0.5 truncate">{m.subject}</div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">{m.body.slice(0, 80)}…</div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(m.createdAt)}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Mensajes</h1>
          <p className="text-muted-foreground">Centro de comunicaciones del edificio</p>
        </div>
        <Button onClick={() => openCompose()}>
          <PenSquare className="mr-2 h-4 w-4" />
          Nuevo Mensaje
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
        {/* Left: list */}
        <Card className="overflow-hidden">
          <Tabs defaultValue="inbox">
            <CardHeader className="pb-0 border-b border-border">
              <TabsList className="w-full">
                <TabsTrigger value="inbox" className="flex-1 gap-2">
                  <Inbox className="h-4 w-4" />
                  Recibidos
                  {unread > 0 && (
                    <Badge className="h-5 px-1.5 text-xs">{unread}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Enviados
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="inbox" className="mt-0">
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {inbox.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                    <Inbox className="h-8 w-8" />
                    <p className="text-sm">Bandeja vacía</p>
                  </div>
                ) : (
                  inbox.map((m) => <MessageRow key={m.id} m={m} showFrom={true} />)
                )}
              </div>
            </TabsContent>

            <TabsContent value="sent" className="mt-0">
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {sent.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                    <Send className="h-8 w-8" />
                    <p className="text-sm">Sin mensajes enviados</p>
                  </div>
                ) : (
                  sent.map((m) => <MessageRow key={m.id} m={m} showFrom={false} />)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Right: message detail */}
        <Card>
          {selected ? (
            <div className="flex flex-col h-full">
              <CardHeader className="border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{selected.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>
                        De: {selected.fromName}
                        {selected.fromApartment ? ` (Depto. ${selected.fromApartment})` : ''}
                      </span>
                      <span>·</span>
                      <span>Para: {toLabel(selected)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(selected.createdAt)}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openCompose(selected)}>
                    <Reply className="mr-1 h-4 w-4" />
                    Responder
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{selected.body}</p>
              </CardContent>
            </div>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full py-24 text-muted-foreground gap-3">
              <Inbox className="h-10 w-10" />
              <p className="text-sm">Selecciona un mensaje para leerlo</p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{replyTo ? 'Responder mensaje' : 'Nuevo Mensaje'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Destination — admin only gets full options */}
            {role === 'admin' ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Destinatario</Label>
                  <Select
                    value={form.toRole}
                    onValueChange={(v) => setForm({ ...form, toRole: v as Message['toRole'], toApartment: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los residentes</SelectItem>
                      <SelectItem value="owner">Todos los propietarios</SelectItem>
                      <SelectItem value="tenant">Todos los arrendatarios</SelectItem>
                      <SelectItem value="owner">Departamento específico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Departamento (opcional)</Label>
                  <Select
                    value={form.toApartment}
                    onValueChange={(v) => setForm({ ...form, toApartment: v === 'all' ? '' : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {apartments.map((apt) => (
                        <SelectItem key={apt.id} value={apt.number}>
                          Depto. {apt.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-muted px-4 py-2 text-sm">
                <span className="text-muted-foreground">Para: </span>
                <span className="font-medium">Administración</span>
              </div>
            )}

            <div className="space-y-2">
              <Label>Asunto</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Asunto del mensaje"
              />
            </div>
            <div className="space-y-2">
              <Label>Mensaje</Label>
              <Textarea
                rows={6}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSend}>
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
