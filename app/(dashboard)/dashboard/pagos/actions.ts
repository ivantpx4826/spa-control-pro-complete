'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { getSupabaseServerClient } from '@/supabase/server';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

async function uploadVoucher(formData: FormData, paymentId: string) {
  const file = formData.get('voucher');
  if (!(file instanceof File) || file.size === 0) return null;

  const supabase = getSupabaseServerClient();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${paymentId}/${randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from('payment-vouchers')
    .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from('payment-vouchers').getPublicUrl(path);
  return {
    voucher_path: path,
    voucher_url: data.publicUrl
  };
}

export async function createPaymentAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const clientId = value(formData, 'client_id');
  const appointmentId = value(formData, 'appointment_id');
  const amount = Number(value(formData, 'amount'));
  const method = value(formData, 'method');
  const status = value(formData, 'status') || 'registered';
  const paidAt = value(formData, 'paid_at');

  const { data, error } = await supabase.from('payments').insert({
    client_id: clientId,
    appointment_id: appointmentId || null,
    amount,
    method,
    status,
    paid_at: paidAt || new Date().toISOString()
  }).select('id').single();

  if (error) throw error;
  const voucher = await uploadVoucher(formData, data.id);
  if (voucher) {
    const { error: voucherError } = await supabase.from('payments').update(voucher).eq('id', data.id);
    if (voucherError) throw voucherError;
  }
  revalidatePath('/dashboard/pagos');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/reportes');
}

export async function updatePaymentAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const voucher = await uploadVoucher(formData, id);
  const { error } = await supabase.from('payments').update({
    method: value(formData, 'method'),
    status: value(formData, 'status'),
    ...(voucher ?? {})
  }).eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/pagos');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/reportes');
}

export async function deletePaymentAction(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const id = value(formData, 'id');
  const { error } = await supabase.from('payments').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/dashboard/pagos');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/reportes');
}
