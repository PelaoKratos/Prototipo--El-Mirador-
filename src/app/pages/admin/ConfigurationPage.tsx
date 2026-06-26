import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Building, Bell, CreditCard, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

export const ConfigurationPage = () => {
  const [buildingForm, setBuildingForm] = useState({
    name: 'El Mirador',
    address: 'Av. Las Condes 1234, Las Condes',
    city: 'Santiago',
    adminName: 'Roberto Sánchez',
    adminEmail: 'admin@elmirador.cl',
    adminPhone: '+56 2 2345 6789',
    totalApartments: '8',
    floors: '5',
  });

  const [paymentForm, setPaymentForm] = useState({
    dueDay: '15',
    lateFeePercent: '3',
    gracePeriodDays: '5',
    bankName: 'Banco Estado',
    accountNumber: '1234567890',
    accountType: 'Cuenta Corriente',
  });

  const [notifications, setNotifications] = useState({
    emailPaymentReminder: true,
    emailOverdue: true,
    emailReceipt: true,
    smsReminder: false,
    smsOverdue: false,
    daysBeforeReminder: '5',
  });

  const handleSaveBuilding = () => {
    toast.success('Configuración del edificio guardada');
  };

  const handleSavePayment = () => {
    toast.success('Configuración de pagos guardada');
  };

  const handleSaveNotifications = () => {
    toast.success('Configuración de notificaciones guardada');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Configuración</h1>
        <p className="text-muted-foreground">Administra los parámetros del sistema</p>
      </div>

      <Tabs defaultValue="building">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="building">
            <Building className="mr-2 h-4 w-4" />
            Edificio
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Building Tab */}
        <TabsContent value="building">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Edificio</CardTitle>
                <CardDescription>Datos generales del condominio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre del Edificio</Label>
                  <Input
                    value={buildingForm.name}
                    onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dirección</Label>
                  <Input
                    value={buildingForm.address}
                    onChange={(e) => setBuildingForm({ ...buildingForm, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ciudad</Label>
                  <Input
                    value={buildingForm.city}
                    onChange={(e) => setBuildingForm({ ...buildingForm, city: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>N° de Unidades</Label>
                    <Input
                      type="number"
                      value={buildingForm.totalApartments}
                      onChange={(e) => setBuildingForm({ ...buildingForm, totalApartments: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>N° de Pisos</Label>
                    <Input
                      type="number"
                      value={buildingForm.floors}
                      onChange={(e) => setBuildingForm({ ...buildingForm, floors: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datos del Administrador</CardTitle>
                <CardDescription>Información de contacto de la administración</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={buildingForm.adminName}
                    onChange={(e) => setBuildingForm({ ...buildingForm, adminName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email de Administración</Label>
                  <Input
                    type="email"
                    value={buildingForm.adminEmail}
                    onChange={(e) => setBuildingForm({ ...buildingForm, adminEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={buildingForm.adminPhone}
                    onChange={(e) => setBuildingForm({ ...buildingForm, adminPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horario de Atención</Label>
                  <Input defaultValue="Lunes a Viernes, 9:00 - 18:00" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveBuilding}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Parámetros de Cobro</CardTitle>
                <CardDescription>Configuración de vencimientos y multas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Día de Vencimiento Mensual</Label>
                  <Input
                    type="number"
                    min={1}
                    max={28}
                    value={paymentForm.dueDay}
                    onChange={(e) => setPaymentForm({ ...paymentForm, dueDay: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Los gastos comunes vencen el día {paymentForm.dueDay} de cada mes
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Días de Gracia</Label>
                  <Input
                    type="number"
                    min={0}
                    value={paymentForm.gracePeriodDays}
                    onChange={(e) => setPaymentForm({ ...paymentForm, gracePeriodDays: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Multa por Mora (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={paymentForm.lateFeePercent}
                    onChange={(e) => setPaymentForm({ ...paymentForm, lateFeePercent: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datos Bancarios</CardTitle>
                <CardDescription>Cuenta para recepción de pagos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Banco</Label>
                  <Input
                    value={paymentForm.bankName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número de Cuenta</Label>
                  <Input
                    value={paymentForm.accountNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Cuenta</Label>
                  <Input
                    value={paymentForm.accountType}
                    onChange={(e) => setPaymentForm({ ...paymentForm, accountType: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>RUT del Condominio</Label>
                  <Input defaultValue="12.345.678-9" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSavePayment}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones por Email</CardTitle>
              <CardDescription>Configuración de correos automáticos a residentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorio de pago</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar aviso días antes del vencimiento
                  </p>
                </div>
                <Switch
                  checked={notifications.emailPaymentReminder}
                  onCheckedChange={(v) => setNotifications({ ...notifications, emailPaymentReminder: v })}
                />
              </div>

              {notifications.emailPaymentReminder && (
                <div className="ml-4 space-y-2 border-l-2 pl-4">
                  <Label>Días antes del vencimiento</Label>
                  <Input
                    type="number"
                    min={1}
                    max={15}
                    className="w-24"
                    value={notifications.daysBeforeReminder}
                    onChange={(e) => setNotifications({ ...notifications, daysBeforeReminder: e.target.value })}
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Aviso de morosidad</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar cuando un pago esté vencido
                  </p>
                </div>
                <Switch
                  checked={notifications.emailOverdue}
                  onCheckedChange={(v) => setNotifications({ ...notifications, emailOverdue: v })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Envío de recibos</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar recibo al confirmar un pago
                  </p>
                </div>
                <Switch
                  checked={notifications.emailReceipt}
                  onCheckedChange={(v) => setNotifications({ ...notifications, emailReceipt: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notificaciones por SMS</CardTitle>
              <CardDescription>Requiere integración con proveedor SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorio SMS</Label>
                  <p className="text-sm text-muted-foreground">Recordatorio de pago por mensaje</p>
                </div>
                <Switch
                  checked={notifications.smsReminder}
                  onCheckedChange={(v) => setNotifications({ ...notifications, smsReminder: v })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Aviso de morosidad SMS</Label>
                  <p className="text-sm text-muted-foreground">Notificación de deuda vencida por SMS</p>
                </div>
                <Switch
                  checked={notifications.smsOverdue}
                  onCheckedChange={(v) => setNotifications({ ...notifications, smsOverdue: v })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveNotifications}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad y Acceso
          </CardTitle>
          <CardDescription>Gestión de credenciales del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4 space-y-1">
              <p className="font-medium text-sm">Administrador</p>
              <p className="text-sm text-muted-foreground">admin@elmirador.cl</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info('Funcionalidad disponible en versión completa')}>
                Cambiar Contraseña
              </Button>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="font-medium text-sm">Portal Propietario</p>
              <p className="text-sm text-muted-foreground">Cualquier propietario activo registrado</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info('Funcionalidad disponible en versión completa')}>
                Cambiar Contraseña
              </Button>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="font-medium text-sm">Código Arrendatario</p>
              <p className="text-sm text-muted-foreground font-mono">ARR2024</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info('Funcionalidad disponible en versión completa')}>
                Regenerar Código
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
