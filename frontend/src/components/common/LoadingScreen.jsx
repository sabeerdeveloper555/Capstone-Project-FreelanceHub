import { BriefcaseBusiness } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <main
      className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-stone-50 px-4 text-center text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
      role="status"
      aria-live="polite"
      aria-label="Loading your FreelanceHub workspace"
    >
      <div className="flex w-full max-w-xs flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
          <BriefcaseBusiness size={24} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight">FreelanceHub</h1>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">Loading your workspace...</p>
        <span
          className="mt-5 h-5 w-5 animate-spin rounded-full border-2 border-brand-700 border-t-transparent motion-reduce:animate-none dark:border-green-400"
          aria-hidden="true"
        />
      </div>
    </main>
  );
}
