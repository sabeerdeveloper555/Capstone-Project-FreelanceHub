import { useEffect } from 'react';
import { Menu, X, BriefcaseBusiness } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileHeader({ open, onToggle }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (open && event.key === 'Escape') onToggle();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onToggle]);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900 md:hidden">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-100"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white"><BriefcaseBusiness size={17} /></span>FreelanceHub</div>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls="mobile-navigation-drawer" aria-label={open ? 'Close navigation' : 'Open navigation'} className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 dark:text-neutral-300 dark:hover:bg-neutral-800">{open ? <X size={21} /> : <Menu size={21} />}</button>
      </header>
      <div id="mobile-navigation-drawer" className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ease-out md:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={!open} inert={!open ? '' : undefined} onClick={onToggle}>
        <div className={`flex h-full w-[min(18rem,85vw)] flex-col transform transition-transform duration-200 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`} onClick={(event) => event.stopPropagation()}>
          <Sidebar mobile onNavigate={onToggle} />
        </div>
      </div>
    </>
  );
}
