import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNotificationsLog } from '@/lib/queries';
import { createNotificationLogAction } from './actions';
import { SubmitButton } from '@/components/forms/submit-button';
import { dateTime } from '@/lib/format';

export default async function NotificacionesPage() {
  const logs = await getNotificationsLog();
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Disparar notificación manual</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createNotificationLogAction} className="space-y-3">
            <input name="event_name" placeholder="payment_registered" className="w-full rounded-xl border border-slate-200 px-3 py-2" required />
            <input name="recipient" placeholder="51999999999" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
            <input name="entity" placeholder="payment" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
            <textarea name="message" placeholder="Mensaje para WhatsApp" className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2" required />
            <SubmitButton>Guardar en cola</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bitácora de notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.map((log: any) => (
            <div key={log.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{log.event_name}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{log.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Canal: {log.channel} · Destino: {log.recipient ?? 'sin destino'}</p>
              <p className="mt-1 text-sm text-slate-500">{dateTime(log.created_at)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
