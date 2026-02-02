import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCard } from '../redux/cardSlice';
import { RiCloseLine, RiVisaLine, RiMastercardFill } from 'react-icons/ri';
import Button from './ui/Button';
import Input from './ui/Input';

const CardModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        bank: '',
        type: 'Visa',
        last4: '',
        expiry: '',
        color: 'blue'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addCard(formData));
        setFormData({ bank: '', type: 'Visa', last4: '', expiry: '', color: 'blue' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-text-primary">Add New Card</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-text-muted transition-colors">
                        <RiCloseLine size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Bank Name" 
                        value={formData.bank}
                        onChange={(e) => setFormData({...formData, bank: e.target.value})}
                        placeholder="e.g., Chase, Citi"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Card Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'Visa'})}
                                    className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                                        formData.type === 'Visa' ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 dark:border-white/10 text-text-muted'
                                    }`}
                                >
                                    <RiVisaLine size={24} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'Mastercard'})}
                                    className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                                        formData.type === 'Mastercard' ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 dark:border-white/10 text-text-muted'
                                    }`}
                                >
                                    <RiMastercardFill size={24} />
                                </button>
                            </div>
                         </div>
                         <Input 
                            label="Last 4 Digits" 
                            value={formData.last4}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setFormData({...formData, last4: val})
                            }}
                            placeholder="4242"
                            required
                            maxLength={4}
                        />
                    </div>

                    <Input 
                        label="Expiry Date (MM/YY)" 
                        value={formData.expiry}
                        onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            else val = val.slice(0, 4);
                            setFormData({...formData, expiry: val})
                        }}
                        placeholder="12/28"
                        required
                        maxLength={5}
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Card Color</label>
                         <div className="flex gap-3">
                            {['blue', 'purple', 'black', 'green'].map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({...formData, color})}
                                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                                        formData.color === color ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''
                                    }`}
                                    style={{ 
                                        backgroundColor: 
                                            color === 'blue' ? '#4D7CFE' : 
                                            color === 'purple' ? '#6C5DD3' : 
                                            color === 'black' ? '#1F1D2B' : '#00D09C' 
                                    }}
                                ></button>
                            ))}
                         </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white">
                            Link Card
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardModal;
