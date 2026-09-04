import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-stone-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <MobileHeader open={mobileOpen} onToggle={() => setMobileOpen((value) => !value)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
