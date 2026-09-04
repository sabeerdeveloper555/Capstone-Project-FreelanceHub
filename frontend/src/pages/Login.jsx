import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks';
import { getErrorMessage } from '../utils';
import { Button, Card, Input } from '../components/ui';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const userRole = data?.user?.role;
      if (userRole === 'client') {
        navigate('/client', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setApiError(
        getErrorMessage(err, 'Unable to sign in. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4 dark:bg-neutral-950 sm:p-6">
      <Card className="w-full max-w-md space-y-6 p-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-green-400">FreelanceHub-PK</p>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Sign in to your account</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Enter your details to access FreelanceHub PK</p>
        </div>

        {apiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
              label="Email Address"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
            />

          <div className="relative">
            <Input
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              error={errors.password}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-8 rounded p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full py-3">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="border-t border-neutral-200 pt-2 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline dark:text-green-400">
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
