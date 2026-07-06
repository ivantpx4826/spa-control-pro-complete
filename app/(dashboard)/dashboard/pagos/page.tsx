import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SubmitButton } from '@/components/forms/submit-button';
import { money, dateTime } from '@/lib/format';
import { getPaymentsPageData } from '@/lib/queries';
import { createPaymentAction, deletePaymentAction, updatePaymentAction } from './actions';

export default async function PagosPage() {
  const { payments, clients, appointments } = await getPaymentsPageData();

  return (
    <div className="grid gap-6 xl:grid-cols-[400px,1fr]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Registrar pago</CardTitle>
            <p className="text-sm text-slate-500">Pagos de citas, compras y comprobantes adjuntos.</p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={createPaymentAction} className="space-y-3">
            <select name="client_id" required className="w-full">
              <option value="">Selecciona cliente</option>
              {clients.map((client: any) => <option key={client.id} value={client.id}>{client.full_name}</option>)}
            </select>
            <select name="appointment_id" className="w-full">
              <option value="">Sin cita asociada</option>
              {appointments.map((appointment: any) => (
                <option key={appointment.id} value={appointment.id}>
                  {new Date(appointment.start_at).toLocaleDateString('es-PE')} - {appointment.id.slice(0, 8)}
                </option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <input name="amount" type="number" step="0.01" min="0" placeholder="Monto" required className="w-full" />
              <select name="method" className="w-full" defaultValue="Yape">
                <option>Yape</option>
                <option>Plin</option>
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Transferencia</option>
              </select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <select name="status" className="w-full" defaultValue="registered">
                <option value="registered">Registrado</option>
                <option value="validated">Validado</option>
                <option value="pending">Pendiente</option>
              </select>
              <input name="paid_at" type="datetime-local" className="w-full" />
            </div>
            <input name="voucher" type="file" accept="image/*,.pdf" className="w-full" />
            <SubmitButton className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Guardar pago</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pagos recientes</CardTitle>
            <p className="text-sm text-slate-500">Edicion rapida de metodo, estado y voucher.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {payments.length === 0 ? (
            <EmptyState title="Sin pagos" description="Los pagos registrados se reflejaran aqui y alimentaran los indicadores del panel." />
          ) : (
            payments.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.clients?.full_name ?? 'Cliente'}</p>
                    <p className="text-sm text-slate-500">{money(item.amount)} - {dateTime(item.paid_at)}</p>
                    {item.voucher_url ? (
                      <a href={item.voucher_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-brand hover:underline">
                        Ver voucher
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400">Sin voucher adjunto</p>
                    )}
                  </div>
                  <form action={deletePaymentAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50">Eliminar</button>
                  </form>
                </div>
                <form action={updatePaymentAction} className="mt-4 grid gap-3 md:grid-cols-[1fr,1fr,1.2fr,auto]">
                  <input type="hidden" name="id" value={item.id} />
                  <select name="method" defaultValue={item.method} className="w-full">
                    <option>Yape</option>
                    <option>Plin</option>
                    <option>Efectivo</option>
                    <option>Tarjeta</option>
                    <option>Transferencia</option>
                  </select>
                  <select name="status" defaultValue={item.status} className="w-full">
                    <option value="registered">Registrado</option>
                    <option value="validated">Validado</option>
                    <option value="pending">Pendiente</option>
                  </select>
                  <input name="voucher" type="file" accept="image/*,.pdf" className="w-full" />
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
