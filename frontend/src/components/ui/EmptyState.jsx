export default function EmptyState({ icon: Icon, title, description, action, compact = false }) {
  return (
    <div className={`rounded-xl border border-dashed border-neutral-300 bg-white text-center dark:border-neutral-700 dark:bg-neutral-900 ${compact ? 'px-5 py-6' : 'px-6 py-12'}`}>
      {Icon && <Icon size={compact ? 24 : 32} className={`mx-auto text-neutral-400 ${compact ? 'mb-2' : 'mb-3'}`} />}
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">{description}</p>}
      {action && <div className={compact ? 'mt-3' : 'mt-4'}>{action}</div>}
    </div>
  );
}
