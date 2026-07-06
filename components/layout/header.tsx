'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/supabase/client';

export function Header() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-slate-500">Panel operativo del spa</p>
        <h1 className="text-2xl font-bold text-slate-900">Gestión integral, automatización y analítica</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600">Rol demo: Administrador</div>
        <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">Supabase conectado</div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
