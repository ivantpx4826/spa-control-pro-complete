insert into public.services (name, description, duration_minutes, price)
values
  ('Limpieza facial', 'Limpieza profunda con extracción y mascarilla calmante', 60, 120.00),
  ('Masaje relajante', 'Sesión corporal para relajación muscular', 50, 110.00),
  ('Peeling químico', 'Tratamiento facial de renovación', 45, 180.00),
  ('Drenaje linfático', 'Masaje suave para circulación y retención de líquidos', 50, 140.00)
on conflict do nothing;

insert into public.inventory_items (name, current_stock, minimum_stock, unit)
values
  ('Serum hidratante', 8, 10, 'frascos'),
  ('Mascarilla calmante', 3, 6, 'unidades'),
  ('Toallas desechables', 40, 50, 'paquetes')
on conflict do nothing;
