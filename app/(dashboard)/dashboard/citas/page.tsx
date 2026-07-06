import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SubmitButton } from '@/components/forms/submit-button';
import { dateTime } from '@/lib/format';
import { getAppointmentsPageData } from '@/lib/queries';
import { createAppointmentAction, deleteAppointmentAction, updateAppointmentAction } from './actions';

export default async function CitasPage() {
  const { appointments, clients, services, specialists } = await getAppointmentsPageData();

  return (
    <div className="grid gap-6 xl:grid-cols-[400px,1fr]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Nueva cita</CardTitle>
            <p className="text-sm text-slate-500">Registro operativo para agenda y recordatorios.</p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={createAppointmentAction} className="space-y-3">
            <select name="client_id" required className="w-full">
              <option value="">Selecciona cliente</option>
              {clients.map((client: any) => <option key={client.id} value={client.id}>{client.full_name}</option>)}
            </select>
            <select name="service_id" required className="w-full">
              <option value="">Selecciona servicio</option>
              {services.map((service: any) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
            <select name="specialist_id" className="w-full">
              <option value="">Especialista</option>
              {specialists.map((specialist: any) => <option key={specialist.id} value={specialist.id}>{specialist.full_name}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <input name="start_at" type="datetime-local" required className="w-full" />
              <input name="end_at" type="datetime-local" required className="w-full" />
            </div>
            <textarea name="notes" rows={3} placeholder="Notas de la cita" className="w-full" />
            <SubmitButton className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Registrar cita</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Agenda</CardTitle>
            <p className="text-sm text-slate-500">Base real para luego activar Supabase Realtime.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.length === 0 ? (
            <EmptyState title="No hay citas" description="Cuando registres reservas, aparecerán aquí con edición rápida de estado." />
          ) : (
            appointments.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.clients?.full_name ?? 'Cliente'}</p>
                    <p className="text-sm text-slate-500">{item.services?.name ?? 'Servicio'} · {dateTime(item.start_at)}</p>
                    <p className="text-xs text-slate-400">Especialista: {item.profiles?.full_name ?? 'No asignado'}</p>
                  </div>
                  <form action={deleteAppointmentAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50">Eliminar</button>
                  </form>
                </div>
                <form action={updateAppointmentAction} className="mt-4 grid gap-3 md:grid-cols-[1fr,1fr,1.2fr,auto]">
                  <input type="hidden" name="id" value={item.id} />
                  <select name="status" defaultValue={item.status} className="w-full">
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="in_progress">En curso</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                  <select name="specialist_id" defaultValue={item.specialist_id ?? ''} className="w-full">
                    <option value="">Sin especialista</option>
                    {specialists.map((specialist: any) => <option key={specialist.id} value={specialist.id}>{specialist.full_name}</option>)}
                  </select>
                  <input name="notes" defaultValue={item.notes ?? ''} placeholder="Notas" className="w-full" />
                  <SubmitButton className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Actualizar</SubmitButton>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
