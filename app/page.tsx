import Link from 'next/link';
import { CalendarDays, ChartColumn, MessageCircleMore, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Agenda inteligente',
    description: 'Controla citas, estados, recordatorios y disponibilidad por especialista.'
  },
  {
    icon: MessageCircleMore,
    title: 'Automatización por WhatsApp',
    description: 'Prepara confirmaciones, recordatorios y avisos de pago desde eventos del sistema.'
  },
  {
    icon: ChartColumn,
    title: 'Reportería gerencial',
    description: 'Mide ventas, cancelaciones, ocupación, servicios más vendidos y clientes frecuentes.'
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad y auditoría',
    description: 'Roles, trazabilidad de cambios y políticas RLS listas para reforzar.'
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-fuchsia-50 to-slate-50">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
        <div className="space-y-8">
          <span className="inline-flex rounded-full bg-brand/10 px-4 py-2 text-sm font-medium text-brand">
            Starter profesional para spa con Next.js + Supabase
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Administra tu spa desde celular y PC con una vista moderna, intuitiva y escalable.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Esta base incluye estructura de módulos, SQL para Supabase, panel gerencial, historial del paciente,
              notificaciones, auditoría y puntos de integración para WhatsApp y reportes ejecutivos.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="rounded-2xl bg-brand px-6 py-3 font-semibold text-white shadow-card hover:bg-brand-dark">
              Entrar al sistema
            </Link>
            <Link href="/dashboard" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-card hover:border-brand hover:text-brand">
              Ver dashboard demo
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-card backdrop-blur">
                <div className="mb-3 inline-flex rounded-2xl bg-brand-soft p-3 text-brand">
                  <Icon size={22} />
                </div>
                <h2 className="mb-2 text-lg font-semibold">{title}</h2>
                <p className="text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-white/70 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Resumen de hoy</p>
              <h2 className="text-2xl font-bold">Spa Control Pro</h2>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">En línea</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Ventas del día', 'S/ 1,850'],
              ['Citas confirmadas', '18'],
              ['Pagos pendientes', '4'],
              ['Stock crítico', '3']
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-300">Automatizaciones</p>
            <h3 className="mt-2 text-xl font-semibold">Eventos listos para disparar</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>• Confirmación de cita por WhatsApp</li>
              <li>• Aviso automático de pago registrado</li>
              <li>• Recordatorio de cita 24 horas antes</li>
              <li>• Alerta interna por stock bajo</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
