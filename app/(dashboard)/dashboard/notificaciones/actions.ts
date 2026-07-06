'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/supabase/server';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export async function createNotificationLogAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const payload = {
    event_name: value(formData, 'event_name'),
    channel: value(formData, 'channel') || 'whatsapp',
    recipient: value(formData, 'recipient') || null,
    payload: {
      message: value(formData, 'message'),
      entity: value(formData, 'entity') || 'manual'
    },
    status: 'pending'
  };
  const { error } = await supabase.from('notifications_log').insert(payload);
  if (error) throw error;
  revalidatePath('/dashboard/notificaciones');
}
