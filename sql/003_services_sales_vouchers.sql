alter table public.payments
add column if not exists voucher_url text,
add column if not exists voucher_path text;

create table if not exists public.product_sales (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  item_id uuid not null references public.inventory_items(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  total_amount numeric(10,2) generated always as (quantity * unit_price) stored,
  status text not null default 'registered',
  notes text,
  sold_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.product_sales enable row level security;

drop policy if exists "staff manage product sales" on public.product_sales;
create policy "staff manage product sales" on public.product_sales
for all to authenticated
using (public.get_my_role() in ('admin','recepcion','caja','gerencia'))
with check (public.get_my_role() in ('admin','recepcion','caja','gerencia'));

create trigger trg_product_sales_audit after insert or update or delete on public.product_sales
for each row execute function public.audit_changes();

insert into storage.buckets (id, name, public)
values ('payment-vouchers', 'payment-vouchers', true)
on conflict (id) do update set public = true;

drop policy if exists "authenticated read payment vouchers" on storage.objects;
create policy "authenticated read payment vouchers" on storage.objects
for select to authenticated
using (bucket_id = 'payment-vouchers');

drop policy if exists "authenticated upload payment vouchers" on storage.objects;
create policy "authenticated upload payment vouchers" on storage.objects
for insert to authenticated
with check (bucket_id = 'payment-vouchers');

drop policy if exists "authenticated update payment vouchers" on storage.objects;
create policy "authenticated update payment vouchers" on storage.objects
for update to authenticated
using (bucket_id = 'payment-vouchers')
with check (bucket_id = 'payment-vouchers');
