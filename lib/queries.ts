import { getSupabaseServerClient } from '@/supabase/server';

export async function getDashboardSnapshot() {
  const supabase = getSupabaseServerClient();

  const [clientsRes, appointmentsRes, paymentsRes, inventoryRes, salesRes] = await Promise.all([
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase.from('appointments').select('id,status,start_at,clients(full_name)', { count: 'exact' }).order('start_at', { ascending: false }).limit(8),
    supabase.from('payments').select('amount, status, paid_at').order('paid_at', { ascending: false }).limit(50),
    supabase.from('inventory_items').select('id,current_stock,minimum_stock', { count: 'exact' }),
    supabase.from('v_sales_summary').select('*').order('month', { ascending: false }).limit(6)
  ]);

  const lowStock = (inventoryRes.data ?? []).filter((item: any) => item.current_stock <= item.minimum_stock).length;
  const monthlyIncome = (paymentsRes.data ?? []).reduce((acc: number, item: any) => acc + Number(item.amount || 0), 0);
  const pendingAppointments = (appointmentsRes.data ?? []).filter((item: any) => item.status !== 'completed').length;

  return {
    clientsCount: clientsRes.count ?? 0,
    pendingAppointments,
    monthlyIncome,
    lowStock,
    recentAppointments: appointmentsRes.data ?? [],
    salesSummary: salesRes.data ?? []
  };
}

export async function getClientsList() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getClientDetail(id: string) {
  const supabase = getSupabaseServerClient();
  const [clientRes, recordRes, appointmentsRes, paymentsRes, servicesRes, specialistsRes] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase.from('patient_records').select('*').eq('client_id', id).maybeSingle(),
    supabase.from('appointments').select('*, services(name, price), profiles!appointments_specialist_id_fkey(full_name)').eq('client_id', id).order('start_at', { ascending: false }),
    supabase.from('payments').select('*').eq('client_id', id).order('paid_at', { ascending: false }),
    supabase.from('services').select('id,name').eq('is_active', true),
    supabase.from('profiles').select('id,full_name,role').in('role', ['especialista','admin'])
  ]);
  if (clientRes.error) throw clientRes.error;
  return {
    client: clientRes.data,
    record: recordRes.data,
    appointments: appointmentsRes.data ?? [],
    payments: paymentsRes.data ?? [],
    services: servicesRes.data ?? [],
    specialists: specialistsRes.data ?? []
  };
}

export async function getAppointmentsPageData() {
  const supabase = getSupabaseServerClient();
  const [appointmentsRes, clientsRes, servicesRes, specialistsRes] = await Promise.all([
    supabase.from('appointments').select('*, clients(full_name), services(name, price), profiles!appointments_specialist_id_fkey(full_name)').order('start_at', { ascending: true }),
    supabase.from('clients').select('id, full_name').order('full_name'),
    supabase.from('services').select('id, name, price, duration_minutes').eq('is_active', true).order('name'),
    supabase.from('profiles').select('id, full_name, role').in('role', ['especialista','admin']).order('full_name')
  ]);
  if (appointmentsRes.error) throw appointmentsRes.error;
  return {
    appointments: appointmentsRes.data ?? [],
    clients: clientsRes.data ?? [],
    services: servicesRes.data ?? [],
    specialists: specialistsRes.data ?? []
  };
}

export async function getPaymentsPageData() {
  const supabase = getSupabaseServerClient();
  const [paymentsRes, clientsRes, appointmentsRes] = await Promise.all([
    supabase.from('payments').select('*, clients(full_name), appointments(start_at)').order('paid_at', { ascending: false }),
    supabase.from('clients').select('id, full_name').order('full_name'),
    supabase.from('appointments').select('id, start_at, client_id').order('start_at', { ascending: false }).limit(100)
  ]);
  if (paymentsRes.error) throw paymentsRes.error;
  return {
    payments: paymentsRes.data ?? [],
    clients: clientsRes.data ?? [],
    appointments: appointmentsRes.data ?? []
  };
}

export async function getServicesPageData() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('services').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getProductSalesPageData() {
  const supabase = getSupabaseServerClient();
  const [salesRes, clientsRes, itemsRes] = await Promise.all([
    supabase
      .from('product_sales')
      .select('*, clients(full_name), inventory_items(name, unit)')
      .order('sold_at', { ascending: false }),
    supabase.from('clients').select('id, full_name').order('full_name'),
    supabase.from('inventory_items').select('id, name, current_stock, unit').order('name')
  ]);
  if (salesRes.error) throw salesRes.error;
  return {
    sales: salesRes.data ?? [],
    clients: clientsRes.data ?? [],
    items: itemsRes.data ?? []
  };
}

export async function getReportsData() {
  const supabase = getSupabaseServerClient();
  const [salesRes, servicesRes, statusRes, inventoryRes] = await Promise.all([
    supabase.from('v_sales_summary').select('*').order('month', { ascending: false }),
    supabase.from('appointments').select('services(name)').not('service_id', 'is', null),
    supabase.from('appointments').select('status'),
    supabase.from('inventory_items').select('*').order('current_stock', { ascending: true }).limit(10)
  ]);

  return {
    salesSummary: salesRes.data ?? [],
    serviceRows: servicesRes.data ?? [],
    statusRows: statusRes.data ?? [],
    inventoryItems: inventoryRes.data ?? []
  };
}

export async function getPatientsHistory() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('patient_records')
    .select('*, clients(full_name, phone, status)')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getNotificationsLog() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('notifications_log').select('*').order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function getUsers() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getInventoryPageData() {
  const supabase = getSupabaseServerClient();
  const [itemsRes, movementsRes] = await Promise.all([
    supabase.from('inventory_items').select('*').order('updated_at', { ascending: false }),
    supabase.from('inventory_movements').select('*, inventory_items(name)').order('created_at', { ascending: false }).limit(20)
  ]);
  if (itemsRes.error) throw itemsRes.error;
  return {
    items: itemsRes.data ?? [],
    movements: movementsRes.data ?? []
  };
}
