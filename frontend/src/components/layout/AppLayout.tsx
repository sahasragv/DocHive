import type { ReactNode } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-72 flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}