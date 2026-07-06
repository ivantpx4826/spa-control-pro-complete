import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_1fr]">
      <Sidebar />
      <div className="min-w-0">
        <Header />
        <main className="space-y-6 p-6">{children}</main>
      </div>
    </div>
  );
}
