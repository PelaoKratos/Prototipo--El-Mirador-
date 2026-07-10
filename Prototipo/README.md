# El Mirador - Sistema de Gestión de Gastos Comunes

MVP completo de alta fidelidad para una aplicación web de gestión de gastos comunes para edificios residenciales.

## 🏢 Descripción

El Mirador es una plataforma moderna que permite a la administración, propietarios y arrendatarios gestionar gastos comunes, pagos, deudas, recibos, reclamos e informes financieros de manera digital.

## ✨ Características Principales

### Para Administradores
- **Dashboard Ejecutivo**: KPIs en tiempo real, gráficos de recaudación y morosidad
- **Gestión de Residentes**: CRUD completo con búsqueda y filtros
- **Gastos Comunes**: Registro y administración de gastos mensuales
- **Gestión de Pagos**: Confirmación de pagos y generación de recibos
- **Módulo de Reclamos**: Vista Kanban con drag & drop para gestionar solicitudes
- **Informes Financieros**: Gráficos analíticos y exportación a PDF/Excel
- **Identificación de Morosos**: Listado y notificación de deudores

### Para Propietarios
- **Dashboard Personal**: Vista de deuda actual, último pago y próximo vencimiento
- **Historial de Pagos**: Registro completo de transacciones
- **Descarga de Recibos**: Acceso a todos los recibos digitales
- **Pago en Línea**: Botón para realizar pagos de gastos comunes
- **Notificaciones**: Alertas y recordatorios importantes

### Para Arrendatarios
- **Acceso con Código Único**: Ingreso simplificado sin credenciales
- **Vista de Deudas**: Consulta de estado de cuenta del departamento
- **Historial de Pagos**: Visualización de pagos realizados
- **Descarga de Recibos**: Acceso a recibos del departamento
- **Información de Contacto**: Datos de la administración

## 🎨 Diseño

El sistema implementa un diseño moderno inspirado en:
- Stripe
- Notion
- Linear
- Airbnb
- Monday

### Paleta de Colores
- **Primario**: Azul #2563EB
- **Secundario**: Azul oscuro #0F172A
- **Éxito**: Verde #22C55E
- **Advertencia**: Amarillo #F59E0B
- **Error**: Rojo #EF4444
- **Fondo**: Gris muy claro #F8FAFC

### Características Visuales
- Diseño limpio y minimalista
- Bordes redondeados de 12px
- Sombras suaves
- Mucho espacio en blanco
- Responsive (escritorio, tablet y móvil)
- Apariencia SaaS premium

## 🔐 Credenciales de Acceso

### Administrador
- **Email**: admin@elmirador.cl
- **Contraseña**: cualquiera

### Propietario
- **Email**: propietario@elmirador.cl
- **Contraseña**: cualquiera

### Arrendatario
- **Código**: ARR2024

## 🛠️ Tecnologías Utilizadas

- **Framework**: React 18.3.1
- **Routing**: React Router 7
- **UI Components**: Radix UI
- **Estilos**: Tailwind CSS 4.1
- **Gráficos**: Recharts
- **Drag & Drop**: @dnd-kit
- **Iconos**: Lucide React
- **Notificaciones**: Sonner
- **Animaciones**: Motion
- **Formularios**: React Hook Form
- **Build Tool**: Vite

## 📁 Estructura del Proyecto

```
src/app/
├── components/
│   ├── ui/               # Componentes UI reutilizables
│   └── Layout.tsx        # Layout principal con sidebar
├── context/
│   └── AuthContext.tsx   # Contexto de autenticación
├── data/
│   └── mockData.ts       # Datos de demostración
├── lib/
│   └── utils.ts          # Utilidades y funciones helper
├── pages/
│   ├── admin/            # Páginas del administrador
│   ├── owner/            # Páginas del propietario
│   ├── tenant/           # Páginas del arrendatario
│   └── Login.tsx         # Pantalla de login
├── types/
│   └── index.ts          # Tipos TypeScript
└── App.tsx               # Componente principal con rutas
```

## 🚀 Funcionalidades Implementadas

### ✅ Pantallas Completas
1. Login con opciones de credenciales y código único
2. Dashboard Administrador con KPIs y gráficos
3. Gestión de Residentes (CRUD completo)
4. Gestión de Gastos Comunes
5. Gestión de Pagos con confirmación
6. Módulo de Reclamos con vista Kanban
7. Informes Financieros con gráficos analíticos
8. Dashboard Propietario
9. Portal Arrendatario

### 🎯 Características UX
- Máximo 3 clics para tareas principales
- Navegación intuitiva con sidebar colapsable
- Estados vacíos bien diseñados
- Mensajes de éxito y error (toast notifications)
- Indicadores visuales claros (badges de estado)
- Formularios validados
- Tablas con búsqueda y filtros
- Modales para creación/edición

### 📊 Componentes de Visualización
- KPI Cards con métricas en tiempo real
- Gráficos de barras para recaudación mensual
- Gráficos circulares para distribución de gastos
- Gráficos de línea para evolución temporal
- Tablas interactivas con ordenamiento
- Vista Kanban con drag & drop

## 🔄 Flujos de Usuario

### Administrador
1. Login → Dashboard con KPIs
2. Gestión de residentes (crear/editar/eliminar)
3. Registro de gastos comunes mensuales
4. Confirmación de pagos recibidos
5. Generación de recibos
6. Visualización de morosos
7. Gestión de reclamos (Kanban)
8. Generación de informes financieros

### Propietario
1. Login → Vista de deuda actual
2. Consulta de historial de pagos
3. Descarga de recibos
4. Pago de gastos comunes
5. Recepción de notificaciones

### Arrendatario
1. Ingreso con código único
2. Vista de deudas del departamento
3. Consulta de historial de pagos
4. Descarga de recibos disponibles
5. Información de contacto de administración

## 📝 Datos de Demostración

El sistema incluye datos mock para:
- 5 residentes (propietarios y arrendatarios)
- 3 meses de gastos comunes
- Historial de pagos variados (pagados, pendientes, vencidos)
- 4 reclamos en diferentes estados
- Gráficos con datos realistas

## 🎯 Próximos Pasos (Fuera del MVP)

- Integración con pasarelas de pago reales
- Sistema de notificaciones por email/SMS
- Módulo de reserva de espacios comunes
- Chat en vivo con administración
- App móvil nativa
- Exportación real a PDF/Excel
- Integración con sistemas contables
- Firma digital de documentos

## 📄 Licencia

Proyecto de demostración - El Mirador © 2026
