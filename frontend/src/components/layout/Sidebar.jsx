import { NavLink } from 'react-router-dom';
import { BriefcaseBusiness, FolderKanban, LayoutDashboard, Users } from 'lucide-react';
import { useAuth } from '../../hooks';
import UserMenu from './UserMenu';

const freelancerGroups = [
  { label: 'Overview', items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }] },
  { label: 'Work', items: [{ label: 'Clients', to: '/clients', icon: Users }, { label: 'Projects', to: '/projects', icon: FolderKanban }] },
];
const clientGroups = [
  { label: 'Workspace', items: [{ label: 'Client Portal', to: '/client', icon: LayoutDashboard }] },
];

export default function Sidebar({ onNavigate, mobile = false }) {
  const { user } = useAuth();
  const groups = user?.role === 'client' ? clientGroups : freelancerGroups;

  return (
    <aside className={`${mobile ? 'flex h-full min-h-0' : 'sticky top-0 hidden h-screen md:flex'} w-64 shrink-0 flex-col overflow-y-auto bg-neutral-900 text-white`}>
      <div className="flex h-20 items-center gap-3 border-b border-neutral-800 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700"><BriefcaseBusiness size={17} /></span>
        <span className="text-lg font-bold tracking-tight">FreelanceHub</span>
      </div>
      <nav className="flex-1 space-y-7 px-3 py-7">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-neutral-500">{group.label}</p>
            <div className="space-y-1">
              {group.items.map(({ label, to, icon: Icon }) => (
                <NavLink key={label} to={to} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-100'}`}>
                  <Icon size={17} /> {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <UserMenu />
    </aside>
  );
}
