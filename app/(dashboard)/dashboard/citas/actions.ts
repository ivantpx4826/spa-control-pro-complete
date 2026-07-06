'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/supabase/server';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export async function createAppointmentAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const clientId = value(formData, 'client_id');
  const serviceId = value(formData, 'service_id');
  const specialistId = value(formData, 'specialist_id');
  const startAt = value(formData, 'start_at');
  const endAt = value(formData, 'end_at');
  const notes = value(formData, 'notes');

  const { error } = await supabase.from('appointments').insert({
    client_id: clientId,
    service_id: serviceId,
    specialist_id: specialistId || null,
    start_at: startAt,
    end_at: endAt,
    notes: notes || null,
    status: 'pending'
  });
  if (error) throw error;
  revalidatePath('/dashboard/citas');
  revalidatePath('/dashboard');
}

export async function updateAppointmentAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('appointments').update({
    status: value(formData, 'status'),
    notes: value(formData, 'notes') || null,
    specialist_id: value(formData, 'specialist_id') || null
  }).eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/citas');
  revalidatePath('/dashboard');
}

export async function deleteAppointmentAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/citas');
  revalidatePath('/dashboard');
}
