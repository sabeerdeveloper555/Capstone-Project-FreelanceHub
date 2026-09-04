import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4" role="presentation" onMouseDown={onClose}>
      <div className="my-auto max-h-[calc(100vh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:max-h-[90vh] sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
