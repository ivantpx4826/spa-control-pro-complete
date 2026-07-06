import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-fuchsia-50 via-white to-slate-100 px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-card lg:grid-cols-2">
        <div className="bg-brand p-10 text-white">
          <p className="text-sm text-fuchsia-100">Acceso seguro</p>
          <h1 className="mt-4 text-4xl font-bold">Ingresa a la operación del spa</h1>
          <ul className="mt-8 space-y-4 text-sm text-fuchsia-50">
            <li>• Login conectado a Supabase Auth.</li>
            <li>• Base lista para perfiles, roles y trazabilidad.</li>
            <li>• Operación preparada para WhatsApp, realtime y gerencia.</li>
          </ul>
        </div>
        <div className="p-10">
          <div className="space-y-5">
            <div>
              <p className="text-sm text-slate-500">Implementación real</p>
              <h2 className="text-3xl font-bold text-slate-900">Iniciar sesión</h2>
            </div>
            <LoginForm />
            <p className="text-sm text-slate-500">
              Si aún no conectas Supabase Auth, podrás usar esta pantalla como referencia visual y completar las credenciales del proyecto.
            </p>
            <Link href="/dashboard" className="inline-flex text-sm font-medium text-brand hover:text-brand-dark">
              Ir al dashboard directo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
