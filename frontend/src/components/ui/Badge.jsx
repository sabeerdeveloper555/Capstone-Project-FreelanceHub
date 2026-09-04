const styles = {
  Planning: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  'In Progress': 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Review: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  Completed: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  'On Hold': 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  default: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

export default function Badge({ children, status }) {
  const label = status || children || 'Unknown';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[label] || styles.default}`}>{label}</span>;
}
