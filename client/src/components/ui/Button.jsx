import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue/50 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30",
    secondary: "bg-white text-text-primary border border-gray-200 hover:bg-gray-50",
    ghost: "text-text-muted hover:text-primary hover:bg-primary/5",
    accent: "bg-accent-blue text-white hover:bg-accent-blue/90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  };

  const mergedClasses = twMerge(
    clsx(baseStyles, variants[variant], sizes[size], className)
  );

  return (
    <button className={mergedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
