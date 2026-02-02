import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets, addBudget, deleteBudget } from '../redux/budgetSlice';
import { getTransactions } from '../redux/transactionSlice';
import Card from '../components/ui/Card';
import { RiAddLine, RiDeleteBinLine, RiWallet3Line, RiErrorWarningLine } from 'react-icons/ri';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import axios from 'axios';

const BudgetPage = () => {
  const dispatch = useDispatch();
  const { budgets, loading: budgetsLoading } = useSelector((state) => state.budgets);
  const { transactions } = useSelector((state) => state.transactions);
  const { token } = useSelector((state) => state.auth);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ category: '', limit: '' });
  const [aiInsight, setAiInsight] = useState(null);

  useEffect(() => {
    dispatch(getBudgets());
    dispatch(getTransactions());
    
    // Fetch real AI insight
    const fetchInsight = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/ai/insights', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.insights && res.data.insights.length > 0) {
                setAiInsight(res.data.insights[0]);
            }
        } catch (err) {
            console.error("Failed to fetch AI insight", err);
        }
    };
    if (token) fetchInsight();

  }, [dispatch, token]);

  const calculateSpent = (category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category.toLowerCase() === category.toLowerCase())
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const calculateTotalBudget = () => budgets.reduce((acc, b) => acc + b.limit, 0);
  const calculateTotalSpent = () => budgets.reduce((acc, b) => acc + calculateSpent(b.category), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.category && formData.limit) {
      dispatch(addBudget({ ...formData, limit: Number(formData.limit) }));
      setFormData({ category: '', limit: '' });
      setShowModal(false);
    }
  };

  // Safe color palette for charts
  const COLORS = ['#6C5DD3', '#4D7CFE', '#00D09C', '#FFAB73', '#FF85C0', '#4DE1FE'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent">
            Budget Management
          </h2>
          <p className="text-text-muted mt-1">
            Track your spending limits and reach your financial goals.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="glass-button px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 hover:translate-y-[-2px] transition-all"
        >
          <RiAddLine size={20} />
          <span>New Budget</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-text-muted font-medium">Total Budget</p>
                    <h3 className="text-3xl font-bold text-text-primary mt-2">${calculateTotalBudget().toFixed(2)}</h3>
                </div>
                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                    <RiWallet3Line size={24} />
                </div>
            </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 border-accent-blue/20">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-text-muted font-medium">Total Spent</p>
                    <h3 className="text-3xl font-bold text-text-primary mt-2">${calculateTotalSpent().toFixed(2)}</h3>
                </div>
                <div className="p-3 bg-accent-blue/20 rounded-xl text-accent-blue">
                    <RiErrorWarningLine size={24} />
                </div>
            </div>
        </Card>

        {/* AI Insight Placeholder */}
        <Card className="bg-gradient-to-br from-accent-purple/10 to-accent-pink/5 border-accent-purple/20">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-text-muted font-medium">AI Insight</p>
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                        {aiInsight ? aiInsight.description : "Analyzing your spending patterns to provide smart insights..."}
                    </p>
                </div>
                <div className="p-3 bg-accent-purple/20 rounded-xl text-accent-purple">
                    <span className="text-xl">✨</span>
                </div>
            </div>
        </Card>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => {
          const spent = calculateSpent(budget.category);
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          const isOverBudget = spent > budget.limit;
          
          return (
            <Card key={budget._id} className="relative group overflow-hidden">
               {/* Decorative background blob */}
               <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 bg-[${COLORS[index % COLORS.length]}] blur-2xl group-hover:opacity-20 transition-opacity`}></div>

              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-text-primary">{budget.category}</h3>
                    <p className="text-sm text-text-muted">Monthly Limit</p>
                  </div>
                  <button 
                    onClick={() => dispatch(deleteBudget(budget._id))}
                    className="text-text-muted hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className={isOverBudget ? 'text-red-500' : 'text-text-secondary'}>
                      ${spent.toFixed(0)} spent
                    </span>
                    <span className="text-text-muted">
                        of ${budget.limit}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{ width: `${percentage}%`, backgroundColor: isOverBudget ? '#EF4444' : COLORS[index % COLORS.length] }}
                    />
                  </div>
                  
                  <p className="text-xs text-text-muted text-right">
                    {isOverBudget ? 'Over Budget' : `${(100 - percentage).toFixed(0)}% remaining`}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Add Budget Empty State */}
        <button 
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <RiAddLine />
          </div>
          <span className="font-medium">Create New Budget</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-scale-in">
             <h3 className="text-xl font-bold mb-4 text-text-primary">Set New Budget</h3>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                 <input 
                    type="text" 
                    placeholder="e.g., Groceries, Rent, Entertainment" 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Monthly Limit ($)</label>
                 <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: e.target.value})}
                    required
                 />
               </div>
               <div className="flex gap-3 mt-6">
                 <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl text-text-secondary hover:bg-gray-50 font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                 >
                   Save Budget
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
