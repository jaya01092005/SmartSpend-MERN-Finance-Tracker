import { useState } from 'react';
import { RiRobot2Line, RiCloseLine, RiSendPlaneFill, RiMagicLine } from 'react-icons/ri';
import { clsx } from 'clsx';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Card from './ui/Card';

const FloatingAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/ai/insights', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInsights(res.data.insights);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleOpen = () => {
        if (!isOpen) {
            fetchInsights();
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Floating Buton */}
            <button 
                onClick={toggleOpen}
                className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-accent-blue rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50 hover:shadow-primary/40 shadow-primary/20"
            >
                {isOpen ? <RiCloseLine size={24} /> : <RiMagicLine size={24} />}
            </button>

            {/* AI Panel */}
            <div className={clsx(
                "fixed top-0 right-0 h-full w-80 glass-panel transform transition-transform duration-300 z-40 border-l border-white/40",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-accent-lavender/20 rounded-lg text-accent-lavender">
                            <RiRobot2Line size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-text-primary">AI Insights</h3>
                            <p className="text-xs text-text-muted">Analyzing your spending</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4">
                        {loading ? (
                            <div className="text-center py-10 text-text-muted">
                                <p className="animate-pulse">Thinking...</p>
                            </div>
                        ) : (
                            insights.map((insight, idx) => (
                                <div key={idx} className={clsx(
                                    "p-4 rounded-xl border mb-3",
                                    insight.type === 'purple' ? "bg-purple-50 border-purple-100" :
                                    insight.type === 'warning' ? "bg-red-50 border-red-100" :
                                    insight.type === 'success' ? "bg-green-50 border-green-100" :
                                    "bg-blue-50 border-blue-100"
                                )}>
                                    <h4 className={clsx(
                                        "font-semibold text-sm mb-1",
                                        insight.type === 'purple' ? "text-purple-700" :
                                        insight.type === 'warning' ? "text-red-700" :
                                        insight.type === 'success' ? "text-green-700" :
                                        "text-blue-700"
                                    )}>{insight.title}</h4>
                                    <p className="text-xs text-text-muted mb-2">{insight.description}</p>
                                    {insight.reason && (
                                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                                            {insight.reason}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        {!loading && insights.length === 0 && (
                            <p className="text-center text-sm text-text-muted">No insights available yet.</p>
                        )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-center text-text-muted">AI generated • Check patterns</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FloatingAI;
