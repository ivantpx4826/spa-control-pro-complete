'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Bell, Boxes, CalendarDays, ChartColumnBig, CreditCard, LayoutDashboard, Scissors, ShoppingBag, Stethoscope, Users, UserRoundCog } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/pacientes', label: 'Historial', icon: Stethoscope },
  { href: '/dashboard/servicios', label: 'Servicios', icon: Scissors },
  { href: '/dashboard/citas', label: 'Citas', icon: CalendarDays },
  { href: '/dashboard/compras', label: 'Compras', icon: ShoppingBag },
  { href: '/dashboard/pagos', label: 'Pagos', icon: CreditCard },
  { href: '/dashboard/inventario', label: 'Inventario', icon: Boxes },
  { href: '/dashboard/reportes', label: 'Reportes', icon: ChartColumnBig },
  { href: '/dashboard/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/dashboard/usuarios', label: 'Usuarios', icon: UserRoundCog }
] satisfies Array<{ href: Route; label: string; icon: typeof LayoutDashboard }>;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-full border-r border-slate-200 bg-white p-5 lg:max-w-72">
      <div className="mb-8 rounded-3xl bg-brand px-5 py-4 text-white shadow-card">
        <p className="text-sm text-fuchsia-100">Spa Control Pro</p>
        <h2 className="text-xl font-bold">Operación central</h2>
      </div>
      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium',
                active ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
