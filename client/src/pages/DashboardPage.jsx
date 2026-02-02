import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../redux/transactionSlice';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { RiAddLine, RiArrowUpLine, RiArrowDownLine, RiWallet3Line, RiExchangeDollarLine, RiPieChartLine } from 'react-icons/ri';
import FloatingAI from '../components/FloatingAI';
import TransactionModal from '../components/TransactionModal';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transactions } = useSelector((state) => state.transactions);
  const { user } = useSelector((state) => state.auth);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('expense'); // 'income' or 'expense'

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  const openModal = (type) => {
      setModalType(type);
      setShowModal(true);
  };

  // Calculate Totals
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  // Chart Data
  const chartData = [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10)
    .map(t => ({
      name: new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      amount: t.amount,
      type: t.type
    }));

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-text-primary">Welcome, {user?.name.split(' ')[0]}</h2>
            <p className="text-text-muted mt-1">Continue your journey to financial success.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Total Balance */}
         <div className="bg-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-center transition-colors duration-300">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-primary rounded-xl flex items-center justify-center mb-4">
                <RiWallet3Line size={20} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">${balance.toFixed(2)}</h3>
            <p className="text-text-muted text-sm mt-1">Total Balance</p>
         </div>

         {/* Budgets (Simplification: Count) */}
         <div className="bg-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-center transition-colors duration-300">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                <RiPieChartLine size={20} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">Managed</h3>
            <p className="text-text-muted text-sm mt-1">Budgets</p>
         </div>

         {/* Income */}
         <div className="bg-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-center transition-colors duration-300">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-xl flex items-center justify-center mb-4">
                <RiArrowUpLine size={20} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">${income.toFixed(2)}</h3>
            <p className="text-text-muted text-sm mt-1">Income</p>
         </div>

         {/* Expenses */}
         <div className="bg-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-center transition-colors duration-300">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl flex items-center justify-center mb-4">
                <RiArrowDownLine size={20} />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">${expense.toFixed(2)}</h3>
            <p className="text-text-muted text-sm mt-1">Expenses</p>
         </div>
      </div>

      {/* Main Content: History & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Transaction History (Left Side in Layout) */}
         <div className="bg-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-[400px] transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-text-primary text-lg">Transaction History</h3>
                <button onClick={() => navigate('/transactions')} className="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {transactions.slice(0, 6).map((t) => (
                    <div key={t._id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                t.type === 'income' 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' 
                                : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                             }`}>
                                {t.type === 'income' ? <RiArrowUpLine /> : <RiWallet3Line />}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-text-primary">{t.description}</p>
                                <p className="text-xs text-text-muted">{t.category}</p>
                             </div>
                        </div>
                        <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-500' : 'text-text-primary'}`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount}
                        </span>
                    </div>
                ))}
                 {transactions.length === 0 && (
                     <p className="text-center text-text-muted text-sm mt-10">No recent transactions</p>
                 )}
            </div>
         </div>

         {/* Data Overview Chart (Right Side) */}
         <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-[400px] transition-colors duration-300">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-text-primary text-lg">Data Overview</h3>
                <span className="text-xs text-text-muted bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">Weekly</span>
            </div>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorAmountPurple" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E2EA" strokeOpacity={0.2} />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#A0AEC0', fontSize: 12 }} 
                            dy={10}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '12px', 
                                border: 'none', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                padding: '12px',
                                backgroundColor: 'var(--color-card)',
                                color: 'var(--color-text-primary)'
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#6C5DD3" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorAmountPurple)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>

      <FloatingAI />
      
      {showModal && (
        <TransactionModal 
            onClose={() => setShowModal(false)}
            initialType={modalType} 
        />
      )}
    </div>
  );
};

export default DashboardPage;
