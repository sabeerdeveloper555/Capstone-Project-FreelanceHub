export default function LoadingSkeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 ${className}`} />;
}
