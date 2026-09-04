import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks';
import { Button, Card } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const homePath = user?.role === 'client' ? '/client' : '/dashboard';
  const homeLabel = user?.role === 'client' ? 'Go to client portal' : 'Go to dashboard';

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 p-6 dark:bg-neutral-950">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"><ShieldAlert size={24} /></div>
        <p className="text-sm font-bold uppercase tracking-widest text-red-700 dark:text-red-400">403</p>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">Access denied</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">You do not have permission to access this page.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2"><Link to={homePath}><Button>{homeLabel}</Button></Link><Button variant="secondary" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Go back</Button></div>
      </Card>
    </div>
  );
};

export default Unauthorized;
