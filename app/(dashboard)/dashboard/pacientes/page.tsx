import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { getPatientsHistory } from '@/lib/queries';

export default async function PacientesPage() {
  const records = await getPatientsHistory();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Historial de pacientes</CardTitle>
          <p className="text-sm text-slate-500">Vista consolidada del expediente y seguimiento.</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {records.length === 0 ? (
          <EmptyState title="Sin historial cargado" description="Completa la ficha de un cliente para comenzar a consolidar su expediente." />
        ) : (
          records.map((record: any) => (
            <div key={record.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{record.clients?.full_name ?? 'Cliente'}</p>
                  <p className="text-sm text-slate-500">{record.clients?.phone ?? 'Sin teléfono'} · {record.skin_type || 'Tipo de piel no definido'}</p>
                </div>
                <Link href={`/dashboard/clientes/${record.client_id}`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Abrir ficha
                </Link>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Alergias:</strong> {record.allergies || 'Sin datos'}</div>
                <div className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Restricciones:</strong> {record.restrictions || 'Sin datos'}</div>
                <div className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Observaciones:</strong> {record.observations || 'Sin datos'}</div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
