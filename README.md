# Spa Control Pro Complete

Base avanzada de un sistema de spa lista para implementar sobre **Next.js + TypeScript + Supabase + Vercel + GitHub**.

## Qué incluye esta versión

- Login con Supabase Auth
- Middleware base de protección para `/dashboard`
- Dashboard ejecutivo con KPIs y bloque de realtime preparado
- CRUD de clientes, servicios, citas, compras de productos, pagos e inventario
- Ficha de paciente con historial clínico
- Gestión de usuarios con actualización de rol y estado
- Cola de notificaciones y endpoint para WhatsApp Cloud API
- Auditoría automática sobre clientes, citas, pagos e inventario
- SQL mejorado con RLS por rol, triggers y cola de eventos
- Vistas listas para reportería gerencial

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, RLS, Realtime)
- Vercel
- GitHub

## Pasos de instalación

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
META_VERIFY_TOKEN=
```

## Configuración en Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `sql/001_schema.sql`.
3. Ejecuta `sql/002_seed.sql`.
4. Ejecuta `sql/003_services_sales_vouchers.sql`.
5. Activa **Realtime** para `appointments` y `payments`.
6. Crea usuarios en **Authentication**.
7. Inserta perfiles en `profiles` con sus roles.
8. Despliega en Vercel conectando tu repositorio de GitHub.

## Módulos funcionales

### Operación
- clientes
- servicios
- citas
- compras de productos
- pagos
- inventario
- historial del paciente

### Gestión
- usuarios y roles
- reportes
- dashboard gerencial
- auditoría
- cola de notificaciones

### Integraciones
- endpoint para WhatsApp Cloud API
- triggers SQL que encolan eventos por cita y pago
- realtime preparado en frontend para agenda y caja

## Qué queda pendiente antes de producción

- endurecer aún más RLS por sede o por especialista si aplica
- mostrar mensajes flash y manejo fino de errores
- procesar la cola de notificaciones automáticamente
- exportación PDF/Excel
- pruebas unitarias y E2E
- diseño de branding final y UX fina

## Recomendación de uso

Esta versión ya te sirve como **base implementable seria**. Lo siguiente sería conectar producción real con:
- usuarios reales en Auth
- servicios y especialistas del negocio
- plantillas oficiales de WhatsApp
- reportes gerenciales adaptados a tu operación
