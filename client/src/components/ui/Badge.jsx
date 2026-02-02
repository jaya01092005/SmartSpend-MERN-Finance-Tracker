import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: "bg-gray-100 text-text-primary",
    success: "bg-accent-green/20 text-green-700",
    warning: "bg-orange-100 text-orange-700",
    purple: "bg-accent-lavender/20 text-purple-700",
    blue: "bg-accent-blue/10 text-blue-600",
  };

  return (
    <span className={twMerge(clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className))}>
      {children}
    </span>
  );
};

export default Badge;
