import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { money, dateTime } from '@/lib/format';
import { getDashboardSnapshot } from '@/lib/queries';
import { RealtimeStatus } from '@/components/dashboard/realtime-status';

export default async function DashboardPage() {
  const data = await getDashboardSnapshot();
  const cards = [
    { label: 'Clientes activos', value: String(data.clientsCount), hint: 'Base operativa registrada' },
    { label: 'Citas abiertas', value: String(data.pendingAppointments), hint: 'Pendientes o en curso' },
    { label: 'Ingresos recientes', value: money(data.monthlyIncome), hint: 'Suma de pagos recientes' },
    { label: 'Alertas de stock', value: String(data.lowStock), hint: 'Productos por debajo del mínimo' }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle className="text-base">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-2 text-sm text-slate-500">{card.hint}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <RealtimeStatus />

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Agenda reciente</CardTitle>
              <p className="text-sm text-slate-500">Lectura real desde Supabase para recepción y especialistas.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentAppointments.length === 0 ? (
              <EmptyState title="Aún no hay citas" description="Cuando registres citas, aparecerán aquí con su fecha y estado." />
            ) : (
              data.recentAppointments.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{dateTime(item.start_at)}</p>
                    <p className="text-sm text-slate-500">Cliente: {item.clients?.full_name ?? 'Sin cliente'}</p>
                  </div>
                  <Badge className="bg-fuchsia-100 text-fuchsia-700">{item.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Tendencia de ventas</CardTitle>
              <p className="text-sm text-slate-500">Resumen mensual desde la vista `v_sales_summary`.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.salesSummary.length === 0 ? (
              <EmptyState title="Sin movimientos registrados" description="Los pagos que cargues alimentarán automáticamente esta sección." />
            ) : (
              data.salesSummary.map((row: any) => (
                <div key={row.month} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>{new Date(row.month).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}</span>
                  <span className="font-semibold">{money(row.total_amount)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
