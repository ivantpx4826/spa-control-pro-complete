'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/supabase/server';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export async function createClientAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const fullName = value(formData, 'full_name');
  const phone = value(formData, 'phone');
  const documentNumber = value(formData, 'document_number');
  const email = value(formData, 'email');
  const notes = value(formData, 'notes');
  const code = `CLI-${Date.now().toString().slice(-6)}`;

  if (!fullName) throw new Error('El nombre del cliente es obligatorio');

  const { error } = await supabase.from('clients').insert({
    code,
    full_name: fullName,
    phone: phone || null,
    document_number: documentNumber || null,
    email: email || null,
    notes: notes || null,
    status: 'activo'
  });

  if (error) throw error;
  revalidatePath('/dashboard/clientes');
}

export async function updateClientAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const payload = {
    full_name: value(formData, 'full_name'),
    phone: value(formData, 'phone') || null,
    document_number: value(formData, 'document_number') || null,
    email: value(formData, 'email') || null,
    notes: value(formData, 'notes') || null,
    status: value(formData, 'status') || 'activo'
  };

  const { error } = await supabase.from('clients').update(payload).eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/clientes');
  revalidatePath(`/dashboard/clientes/${id}`);
}

export async function deleteClientAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/clientes');
}

export async function upsertPatientRecordAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const clientId = value(formData, 'client_id');
  const existingId = value(formData, 'record_id');
  const payload = {
    client_id: clientId,
    allergies: value(formData, 'allergies') || null,
    restrictions: value(formData, 'restrictions') || null,
    skin_type: value(formData, 'skin_type') || null,
    observations: value(formData, 'observations') || null
  };

  const query = existingId
    ? supabase.from('patient_records').update(payload).eq('id', existingId)
    : supabase.from('patient_records').insert(payload);

  const { error } = await query;
  if (error) throw error;
  revalidatePath(`/dashboard/clientes/${clientId}`);
  revalidatePath('/dashboard/pacientes');
}
