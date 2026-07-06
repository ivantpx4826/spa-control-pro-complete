import type { KPI, PatientRecord } from '@/types/domain';

export const kpis: KPI[] = [
  { label: 'Ventas del día', value: 'S/ 1,850', hint: '+12% vs ayer' },
  { label: 'Citas confirmadas', value: '18', hint: '4 pendientes de confirmar' },
  { label: 'Clientes atendidos', value: '14', hint: '2 nuevos' },
  { label: 'Alertas críticas', value: '3', hint: 'Inventario y pagos' }
];

export const patients: PatientRecord[] = [
  {
    id: 'PAC-001',
    fullName: 'Ana López',
    phone: '987654321',
    lastVisit: '2026-06-28',
    upcomingVisit: '2026-07-05 16:00',
    allergies: 'Piel sensible a ácidos',
    status: 'frecuente'
  },
  {
    id: 'PAC-002',
    fullName: 'Carla Mendoza',
    phone: '912345678',
    lastVisit: '2026-06-26',
    upcomingVisit: '2026-07-02 11:00',
    allergies: 'Sin restricciones registradas',
    status: 'activo'
  },
  {
    id: 'PAC-003',
    fullName: 'Lucía Ramos',
    phone: '976112233',
    lastVisit: '2026-06-20',
    upcomingVisit: '2026-07-03 18:30',
    allergies: 'Alergia a aceites con fragancia intensa',
    status: 'nuevo'
  }
];

export const salesTrend = [
  { month: 'Ene', total: 9200 },
  { month: 'Feb', total: 10100 },
  { month: 'Mar', total: 11500 },
  { month: 'Abr', total: 12300 },
  { month: 'May', total: 14100 },
  { month: 'Jun', total: 15750 }
];

export const topServices = [
  { name: 'Limpieza facial', total: 42 },
  { name: 'Masaje relajante', total: 38 },
  { name: 'Drenaje linfático', total: 24 },
  { name: 'Peeling químico', total: 19 }
];

export const notifications = [
  { event: 'Cita confirmada', channel: 'WhatsApp', status: 'Pendiente de plantilla Meta' },
  { event: 'Pago registrado', channel: 'WhatsApp', status: 'Listo para endpoint server-side' },
  { event: 'Stock bajo', channel: 'Interna', status: 'Regla de negocio pendiente' }
];
