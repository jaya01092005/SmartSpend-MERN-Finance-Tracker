import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions, deleteTransaction } from '../redux/transactionSlice';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import TransactionModal from '../components/TransactionModal';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiDownloadLine, RiFilePdfLine } from 'react-icons/ri';
import FloatingAI from '../components/FloatingAI';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TransactionListPage = () => {
    const dispatch = useDispatch();
    const { transactions, loading } = useSelector((state) => state.transactions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this transaction?')) {
            dispatch(deleteTransaction(id));
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleExport = () => {
        if (!transactions.length) return;

        const headers = ['Description', 'Category', 'Date', 'Type', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...transactions.map(t => {
                const date = new Date(t.date).toLocaleDateString();
                const desc = `"${t.description.replace(/"/g, '""')}"`;
                return [desc, t.category, date, t.type, t.amount].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("Transaction History", 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["Description", "Category", "Date", "Type", "Amount"];
        const tableRows = [];

        transactions.forEach(t => {
            const transactionData = [
                t.description,
                t.category,
                new Date(t.date).toLocaleDateString(),
                t.type,
                `$${t.amount}`
            ];
            tableRows.push(transactionData);
        });

        doc.autoTable({
            startY: 40,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [108, 93, 211] }, // Primary Purple
        });

        doc.save("transactions.pdf");
    };

    // Reset editing state when modal closes
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Transactions</h2>
                    <p className="text-text-muted">Manage your income and expenses.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleExport} className="gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                        <RiDownloadLine size={20} />
                        CSV
                    </Button>
                     <Button onClick={handleExportPDF} className="gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                        <RiFilePdfLine size={20} />
                        PDF
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white">
                        <RiAddLine size={20} />
                        Add New
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'income', 'expense'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                            filter === f 
                                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                : 'bg-white/50 text-text-muted hover:bg-white hover:text-primary border border-transparent hover:border-primary/20 dark:bg-white/5 dark:hover:bg-white/10'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <th className="p-4 text-xs font-semibold text-text-muted uppercase">Description</th>
                                <th className="p-4 text-xs font-semibold text-text-muted uppercase">Category</th>
                                <th className="p-4 text-xs font-semibold text-text-muted uppercase">Date</th>
                                <th className="p-4 text-xs font-semibold text-text-muted uppercase">Amount</th>
                                <th className="p-4 text-xs font-semibold text-text-muted uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Loading...</td></tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-text-muted">No transactions found.</td></tr>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <tr key={t._id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm font-medium text-text-primary">{t.description}</td>
                                        <td className="p-4">
                                            <Badge variant="default">{t.category}</Badge>
                                        </td>
                                        <td className="p-4 text-sm text-text-muted">
                                            {new Date(t.date).toLocaleDateString()}
                                        </td>
                                        <td className={`p-4 text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-text-primary'}`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(t)}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <RiEditLine size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(t._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <RiDeleteBinLine size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <TransactionModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                initialData={editingTransaction}
            />
            <FloatingAI />
        </div>
    );
};

export default TransactionListPage;
