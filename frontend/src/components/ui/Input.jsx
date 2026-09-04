export default function Input({ label, error, id, className = '', ...props }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor={id}>{label}</label>}
      <input id={id} className={`w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder-neutral-500 ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-700 dark:text-red-400">{error}</p>}
    </div>
  );
}
