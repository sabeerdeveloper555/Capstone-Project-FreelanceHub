import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  DollarSign,
  FolderOpen,
  RefreshCcw,
  TrendingUp,
  Users,
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  LoadingSkeleton,
  PageHeader,
} from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { getDashboardData } from '../services/dashboardService';
import { getErrorMessage } from '../utils';

const STATUS_ROWS = [
  { key: 'Planning', tone: 'bg-neutral-400' },
  { key: 'In Progress', tone: 'bg-amber-600' },
  { key: 'Review', tone: 'bg-neutral-600' },
  { key: 'Completed', tone: 'bg-brand-700' },
  { key: 'On Hold', tone: 'bg-red-700' },
];

const formatCurrency = (amount) => `Rs ${new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0,
}).format(Number(amount) || 0)}`;

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StatCard = ({ icon: Icon, label, value, tone = 'neutral', subtext }) => {
  const tones = {
    neutral: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
    green: 'bg-green-50 text-brand-700 dark:bg-green-950/40 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  };

  return (
    <Card className="flex items-start gap-3.5 p-4 sm:p-5">
      <div className={`rounded-lg p-2.5 ${tones[tone]}`}><Icon size={18} /></div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="mt-1 truncate text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">{value}</p>
        {subtext && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{subtext}</p>}
      </div>
    </Card>
  );
};

const SectionHeading = ({ children, action }) => (
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{children}</h2>
    {action}
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => <LoadingSkeleton key={index} className="h-24" />)}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <LoadingSkeleton className="h-64" /><LoadingSkeleton className="h-64" />
    </div>
    <LoadingSkeleton className="h-56" />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDashboardData(await getDashboardData());
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load dashboard data. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = dashboardData?.statistics ?? {};
  const projectStatus = dashboardData?.projectStatus ?? {};
  const deadlineStats = dashboardData?.deadlineStats ?? {};
  const recentProjects = dashboardData?.recentProjects ?? [];
  const totalProjects = Number(stats.totalProjects) || 0;
  const hasData = dashboardData !== null && (stats.totalProjects > 0 || stats.totalClients > 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader title={`Welcome back, ${user?.name || 'Freelancer'}`} description="Here is an overview of your freelance activity." />

        {isLoading && <DashboardSkeleton />}

        {!isLoading && error && (
          <Card className="flex flex-col items-start gap-4 border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/30 sm:flex-row sm:items-center">
            <AlertTriangle size={21} className="shrink-0 text-red-700 dark:text-red-400" />
            <div className="min-w-0 flex-1"><p className="font-semibold text-red-800 dark:text-red-300">Failed to load dashboard</p><p className="mt-1 break-words text-sm text-red-700 dark:text-red-400">{error}</p></div>
            <Button variant="danger" onClick={fetchDashboard}><RefreshCcw size={15} /> Retry</Button>
          </Card>
        )}

        {!isLoading && !error && dashboardData !== null && (
          <>
            {!hasData && <EmptyState compact icon={FolderOpen} title="No project or client data yet" description="Start by adding a client or creating a project." action={<div className="flex flex-wrap justify-center gap-2"><Link to="/clients"><Button variant="secondary">Add a client</Button></Link><Link to="/projects"><Button>Create a project</Button></Link></div>} />}

            <section>
              <SectionHeading>Overview</SectionHeading>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard icon={Users} label="Total Clients" value={stats.totalClients ?? 0} subtext={stats.recentClientsCount > 0 ? `+${stats.recentClientsCount} in last 30 days` : undefined} />
                <StatCard icon={FolderOpen} label="Total Projects" value={stats.totalProjects ?? 0} />
                <StatCard icon={DollarSign} label="Total Budget" value={formatCurrency(stats.totalBudget)} tone="green" />
                <StatCard icon={CheckCircle2} label="Completed Projects" value={projectStatus.Completed ?? 0} tone="green" subtext={stats.completedBudget > 0 ? `${formatCurrency(stats.completedBudget)} earned` : undefined} />
                <StatCard icon={Clock} label="In Progress" value={projectStatus['In Progress'] ?? 0} tone="amber" subtext={stats.inProgressBudget > 0 ? `${formatCurrency(stats.inProgressBudget)} active` : undefined} />
                <StatCard icon={TrendingUp} label="Average Budget" value={formatCurrency(stats.averageBudget)} subtext="per project" />
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <section>
                <SectionHeading>Project Status</SectionHeading>
                <Card className="p-5">
                  {totalProjects === 0 ? <p className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No projects to categorize yet.</p> : <div className="space-y-4">{STATUS_ROWS.map(({ key, tone }) => { const count = Number(projectStatus[key]) || 0; const width = `${Math.round((count / totalProjects) * 100)}%`; return <div key={key}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="font-medium text-neutral-700 dark:text-neutral-300">{key}</span><span className="tabular-nums text-neutral-500 dark:text-neutral-400">{count}</span></div><div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"><div className={`h-full rounded-full ${tone}`} style={{ width }} /></div></div>; })}</div>}
                </Card>
              </section>

              <section>
                <SectionHeading>Deadline Summary</SectionHeading>
                <Card className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  <div className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><AlertTriangle size={18} className="text-red-700 dark:text-red-400" /><span className="text-sm text-neutral-600 dark:text-neutral-300">Overdue</span></div><span className="text-xl font-bold text-red-700 dark:text-red-400">{deadlineStats.overdue ?? 0}</span></div>
                  <div className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><CalendarClock size={18} className="text-amber-700 dark:text-amber-400" /><span className="text-sm text-neutral-600 dark:text-neutral-300">Due Soon</span></div><span className="text-xl font-bold text-amber-700 dark:text-amber-400">{deadlineStats.dueSoon ?? 0}</span></div>
                  <div className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-brand-700 dark:text-green-400" /><span className="text-sm text-neutral-600 dark:text-neutral-300">Completed</span></div><span className="text-xl font-bold text-brand-700 dark:text-green-400">{deadlineStats.completed ?? 0}</span></div>
                </Card>
              </section>
            </div>

            <section>
              <SectionHeading action={<Link to="/projects" className="text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-green-400 dark:hover:text-green-300">View all</Link>}>Recent Projects</SectionHeading>
              {recentProjects.length === 0 ? <EmptyState compact icon={FolderOpen} title="No projects yet" description="Your recent projects will appear here." /> : <Card className="overflow-hidden"><div className="overflow-x-auto"><div className="min-w-[680px]"><div className="grid grid-cols-[minmax(190px,1fr)_minmax(140px,0.8fr)_auto_auto_auto] gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">{['Project', 'Client', 'Status', 'Budget', 'Deadline'].map((heading) => <span key={heading} className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{heading}</span>)}</div><ul className="divide-y divide-neutral-200 dark:divide-neutral-800">{recentProjects.map((project) => { const clientName = project.client?.name ?? (typeof project.client === 'string' ? 'Client' : 'No Client'); return <li key={project._id} className="grid grid-cols-[minmax(190px,1fr)_minmax(140px,0.8fr)_auto_auto_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40"><p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100" title={project.title || 'Untitled Project'}>{project.title || 'Untitled Project'}</p><p className="truncate text-sm text-neutral-500 dark:text-neutral-400">{clientName}</p><Badge status={project.status} /><p className="whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">{formatCurrency(project.budget)}</p><p className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">{formatDate(project.deadline)}</p></li>; })}</ul></div></div></Card>}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
