import { useAuth } from '../hooks';
import { AppLayout } from '../components/layout';
import { Card, EmptyState, PageHeader } from '../components/ui';
import { FolderOpen, ShieldCheck } from 'lucide-react';

const ClientHome = () => {
  const { user } = useAuth();

  return (
    <AppLayout><div className="space-y-6"><PageHeader title="Client Portal" description={`Welcome, ${user?.name || 'there'}.`} /><Card className="flex items-start gap-4 p-5"><div className="rounded-lg bg-green-50 p-2.5 text-brand-700 dark:bg-green-950/40 dark:text-green-400"><ShieldCheck size={20} /></div><div><h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Your workspace</h2><p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">You are signed in as {user?.email || 'a client'}.</p></div></Card><EmptyState compact icon={FolderOpen} title="Your projects will appear here" description="There is no client-scoped project information available yet." /></div></AppLayout>
  );
};

export default ClientHome;
