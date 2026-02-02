import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCards, deleteCard } from '../redux/cardSlice';
import { getTransactions } from '../redux/transactionSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CardModal from '../components/CardModal';
import { RiVisaLine, RiMastercardFill, RiAddLine, RiDeleteBinLine, RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';

const CardsPage = () => {
    const dispatch = useDispatch();
    const { cards, loading: cardsLoading } = useSelector((state) => state.cards);
    const { transactions } = useSelector((state) => state.transactions);
    const { user } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getCards());
        dispatch(getTransactions());
    }, [dispatch]);

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to remove this card?')) {
            dispatch(deleteCard(id));
        }
    };

    const getGradient = (color) => {
        switch(color) {
            case 'purple': return 'from-purple-600 to-indigo-700';
            case 'black': return 'from-slate-800 to-black';
            case 'green': return 'from-emerald-600 to-teal-700';
            default: return 'from-blue-600 to-cyan-700';
        }
    };

    // Filter transactions that have a card linked
    const cardTransactions = transactions.filter(t => t.card);

    return (
        <div className="space-y-8 animate-fade-in font-sans">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">My Cards</h2>
                    <p className="text-text-muted mt-1">Manage your linked payment methods.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="glass-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2">
                    <RiAddLine size={20} />
                    <span>Link New Card</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cardsLoading ? (
                    <div className="col-span-3 text-center py-10 text-text-muted">Loading cards...</div>
                ) : cards.length === 0 ? (
                     <div className="col-span-3 text-center py-10 text-text-muted">No cards linked yet. Add one to get started.</div>
                ) : (
                    cards.map((card) => (
                        <div key={card._id} className={`h-48 rounded-2xl bg-gradient-to-br ${getGradient(card.color)} p-6 text-white shadow-xl relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group`}>
                            <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            
                            {/* Delete Button (visible on hover) */}
                            <button 
                                onClick={(e) => handleDelete(card._id, e)}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <RiDeleteBinLine />
                            </button>

                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                    {card.type === 'Visa' ? <RiVisaLine className="text-4xl opacity-80" /> : <RiMastercardFill className="text-4xl opacity-80" />}
                                    <span className="bg-white/20 px-2 py-1 rounded text-xs backdrop-blur-sm">{card.bank}</span>
                                </div>
                                <div>
                                     <p className="text-lg tracking-widest font-mono opacity-90">•••• •••• •••• {card.last4}</p>
                                     <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <p className="text-[10px] uppercase opacity-70">Card Holder</p>
                                            <p className="font-medium text-sm uppercase">{user?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase opacity-70">Expires</p>
                                            <p className="font-medium text-sm">{card.expiry}</p>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Add Card Placeholder */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-48 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-text-muted hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl">
                        <RiAddLine />
                    </div>
                    <span className="font-medium">Link New Card</span>
                </button>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-text-primary mb-4">Recent Card Activity</h3>
                <Card>
                    {cardTransactions.length === 0 ? (
                        <div className="text-center py-8 text-text-muted text-sm">
                            No recent card-specific transactions found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-white/5 text-xs uppercase tracking-wide text-text-muted">
                                        <th className="p-4 font-medium">Card</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Description</th>
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-text-primary text-sm">
                                    {cardTransactions.slice(0, 10).map((t) => {
                                        const card = cards.find(c => c._id === t.card);
                                        return (
                                            <tr key={t._id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-4 flex items-center gap-3">
                                                    {card ? (
                                                        <span className="flex items-center gap-2">
                                                            {card.type === 'Visa' ? <RiVisaLine className="text-blue-500" /> : <RiMastercardFill className="text-orange-500" />}
                                                            <span className="text-xs text-text-muted">**{card.last4}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-text-muted italic">Unknown Card</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-text-muted">{new Date(t.date).toLocaleDateString()}</td>
                                                <td className="p-4 font-medium">{t.description}</td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-xs">
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-green-500' : 'text-text-primary'}`}>
                                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            <CardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default CardsPage;
