import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInventoryPageData } from '@/lib/queries';
import { createInventoryItemAction, createInventoryMovementAction, deleteInventoryItemAction, updateInventoryItemAction } from './actions';
import { SubmitButton } from '@/components/forms/submit-button';
import { money, dateTime } from '@/lib/format';

export default async function InventarioPage() {
  const data = await getInventoryPageData();
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Inventario operativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createInventoryItemAction} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-4">
              <input name="name" placeholder="Insumo" className="rounded-xl border border-slate-200 px-3 py-2" required />
              <input name="current_stock" type="number" placeholder="Stock" className="rounded-xl border border-slate-200 px-3 py-2" required />
              <input name="minimum_stock" type="number" placeholder="Mínimo" className="rounded-xl border border-slate-200 px-3 py-2" required />
              <div className="flex gap-2">
                <input name="unit" placeholder="Unidad" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
                <SubmitButton>Agregar</SubmitButton>
              </div>
            </form>
            <div className="space-y-3">
              {data.items.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <form action={updateInventoryItemAction} className="grid gap-3 md:grid-cols-5">
                    <input type="hidden" name="id" value={item.id} />
                    <input name="name" defaultValue={item.name} className="rounded-xl border border-slate-200 px-3 py-2" />
                    <input name="current_stock" type="number" defaultValue={item.current_stock} className="rounded-xl border border-slate-200 px-3 py-2" />
                    <input name="minimum_stock" type="number" defaultValue={item.minimum_stock} className="rounded-xl border border-slate-200 px-3 py-2" />
                    <input name="unit" defaultValue={item.unit ?? ''} className="rounded-xl border border-slate-200 px-3 py-2" />
                    <SubmitButton>Guardar</SubmitButton>
                  </form>
                  <form action={deleteInventoryItemAction} className="mt-3">
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded-xl border border-rose-200 px-3 py-2 text-rose-700">Eliminar</button>
                  </form>
                  <p className="mt-2 text-sm text-slate-500">Estado: {item.current_stock <= item.minimum_stock ? 'Stock crítico' : 'Stock estable'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimiento de stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createInventoryMovementAction} className="space-y-3 rounded-2xl border border-slate-200 p-4">
              <select name="item_id" className="w-full rounded-xl border border-slate-200 px-3 py-2" required>
                <option value="">Selecciona un insumo</option>
                {data.items.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <select name="movement_type" className="w-full rounded-xl border border-slate-200 px-3 py-2" required>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
              <input name="quantity" type="number" min="1" placeholder="Cantidad" className="w-full rounded-xl border border-slate-200 px-3 py-2" required />
              <textarea name="reason" placeholder="Motivo" className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" />
              <SubmitButton>Registrar movimiento</SubmitButton>
            </form>

            <div className="space-y-3">
              {data.movements.map((movement: any) => (
                <div key={movement.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-900">{movement.inventory_items?.name ?? 'Insumo'}</p>
                  <p className="text-slate-600">{movement.movement_type}: {movement.quantity}</p>
                  <p className="text-slate-500">{dateTime(movement.created_at)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
