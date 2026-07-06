create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'recepcion', 'especialista', 'caja', 'gerencia', 'paciente');
create type public.app_status as enum ('activo', 'inactivo');
create type public.app_event_status as enum ('pending', 'sent', 'failed');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role public.app_role not null default 'recepcion',
  status public.app_status not null default 'activo',
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  full_name text not null,
  document_number text,
  phone text,
  email text,
  birth_date date,
  notes text,
  status text not null default 'activo',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.patient_records (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  allergies text,
  restrictions text,
  skin_type text,
  observations text,
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes int not null,
  price numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  service_id uuid not null references public.services(id),
  specialist_id uuid references public.profiles(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'pending',
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  amount numeric(10,2) not null,
  method text not null,
  status text not null default 'registered',
  paid_at timestamptz not null default now(),
  registered_by uuid references public.profiles(id)
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  current_stock int not null default 0,
  minimum_stock int not null default 0,
  unit text,
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inventory_items(id) on delete cascade,
  movement_type text not null,
  quantity int not null,
  reason text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.notifications_log (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  channel text not null,
  recipient text,
  payload jsonb,
  status public.app_event_status not null default 'pending',
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text not null,
  action text not null,
  actor_id uuid,
  changes jsonb,
  created_at timestamptz not null default now()
);

create or replace view public.v_sales_summary as
select
  date_trunc('month', paid_at) as month,
  count(*) as total_transactions,
  sum(amount) as total_amount
from public.payments
group by 1
order by 1;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.get_my_role()
returns public.app_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.audit_changes()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.audit_log(table_name, record_id, action, actor_id, changes)
  values (
    tg_table_name,
    coalesce(new.id, old.id)::text,
    tg_op,
    auth.uid(),
    jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
  );
  return coalesce(new, old);
end;
$$;

create or replace function public.enqueue_whatsapp_event()
returns trigger
language plpgsql
security definer
as $$
begin
  if tg_table_name = 'appointments' and tg_op = 'INSERT' then
    insert into public.notifications_log(event_name, channel, recipient, payload)
    select 'appointment_created', 'whatsapp', c.phone,
      jsonb_build_object('appointment_id', new.id, 'client_id', c.id, 'start_at', new.start_at)
    from public.clients c where c.id = new.client_id and c.phone is not null;
  elsif tg_table_name = 'payments' and tg_op = 'INSERT' then
    insert into public.notifications_log(event_name, channel, recipient, payload)
    select 'payment_registered', 'whatsapp', c.phone,
      jsonb_build_object('payment_id', new.id, 'client_id', c.id, 'amount', new.amount)
    from public.clients c where c.id = new.client_id and c.phone is not null;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger trg_patient_records_updated_at
before update on public.patient_records
for each row execute function public.handle_updated_at();

create trigger trg_inventory_items_updated_at
before update on public.inventory_items
for each row execute function public.handle_updated_at();

create trigger trg_clients_audit after insert or update or delete on public.clients
for each row execute function public.audit_changes();
create trigger trg_appointments_audit after insert or update or delete on public.appointments
for each row execute function public.audit_changes();
create trigger trg_payments_audit after insert or update or delete on public.payments
for each row execute function public.audit_changes();
create trigger trg_inventory_items_audit after insert or update or delete on public.inventory_items
for each row execute function public.audit_changes();

create trigger trg_enqueue_appointment_whatsapp after insert on public.appointments
for each row execute function public.enqueue_whatsapp_event();
create trigger trg_enqueue_payment_whatsapp after insert on public.payments
for each row execute function public.enqueue_whatsapp_event();

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.patient_records enable row level security;
alter table public.appointments enable row level security;
alter table public.payments enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.notifications_log enable row level security;
alter table public.audit_log enable row level security;
alter table public.services enable row level security;

create policy "profiles self read" on public.profiles
for select using (auth.uid() = id or public.get_my_role() in ('admin', 'gerencia'));

create policy "profiles admin manage" on public.profiles
for all to authenticated using (public.get_my_role() = 'admin') with check (public.get_my_role() = 'admin');

create policy "authenticated can read clients" on public.clients
for select to authenticated using (public.get_my_role() in ('admin','recepcion','especialista','caja','gerencia'));
create policy "reception admin can insert clients" on public.clients
for insert to authenticated with check (public.get_my_role() in ('admin','recepcion'));
create policy "reception admin can update clients" on public.clients
for update to authenticated using (public.get_my_role() in ('admin','recepcion','especialista'));
create policy "admin can delete clients" on public.clients
for delete to authenticated using (public.get_my_role() = 'admin');

create policy "staff can read patient records" on public.patient_records
for select to authenticated using (public.get_my_role() in ('admin','recepcion','especialista','gerencia'));
create policy "specialist and admin manage patient records" on public.patient_records
for all to authenticated using (public.get_my_role() in ('admin','especialista')) with check (public.get_my_role() in ('admin','especialista'));

create policy "staff read services" on public.services
for select to authenticated using (true);
create policy "admin manage services" on public.services
for all to authenticated using (public.get_my_role() = 'admin') with check (public.get_my_role() = 'admin');

create policy "staff manage appointments" on public.appointments
for all to authenticated using (public.get_my_role() in ('admin','recepcion','especialista','gerencia')) with check (public.get_my_role() in ('admin','recepcion','especialista','gerencia'));

create policy "cashier and admin manage payments" on public.payments
for all to authenticated using (public.get_my_role() in ('admin','caja','recepcion','gerencia')) with check (public.get_my_role() in ('admin','caja','recepcion','gerencia'));

create policy "staff read inventory" on public.inventory_items
for select to authenticated using (public.get_my_role() in ('admin','gerencia','recepcion'));
create policy "admin and recepcion manage inventory" on public.inventory_items
for all to authenticated using (public.get_my_role() in ('admin','recepcion')) with check (public.get_my_role() in ('admin','recepcion'));

create policy "staff read movements" on public.inventory_movements
for select to authenticated using (public.get_my_role() in ('admin','gerencia','recepcion'));
create policy "admin and recepcion write movements" on public.inventory_movements
for insert to authenticated with check (public.get_my_role() in ('admin','recepcion'));

create policy "management read notifications" on public.notifications_log
for select to authenticated using (public.get_my_role() in ('admin','gerencia','recepcion'));
create policy "staff queue notifications" on public.notifications_log
for insert to authenticated with check (public.get_my_role() in ('admin','gerencia','recepcion','caja'));

create policy "management read audit" on public.audit_log
for select to authenticated using (public.get_my_role() in ('admin','gerencia'));
