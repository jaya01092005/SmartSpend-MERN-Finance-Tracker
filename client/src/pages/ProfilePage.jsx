import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RiUser3Line, RiShieldUserLine, RiSettings3Line, RiNotification3Line, RiCloseLine } from 'react-icons/ri';
import Card from '../components/ui/Card';
import { useTheme } from '../components/ThemeProvider';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import axios from 'axios';

const ProfilePage = () => {
    const { user, token } = useSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in font-sans">
             <div>
                <h2 className="text-3xl font-bold text-text-primary">Profile</h2>
                <p className="text-text-muted mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1 border-t-4 border-t-primary">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl mb-4 border-4 border-white shadow-lg">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-bold text-text-primary">{user?.name}</h3>
                        <p className="text-text-muted text-sm mb-4">{user?.email}</p>
                        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            Active Member
                        </div>
                    </div>
                </Card>

                {/* Settings Form */}
                <Card className="md:col-span-2">
                    <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                        <RiSettings3Line className="text-primary" />
                        Account Details
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1 uppercase tracking-wide">Full Name</label>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-text-primary font-medium border border-gray-100 dark:border-white/10">
                                    {user?.name}
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-text-muted mb-1 uppercase tracking-wide">Email Address</label>
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-text-primary font-medium border border-gray-100 dark:border-white/10">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 dark:border-white/10 mt-4">
                             <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                <RiShieldUserLine className="text-accent-blue" />
                                Security
                             </h4>
                             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                                <div>
                                    <p className="font-medium text-text-primary">Password</p>
                                    <p className="text-xs text-text-muted">Last changed 3 months ago</p>
                                </div>
                                <button 
                                    onClick={() => setShowPasswordModal(true)}
                                    className="text-primary text-sm font-semibold hover:underline"
                                >
                                    Change
                                </button>
                             </div>
                        </div>

                        <div className="pt-2">
                             <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                <RiNotification3Line className="text-accent-pink" />
                                Preferences
                             </h4>
                             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                                <div>
                                    <p className="font-medium text-text-primary">Dark Mode</p>
                                    <p className="text-xs text-text-muted">Toggle application theme</p>
                                </div>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input 
                                        type="checkbox" 
                                        name="toggle" 
                                        id="toggle" 
                                        checked={theme === 'dark'}
                                        onChange={toggleTheme}
                                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 dark:border-gray-600 transition-all duration-300"
                                        style={{ right: theme === 'dark' ? '0' : 'auto', left: theme === 'dark' ? 'auto' : '0', borderColor: theme === 'dark' ? '#6C5DD3' : '#E2E2EA' }}
                                    />
                                    <label 
                                        htmlFor="toggle" 
                                        className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
                                    ></label>
                                </div>
                             </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && <ChangePasswordModal token={token} onClose={() => setShowPasswordModal(false)} />}
        </div>
    );
};

const ChangePasswordModal = ({ token, onClose }) => {
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await axios.put('http://localhost:5000/api/auth/updatepassword', passData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setTimeout(onClose, 1500);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-text-primary">Change Password</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-text-muted transition-colors">
                        <RiCloseLine size={24} />
                    </button>
                </div>
                
                {message && (
                    <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Current Password" 
                        type="password"
                        value={passData.currentPassword}
                        onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                        required
                    />
                    <Input 
                        label="New Password" 
                        type="password"
                        value={passData.newPassword}
                        onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                        required
                        minLength={6}
                    />
                    <div className="pt-2">
                        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white">
                            {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
