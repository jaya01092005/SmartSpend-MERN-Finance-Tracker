import { useSelector } from 'react-redux';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import Card from '../components/ui/Card';

const VisualizationPage = () => {
    const { transactions } = useSelector((state) => state.transactions);

    // Prepare Category Data for Pie Chart
    const categoryDataMap = {};
    transactions.forEach(t => {
        if (t.type === 'expense') {
            categoryDataMap[t.category] = (categoryDataMap[t.category] || 0) + t.amount;
        }
    });

    const pieData = Object.keys(categoryDataMap).map(cat => ({
        name: cat,
        value: categoryDataMap[cat]
    }));

    // Prepare Monthly Spending for Bar Chart
    // Simplify: Group by Date (Day) for now as we don't have years of data
    const dailyDataMap = {};
    transactions.forEach(t => {
         const date = new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
         if (!dailyDataMap[date]) dailyDataMap[date] = { name: date, income: 0, expense: 0 };
         if (t.type === 'income') dailyDataMap[date].income += t.amount;
         else dailyDataMap[date].expense += t.amount;
    });

    // Sorting by date is tricky with just strings, but if transactions are sorted properly it works.
    // Ideally we sort by timestamp then format.
    const sortedTransactions = [...transactions].sort((a,b) => new Date(a.date) - new Date(b.date));
    const sortedDates = [...new Set(sortedTransactions.map(t => new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })))];
    
    const barData = sortedDates.map(date => dailyDataMap[date] || { name: date, income: 0, expense: 0 }).slice(-7); // Last 7 active days


    const COLORS = ['#6C5DD3', '#FF754C', '#FFA600', '#F6CC0D', '#32A071', '#2CC5BD', '#0070F3'];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
             <div>
                <h2 className="text-3xl font-bold text-text-primary">Data Visualization</h2>
                <p className="text-text-muted mt-1">Deep dive into your financial analytics.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expense Breakdown */}
                <Card className="h-[400px]">
                    <h3 className="text-lg font-bold text-text-primary mb-6">Expense By Category</h3>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="35%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-text-muted">
                            No expense data available.
                        </div>
                    )}
                </Card>

                {/* Income vs Expense */}
                <Card className="h-[400px]">
                    <h3 className="text-lg font-bold text-text-primary mb-6">Income vs Expense (Daily)</h3>
                     {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8F8FAF', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8F8FAF', fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Legend verticalAlign="top" align="right" iconType="circle" />
                                <Bar dataKey="income" name="Income" fill="#32A071" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expense" name="Expense" fill="#FF754C" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-text-muted">
                            No transaction activity found.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default VisualizationPage;
