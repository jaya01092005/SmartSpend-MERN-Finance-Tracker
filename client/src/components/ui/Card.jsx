import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-card rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-white/5 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
