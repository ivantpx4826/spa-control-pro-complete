'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/supabase/client';

export function RealtimeStatus() {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel('spa-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
        if (!active) return;
        setEvents((prev) => [`Citas: ${payload.eventType} ${new Date().toLocaleTimeString('es-PE')}`, ...prev].slice(0, 4));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, (payload) => {
        if (!active) return;
        setEvents((prev) => [`Pagos: ${payload.eventType} ${new Date().toLocaleTimeString('es-PE')}`, ...prev].slice(0, 4));
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
      <p className="font-semibold text-emerald-800">Realtime preparado</p>
      <p className="mt-1 text-emerald-700">Cuando habilites Realtime en Supabase, aquí verás eventos de agenda y caja.</p>
      <div className="mt-3 space-y-2">
        {events.length === 0 ? <p className="text-emerald-700">Esperando eventos...</p> : events.map((event) => <p key={event} className="text-emerald-800">• {event}</p>)}
      </div>
    </div>
  );
}
