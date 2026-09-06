import type { ReactNode } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';
import { CornerNetwork } from '../common';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f6ff]">
      <Sidebar />

      <div className="ml-72 flex min-h-screen flex-col">
        <Header />

        <main className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#fbe8f1_0,_transparent_26rem)] p-8">
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            {children}
          </div>
          <CornerNetwork className="pointer-events-none absolute right-0 top-0 z-20 h-64 w-96 opacity-[0.14]" />
          <CornerNetwork className="pointer-events-none absolute bottom-0 right-0 z-20 h-56 w-80 rotate-180 opacity-[0.12]" />
        </main>
      </div>
    </div>
  );
}
