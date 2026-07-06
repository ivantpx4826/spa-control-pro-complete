'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/supabase/server';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export async function createProductSaleAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const itemId = value(formData, 'item_id');
  const quantity = Number(value(formData, 'quantity') || 0);
  const unitPrice = Number(value(formData, 'unit_price') || 0);

  const { data: item, error: itemError } = await supabase
    .from('inventory_items')
    .select('id,current_stock')
    .eq('id', itemId)
    .single();
  if (itemError) throw itemError;
  if (quantity <= 0) throw new Error('La cantidad debe ser mayor a cero');
  if (item.current_stock < quantity) throw new Error('Stock insuficiente para registrar la compra');

  const { error } = await supabase.from('product_sales').insert({
    client_id: value(formData, 'client_id'),
    item_id: itemId,
    quantity,
    unit_price: unitPrice,
    status: value(formData, 'status') || 'registered',
    notes: value(formData, 'notes') || null,
    sold_at: value(formData, 'sold_at') || new Date().toISOString()
  });
  if (error) throw error;

  const { error: stockError } = await supabase
    .from('inventory_items')
    .update({ current_stock: item.current_stock - quantity })
    .eq('id', itemId);
  if (stockError) throw stockError;

  await supabase.from('inventory_movements').insert({
    item_id: itemId,
    movement_type: 'salida',
    quantity,
    reason: 'Venta a cliente'
  });

  revalidatePath('/dashboard/compras');
  revalidatePath('/dashboard/inventario');
  revalidatePath('/dashboard');
}

export async function updateProductSaleAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('product_sales').update({
    unit_price: Number(value(formData, 'unit_price') || 0),
    status: value(formData, 'status'),
    notes: value(formData, 'notes') || null
  }).eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/compras');
}

export async function deleteProductSaleAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('product_sales').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/compras');
}
