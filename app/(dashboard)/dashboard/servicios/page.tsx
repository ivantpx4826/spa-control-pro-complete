import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SubmitButton } from '@/components/forms/submit-button';
import { money } from '@/lib/format';
import { getServicesPageData } from '@/lib/queries';
import { createServiceAction, deleteServiceAction, updateServiceAction } from './actions';

export default async function ServiciosPage() {
  const services = await getServicesPageData();

  return (
    <div className="grid gap-6 xl:grid-cols-[400px,1fr]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Nuevo servicio</CardTitle>
            <p className="text-sm text-slate-500">Catalogo usado al registrar citas.</p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={createServiceAction} className="space-y-3">
            <input name="name" placeholder="Nombre del servicio" required className="w-full" />
            <textarea name="description" placeholder="Descripcion" rows={3} className="w-full" />
            <div className="grid gap-3 md:grid-cols-2">
              <input name="duration_minutes" type="number" min="1" placeholder="Minutos" required className="w-full" />
              <input name="price" type="number" step="0.01" min="0" placeholder="Precio" required className="w-full" />
            </div>
            <select name="is_active" defaultValue="true" className="w-full">
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <SubmitButton className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Guardar servicio</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Servicios disponibles</CardTitle>
            <p className="text-sm text-slate-500">Precios y duracion para agenda y caja.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.length === 0 ? (
            <EmptyState title="Sin servicios" description="Registra servicios para usarlos en citas." />
          ) : (
            services.map((service: any) => (
              <div key={service.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{service.name}</p>
                    <p className="text-sm text-slate-500">{money(service.price)} · {service.duration_minutes} min</p>
                  </div>
                  <Badge className={service.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}>
                    {service.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <form action={updateServiceAction} className="grid gap-3 md:grid-cols-[1fr,1fr,120px,120px,auto]">
                  <input type="hidden" name="id" value={service.id} />
                  <input name="name" defaultValue={service.name} className="w-full" />
                  <input name="description" defaultValue={service.description ?? ''} placeholder="Descripcion" className="w-full" />
                  <input name="duration_minutes" type="number" min="1" defaultValue={service.duration_minutes} className="w-full" />
                  <input name="price" type="number" step="0.01" min="0" defaultValue={service.price} className="w-full" />
                  <div className="flex gap-2">
                    <select name="is_active" defaultValue={String(service.is_active)} className="w-full">
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                    <SubmitButton className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Guardar</SubmitButton>
                  </div>
                </form>
                <form action={deleteServiceAction} className="mt-3">
                  <input type="hidden" name="id" value={service.id} />
                  <button className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50">Eliminar</button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
