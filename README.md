# Sistema de Gestion de Gastos Comunes - Edificio El Mirador

Repositorio de entrega para el Examen Transversal de la asignatura RQY1102 Ingenieria de Software.

## Integrantes

- Matias Guerra
- Felipe Hernandez

## Descripcion del Proyecto

El Mirador es un prototipo funcional de alta fidelidad para la gestion de gastos comunes de un edificio residencial. La solucion busca reemplazar procesos manuales por una plataforma web que permita administrar residentes, departamentos, gastos, pagos, recibos, morosidad, reclamos, avisos, mensajes e informes financieros.

El sistema considera tres perfiles principales:

- Administrador: gestiona residentes, departamentos, gastos, pagos, morosos, reclamos, avisos, mensajes e informes.
- Propietario: revisa deuda, historial de pagos, recibos, reclamos, avisos y mensajes.
- Arrendatario: accede mediante codigo unico para revisar deudas, recibos, avisos y mensajes.

## Estructura de la Entrega

```text
Examen Transversal/
├── 01_Planilla_Requisitos_El_Mirador.xlsx
├── 02_Plan_Pruebas_El_Mirador.xlsx
├── 03_Casos_Prueba_Evidencias_El_Mirador.xlsx
├── 04_Control_Versiones_El_Mirador.xlsx
├── Carta_Gantt_El_Mirador.xlsx
├── DAS_Software_El_Mirador_2.6.docx
├── ElMirador_Presentacion.pptx
├── Guia para ejecutar Prototipo.txt
├── Capturas Prototipo/
├── Diagrama 4+1/
└── Prototipo/
```

## Documentos Principales

- `ElMirador_Presentacion.pptx`: presentacion final del proyecto.
- `DAS_Software_El_Mirador_2.6.docx`: documento de arquitectura de software.
- `01_Planilla_Requisitos_El_Mirador.xlsx`: requisitos funcionales y no funcionales.
- `02_Plan_Pruebas_El_Mirador.xlsx`: plan de pruebas basado en ISO/IEC 25010.
- `03_Casos_Prueba_Evidencias_El_Mirador.xlsx`: casos de prueba y evidencias.
- `04_Control_Versiones_El_Mirador.xlsx`: control de cambios del prototipo.
- `Carta_Gantt_El_Mirador.xlsx`: planificacion del proyecto.
- `Diagrama 4+1/`: diagramas de casos de uso, clases, componentes, actividad, despliegue y paquetes.
- `Capturas Prototipo/`: evidencias visuales de pantallas principales del sistema.

## Prototipo

El prototipo se encuentra en la carpeta:

```text
Prototipo/
```

Tecnologias utilizadas:

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Recharts
- Lucide React

## Como Ejecutar el Prototipo

Abrir una terminal y ejecutar:

```powershell
cd "D:\Respaldo\Analista Programador\Ingenieria de Software\Examen Transversal\Prototipo"
npm install
npm run dev
```

Luego abrir en el navegador:

```text
http://localhost:5173/
```

## Credenciales de Prueba

Administrador:

```text
Email: admin@elmirador.cl
Contrasena: cualquiera
```

Propietario:

```text
Email: propietario@elmirador.cl
Contrasena: cualquiera
```

Arrendatario:

```text
Codigo: ARR2024
```

## Alcance del MVP

El prototipo cubre los principales flujos definidos para el sistema:

- Inicio de sesion por rol.
- Gestion de residentes y departamentos.
- Registro de gastos comunes.
- Gestion de pagos y recibos.
- Identificacion de morosos.
- Reclamos y solicitudes.
- Avisos y mensajes internos.
- Informes financieros.
- Vista para propietario y arrendatario.

## Calidad y Pruebas

La evaluacion del prototipo se documenta mediante plan de pruebas y casos de prueba alineados a ISO/IEC 25010, considerando atributos como funcionalidad, usabilidad, seguridad, rendimiento, mantenibilidad y portabilidad.

## Repositorio

Repositorio GitHub:

```text
https://github.com/PelaoKratos/Prototipo--El-Mirador-.git
```
