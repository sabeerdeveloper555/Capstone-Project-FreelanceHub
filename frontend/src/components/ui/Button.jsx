import { forwardRef } from 'react';

const variants = {
  primary: 'bg-brand-700 text-white hover:bg-brand-900 focus-visible:ring-brand-700',
  secondary: 'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 focus-visible:ring-brand-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800',
  danger: 'bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-700',
  ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-brand-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white',
};

const Button = forwardRef(function Button({ variant = 'primary', className = '', children, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
