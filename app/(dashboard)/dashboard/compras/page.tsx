import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SubmitButton } from '@/components/forms/submit-button';
import { dateTime, money } from '@/lib/format';
import { getProductSalesPageData } from '@/lib/queries';
import { createProductSaleAction, deleteProductSaleAction, updateProductSaleAction } from './actions';

export default async function ComprasPage() {
  const { sales, clients, items } = await getProductSalesPageData();

  return (
    <div className="grid gap-6 xl:grid-cols-[420px,1fr]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Nueva compra</CardTitle>
            <p className="text-sm text-slate-500">Productos que adquieren los clientes.</p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={createProductSaleAction} className="space-y-3">
            <select name="client_id" required className="w-full">
              <option value="">Selecciona cliente</option>
              {clients.map((client: any) => <option key={client.id} value={client.id}>{client.full_name}</option>)}
            </select>
            <select name="item_id" required className="w-full">
              <option value="">Selecciona producto</option>
              {items.map((item: any) => (
                <option key={item.id} value={item.id}>{item.name} · stock {item.current_stock} {item.unit ?? ''}</option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <input name="quantity" type="number" min="1" placeholder="Cantidad" required className="w-full" />
              <input name="unit_price" type="number" step="0.01" min="0" placeholder="Precio unitario" required className="w-full" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <select name="status" defaultValue="registered" className="w-full">
                <option value="registered">Registrada</option>
                <option value="paid">Pagada</option>
                <option value="delivered">Entregada</option>
              </select>
              <input name="sold_at" type="datetime-local" className="w-full" />
            </div>
            <textarea name="notes" rows={3} placeholder="Notas" className="w-full" />
            <SubmitButton className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Registrar compra</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Compras registradas</CardTitle>
            <p className="text-sm text-slate-500">Salida de inventario asociada al cliente.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sales.length === 0 ? (
            <EmptyState title="Sin compras" description="Registra productos vendidos para mantener stock y trazabilidad." />
          ) : (
            sales.map((sale: any) => (
              <div key={sale.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{sale.clients?.full_name ?? 'Cliente'}</p>
                    <p className="text-sm text-slate-500">
                      {sale.inventory_items?.name ?? 'Producto'} · {sale.quantity} {sale.inventory_items?.unit ?? ''} · {money(sale.total_amount)}
                    </p>
                    <p className="text-xs text-slate-400">{dateTime(sale.sold_at)}</p>
                  </div>
                  <Badge className="bg-fuchsia-100 text-fuchsia-700">{sale.status}</Badge>
                </div>
                <form action={updateProductSaleAction} className="grid gap-3 md:grid-cols-[160px,1fr,auto]">
                  <input type="hidden" name="id" value={sale.id} />
                  <input name="unit_price" type="number" step="0.01" min="0" defaultValue={sale.unit_price} className="w-full" />
                  <input name="notes" defaultValue={sale.notes ?? ''} placeholder="Notas" className="w-full" />
                  <div className="flex gap-2">
                    <select name="status" defaultValue={sale.status} className="w-full">
                      <option value="registered">Registrada</option>
                      <option value="paid">Pagada</option>
                      <option value="delivered">Entregada</option>
                    </select>
                    <SubmitButton className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Actualizar</SubmitButton>
                  </div>
                </form>
                <form action={deleteProductSaleAction} className="mt-3">
                  <input type="hidden" name="id" value={sale.id} />
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
