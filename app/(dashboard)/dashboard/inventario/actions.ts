'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/supabase/server';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export async function createInventoryItemAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const payload = {
    name: value(formData, 'name'),
    current_stock: Number(value(formData, 'current_stock') || 0),
    minimum_stock: Number(value(formData, 'minimum_stock') || 0),
    unit: value(formData, 'unit') || null
  };
  if (!payload.name) throw new Error('El nombre del insumo es obligatorio');
  const { error } = await supabase.from('inventory_items').insert(payload);
  if (error) throw error;
  revalidatePath('/dashboard/inventario');
  revalidatePath('/dashboard');
}

export async function updateInventoryItemAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const payload = {
    name: value(formData, 'name'),
    current_stock: Number(value(formData, 'current_stock') || 0),
    minimum_stock: Number(value(formData, 'minimum_stock') || 0),
    unit: value(formData, 'unit') || null
  };
  const { error } = await supabase.from('inventory_items').update(payload).eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/inventario');
  revalidatePath('/dashboard');
}

export async function deleteInventoryItemAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('inventory_items').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/inventario');
  revalidatePath('/dashboard');
}

export async function createInventoryMovementAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const itemId = value(formData, 'item_id');
  const quantity = Number(value(formData, 'quantity') || 0);
  const movementType = value(formData, 'movement_type');
  const reason = value(formData, 'reason');

  const { data: item, error: itemError } = await supabase.from('inventory_items').select('*').eq('id', itemId).single();
  if (itemError) throw itemError;
  const nextStock = movementType === 'salida' ? item.current_stock - quantity : item.current_stock + quantity;

  const { error } = await supabase.from('inventory_movements').insert({
    item_id: itemId,
    quantity,
    movement_type: movementType,
    reason: reason || null
  });
  if (error) throw error;

  const { error: updateError } = await supabase.from('inventory_items').update({ current_stock: nextStock }).eq('id', itemId);
  if (updateError) throw updateError;
  revalidatePath('/dashboard/inventario');
  revalidatePath('/dashboard');
}
