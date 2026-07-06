'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/supabase/server';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function servicePayload(formData: FormData) {
  return {
    name: value(formData, 'name'),
    description: value(formData, 'description') || null,
    duration_minutes: Number(value(formData, 'duration_minutes') || 0),
    price: Number(value(formData, 'price') || 0),
    is_active: value(formData, 'is_active') !== 'false'
  };
}

export async function createServiceAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const payload = servicePayload(formData);
  if (!payload.name) throw new Error('El nombre del servicio es obligatorio');
  const { error } = await supabase.from('services').insert(payload);
  if (error) throw error;
  revalidatePath('/dashboard/servicios');
  revalidatePath('/dashboard/citas');
}

export async function updateServiceAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('services').update(servicePayload(formData)).eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/servicios');
  revalidatePath('/dashboard/citas');
}

export async function deleteServiceAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/servicios');
  revalidatePath('/dashboard/citas');
}
