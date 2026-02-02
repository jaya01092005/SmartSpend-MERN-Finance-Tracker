import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { 
  RiDashboardLine, 
  RiExchangeDollarLine, 
  RiPieChartLine, 
  RiLogoutBoxLine,
  RiSettings4Line,
  RiBankCardLine,
  RiBarChartGroupedLine,
  RiWallet3Line
} from 'react-icons/ri';
import { clsx } from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: RiDashboardLine },
    { name: 'Budgets', path: '/budgets', icon: RiPieChartLine },
    { name: 'Transactions', path: '/transactions', icon: RiExchangeDollarLine },
    { name: 'Cards', path: '/cards', icon: RiBankCardLine }, // Placeholder
    { name: 'Visualization', path: '/visual', icon: RiBarChartGroupedLine }, // Placeholder
  ];

  return (
    <div className="w-64 bg-card h-screen flex flex-col fixed left-0 top-0 border-r border-gray-100 dark:border-white/5 z-50 font-sans transition-colors duration-300">
      <div className="p-8 flex items-center gap-2">
        <RiWallet3Line className="text-3xl text-primary" />
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          SmartSpend
        </h1>
      </div>

      <nav className="flex-1 px-6 space-y-4 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary/10 text-primary font-bold shadow-none dark:bg-primary/20" 
                  : "text-text-muted hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <item.icon className={clsx("text-xl transition-transform", isActive ? "text-primary" : "text-text-muted group-hover:text-primary")} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-50 dark:border-white/5">
        <div className="space-y-2">
             <Link to="/profile" className="flex items-center gap-4 px-4 py-3 w-full text-left text-text-muted hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                 <RiSettings4Line className="text-xl" />
                 <span className="text-sm font-medium">Settings</span>
             </Link>

            <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-4 px-4 py-3 w-full text-left text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            >
            <RiLogoutBoxLine className="text-xl" />
            <span className="text-sm font-medium">Logout</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
