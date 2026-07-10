import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Home,
  Users,
  Building,
  Receipt,
  CreditCard,
  AlertCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  UserX,
  FileText,
  Megaphone,
  MessageCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { getUnreadMessageCount, getUnreadAnnouncementCount } = useData();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const role = user?.role ?? 'owner';
  const apartment = user?.apartmentNumber;
  const unreadMessages = getUnreadMessageCount(role, apartment);
  const unreadAnnouncements = getUnreadAnnouncementCount(role);

  const adminNavItems = [
    { icon: Home, label: 'Inicio', href: '/admin' },
    { icon: Users, label: 'Residentes', href: '/admin/residentes' },
    { icon: Building, label: 'Departamentos', href: '/admin/departamentos' },
    { icon: Receipt, label: 'Gastos Comunes', href: '/admin/gastos' },
    { icon: CreditCard, label: 'Pagos', href: '/admin/pagos' },
    { icon: UserX, label: 'Morosos', href: '/admin/morosos' },
    { icon: BarChart3, label: 'Informes', href: '/admin/informes' },
    { icon: MessageSquare, label: 'Reclamos', href: '/admin/reclamos' },
    { icon: Megaphone, label: 'Tablón de Avisos', href: '/admin/avisos', badge: unreadAnnouncements },
    { icon: MessageCircle, label: 'Mensajes', href: '/mensajes', badge: unreadMessages },
    { icon: Settings, label: 'Configuración', href: '/admin/configuracion' },
  ];

  const ownerNavItems = [
    { icon: Home, label: 'Inicio', href: '/propietario' },
    { icon: CreditCard, label: 'Mis Pagos', href: '/propietario/pagos' },
    { icon: FileText, label: 'Recibos', href: '/propietario/recibos' },
    { icon: MessageSquare, label: 'Reclamos', href: '/propietario/reclamos' },
    { icon: Megaphone, label: 'Avisos', href: '/avisos', badge: unreadAnnouncements },
    { icon: MessageCircle, label: 'Mensajes', href: '/mensajes', badge: unreadMessages },
  ];

  const tenantNavItems = [
    { icon: Home, label: 'Inicio', href: '/arrendatario' },
    { icon: AlertCircle, label: 'Mis Pagos', href: '/arrendatario/pagos' },
    { icon: FileText, label: 'Recibos', href: '/arrendatario/recibos' },
    { icon: Megaphone, label: 'Avisos', href: '/avisos', badge: unreadAnnouncements },
    { icon: MessageCircle, label: 'Mensajes', href: '/mensajes', badge: unreadMessages },
  ];

  const navItems =
    role === 'admin' ? adminNavItems : role === 'owner' ? ownerNavItems : tenantNavItems;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-card transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <h1 className="text-xl font-semibold text-primary">El Mirador</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const badge = (item as any).badge ?? 0;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                )}
              >
                <div className="relative flex-shrink-0">
                  <Icon className="h-5 w-5" />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-border p-3">
          {sidebarOpen && (
            <div className="mb-3 px-2">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || user?.apartmentNumber}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            className={cn('w-full justify-start gap-3', !sidebarOpen && 'px-3')}
            onClick={logout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
};
