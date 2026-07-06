import Link from 'next/link';
import { createClientAction, deleteClientAction } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SubmitButton } from '@/components/forms/submit-button';
import { dateOnly } from '@/lib/format';
import { getClientsList } from '@/lib/queries';

export default async function ClientesPage() {
  const clients = await getClientsList();

  return (
    <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Nuevo cliente</CardTitle>
            <p className="text-sm text-slate-500">Alta rápida para recepción o caja.</p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={createClientAction} className="space-y-3">
            <input name="full_name" placeholder="Nombre completo" required className="w-full" />
            <input name="document_number" placeholder="DNI o documento" className="w-full" />
            <input name="phone" placeholder="Celular" className="w-full" />
            <input name="email" placeholder="Correo" type="email" className="w-full" />
            <textarea name="notes" placeholder="Observaciones iniciales" rows={4} className="w-full" />
            <SubmitButton className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Registrar cliente</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Clientes registrados</CardTitle>
            <p className="text-sm text-slate-500">CRUD base ya conectado a Supabase.</p>
          </div>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <EmptyState title="Aún no hay clientes" description="Registra tu primer cliente desde el formulario lateral." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-3">Código</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Contacto</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3">Registro</th>
                    <th className="pb-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((row: any) => (
                    <tr key={row.id} className="border-t border-slate-100 align-top">
                      <td className="py-3 font-medium">{row.code}</td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-900">{row.full_name}</p>
                        <p className="text-xs text-slate-500">{row.document_number || 'Sin documento'}</p>
                      </td>
                      <td className="py-3">
                        <p>{row.phone || 'Sin celular'}</p>
                        <p className="text-xs text-slate-500">{row.email || 'Sin correo'}</p>
                      </td>
                      <td className="py-3">
                        <Badge className={row.status === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-3">{dateOnly(row.created_at)}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/clientes/${row.id}`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                            Ver ficha
                          </Link>
                          <form action={deleteClientAction}>
                            <input type="hidden" name="id" value={row.id} />
                            <button className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50">
                              Eliminar
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
