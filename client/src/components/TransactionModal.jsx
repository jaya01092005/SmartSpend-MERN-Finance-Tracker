import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, updateTransaction } from '../redux/transactionSlice';
import { getCards } from '../redux/cardSlice';
import { RiCloseLine } from 'react-icons/ri';
import Button from './ui/Button';
import Input from './ui/Input';

const categories = ['Salary', 'Rent', 'Food', 'Transport', 'Entertainment', 'Health', 'Education', 'Investment', 'Shopping', 'Utilities', 'Other'];

const TransactionModal = ({ isOpen, onClose, initialType = 'expense', initialData = null }) => {
    const dispatch = useDispatch();
    const { cards } = useSelector((state) => state.cards);
    
    // Fetch cards if not already available (might be redundant if page fetches, but safe)
    useEffect(() => {
        if (isOpen && cards.length === 0) {
            dispatch(getCards());
        }
    }, [isOpen, dispatch, cards.length]);

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Other',
        type: initialType,
        card: '' // Empty string means 'Cash' or 'None'
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    description: initialData.description,
                    amount: initialData.amount,
                    category: initialData.category,
                    type: initialData.type,
                    card: initialData.card || ''
                });
            } else {
                setFormData({
                    description: '',
                    amount: '',
                    category: 'Other',
                    type: initialType,
                    card: ''
                });
            }
        }
    }, [isOpen, initialType, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            amount: Number(formData.amount),
            card: formData.card === '' ? null : formData.card
        };
        
        if (initialData) {
            dispatch(updateTransaction({ id: initialData._id, transactionData: data }));
        } else {
            dispatch(addTransaction(data));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-text-primary">
                        {initialData ? 'Edit Transaction' : 'Add Transaction'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-text-muted transition-colors">
                        <RiCloseLine size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-3 p-1 bg-background rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, type: 'income'})}
                            className={`py-2 text-sm font-medium rounded-lg transition-all ${
                                formData.type === 'income' ? 'bg-card text-green-600 shadow-sm' : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, type: 'expense'})}
                            className={`py-2 text-sm font-medium rounded-lg transition-all ${
                                formData.type === 'expense' ? 'bg-card text-red-600 shadow-sm' : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            Expense
                        </button>
                    </div>

                    <Input 
                        label="Description" 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="e.g., Grocery shopping"
                        required
                    />

                    <Input 
                        label="Amount ($)" 
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                    />

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Category</label>
                        <select 
                            className="flex w-full rounded-lg border border-gray-200 dark:border-white/10 bg-background px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Payment Method (Card) - Only for Expenses usually, but allowed for income (refunds etc) */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Payment Method</label>
                        <select 
                            className="flex w-full rounded-lg border border-gray-200 dark:border-white/10 bg-background px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue"
                            value={formData.card}
                            onChange={(e) => setFormData({...formData, card: e.target.value})}
                        >
                            <option value="">Cash / General</option>
                            {cards.map(card => (
                                <option key={card._id} value={card._id}>
                                    {card.bank} - {card.type} (**{card.last4})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white">
                            {initialData ? 'Update Transaction' : 'Save Transaction'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
