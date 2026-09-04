import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks';
import Button from '../ui/Button';

export default function UserMenu() {
  const { user, logout } = useAuth();
  return (
    <div className="border-t border-neutral-700 p-4">
      <div className="mb-3 flex items-center gap-3">
        <UserCircle size={30} className="text-neutral-400" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{user?.name || 'Account'}</p>
          <p className="truncate text-xs text-neutral-400">{user?.email || user?.role}</p>
        </div>
      </div>
      <Button variant="ghost" onClick={logout} className="w-full justify-start text-neutral-300 hover:bg-neutral-800 hover:text-white">
        <LogOut size={16} /> Log out
      </Button>
    </div>
  );
}
