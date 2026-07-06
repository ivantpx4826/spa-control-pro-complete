import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitButton } from '@/components/forms/submit-button';
import { EmptyState } from '@/components/ui/empty-state';
import { money, dateTime } from '@/lib/format';
import { getClientDetail } from '@/lib/queries';
import { updateClientAction, upsertPatientRecordAction } from '../actions';

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getClientDetail(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Ficha del cliente</p>
          <h2 className="text-2xl font-bold text-slate-900">{data.client.full_name}</h2>
        </div>
        <Link href="/dashboard/clientes" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white">
          Volver a clientes
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Datos generales</CardTitle></CardHeader>
          <CardContent>
            <form action={updateClientAction} className="space-y-3">
              <input type="hidden" name="id" value={data.client.id} />
              <input name="full_name" defaultValue={data.client.full_name} required className="w-full" />
              <div className="grid gap-3 md:grid-cols-2">
                <input name="document_number" defaultValue={data.client.document_number ?? ''} placeholder="Documento" className="w-full" />
                <input name="phone" defaultValue={data.client.phone ?? ''} placeholder="Celular" className="w-full" />
              </div>
              <input name="email" type="email" defaultValue={data.client.email ?? ''} placeholder="Correo" className="w-full" />
              <select name="status" defaultValue={data.client.status} className="w-full">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="frecuente">Frecuente</option>
              </select>
              <textarea name="notes" defaultValue={data.client.notes ?? ''} rows={4} placeholder="Notas" className="w-full" />
              <SubmitButton>Guardar cambios</SubmitButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Historial clínico y observaciones</CardTitle></CardHeader>
          <CardContent>
            <form action={upsertPatientRecordAction} className="space-y-3">
              <input type="hidden" name="client_id" value={data.client.id} />
              <input type="hidden" name="record_id" defaultValue={data.record?.id ?? ''} />
              <input name="skin_type" defaultValue={data.record?.skin_type ?? ''} placeholder="Tipo de piel" className="w-full" />
              <textarea name="allergies" defaultValue={data.record?.allergies ?? ''} rows={3} placeholder="Alergias" className="w-full" />
              <textarea name="restrictions" defaultValue={data.record?.restrictions ?? ''} rows={3} placeholder="Restricciones" className="w-full" />
              <textarea name="observations" defaultValue={data.record?.observations ?? ''} rows={4} placeholder="Observaciones del especialista" className="w-full" />
              <SubmitButton>Guardar historial</SubmitButton>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Citas del cliente</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.appointments.length === 0 ? (
              <EmptyState title="Sin citas registradas" description="Aquí aparecerán las atenciones y reservas asociadas al cliente." />
            ) : (
              data.appointments.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.services?.name ?? 'Servicio'}</p>
                      <p className="text-sm text-slate-500">{dateTime(item.start_at)}</p>
                    </div>
                    <p className="text-sm font-medium text-brand">{item.status}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Especialista: {item.profiles?.full_name ?? 'No asignado'}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pagos del cliente</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.payments.length === 0 ? (
              <EmptyState title="Sin pagos registrados" description="Los pagos vinculados al cliente se mostrarán aquí." />
            ) : (
              data.payments.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{money(item.amount)}</p>
                    <p className="text-sm text-slate-500">{item.method} · {dateTime(item.paid_at)}</p>
                  </div>
                  <p className="text-sm font-medium text-emerald-700">{item.status}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
