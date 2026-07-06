'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/supabase/server';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export async function updateUserRoleAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('profiles').update({
    full_name: value(formData, 'full_name'),
    phone: value(formData, 'phone') || null,
    role: value(formData, 'role'),
    status: value(formData, 'status')
  }).eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/usuarios');
}
