import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks';
import { ThemeToggle } from '../common';
import Button from '../ui/Button';

export default function UserMenu({ showThemeToggle = true }) {
  const { user, logout } = useAuth();
  return (
    <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
      <div className="mb-3 flex items-center gap-3">
        <UserCircle size={30} className="text-neutral-400 dark:text-neutral-400" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{user?.name || 'Account'}</p>
          <p className="truncate text-xs text-neutral-400">{user?.email || user?.role}</p>
        </div>
      </div>
      {showThemeToggle && <ThemeToggle variant="sidebar" />}
      <Button variant="ghost" onClick={logout} className="w-full justify-start text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white">
        <LogOut size={16} /> Log out
      </Button>
    </div>
  );
}
