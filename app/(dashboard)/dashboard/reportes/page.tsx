import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { money } from '@/lib/format';
import { getReportsData } from '@/lib/queries';

export default async function ReportesPage() {
  const data = await getReportsData();

  const serviceCount = new Map<string, number>();
  for (const row of data.serviceRows as any[]) {
    const name = row.services?.name ?? 'Sin servicio';
    serviceCount.set(name, (serviceCount.get(name) ?? 0) + 1);
  }
  const topServices = [...serviceCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const statusCount = new Map<string, number>();
  for (const row of data.statusRows as any[]) {
    statusCount.set(row.status, (statusCount.get(row.status) ?? 0) + 1);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Ventas por mes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.salesSummary.length === 0 ? (
            <EmptyState title="Sin ventas registradas" description="Los pagos alimentarán automáticamente este consolidado mensual." />
          ) : (
            (data.salesSummary as any[]).map((row) => (
              <div key={row.month} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <span>{new Date(row.month).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}</span>
                <span className="font-semibold">{money(row.total_amount)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Top servicios</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {topServices.length === 0 ? (
            <EmptyState title="Aún no hay tendencia" description="Cuando registres citas, podrás ver los servicios más demandados." />
          ) : topServices.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
              <span>{name}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Estado de las citas</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[...statusCount.entries()].map(([status, count]) => (
            <div key={status} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
              <span>{status}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Alertas de inventario</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {(data.inventoryItems as any[]).length === 0 ? (
            <EmptyState title="Sin inventario" description="Carga insumos y materiales para visualizar alertas de stock crítico." />
          ) : (
            (data.inventoryItems as any[]).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span>{item.name}</span>
                <span className={item.current_stock <= item.minimum_stock ? 'font-semibold text-rose-600' : 'font-semibold text-emerald-700'}>
                  {item.current_stock} / mín. {item.minimum_stock}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
