import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithCode } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      toast.success('Sesión iniciada correctamente');

      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedUser.role === 'tenant') {
        navigate('/arrendatario');
      } else {
        navigate('/propietario');
      }
    } catch (error) {
      toast.error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loggedUser = await loginWithCode(code);
      toast.success('Acceso autorizado');
      navigate(loggedUser.role === 'tenant' ? '/arrendatario' : '/propietario');
    } catch (error) {
      toast.error('Código inválido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">El Mirador</CardTitle>
            <CardDescription>Sistema de Gestión de Gastos Comunes</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credentials">Con Credenciales</TabsTrigger>
              <TabsTrigger value="code">Con Código</TabsTrigger>
            </TabsList>

            <TabsContent value="credentials">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-end">
                  <a href="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                <div className="rounded-lg bg-muted p-3 text-xs">
                  <p className="font-medium mb-1">Cuentas de demostración:</p>
                  <p>Admin: admin@elmirador.cl</p>
                  <p>Propietario: juan.perez@email.com</p>
                  <p className="mt-1 text-muted-foreground">Contraseña: cualquiera</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="code">
              <form onSubmit={handleCodeLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Arrendatario</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="ARR2024"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verificando...' : 'Ingresar'}
                </Button>

                <div className="rounded-lg bg-muted p-3 text-xs">
                  <p className="font-medium mb-1">Código de demostración:</p>
                  <p>ARR2024</p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
