import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { User, Lock, Bell, Store, HelpCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'store', label: 'Store Preferences', icon: Store },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
];

export const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <MainLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary font-sans">Settings</h1>
                <p className="text-text-secondary mt-1">Manage your account and store preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === tab.id
                                    ? 'bg-admin-burgundy text-white shadow-md'
                                    : 'text-text-secondary hover:bg-admin-mint hover:text-admin-burgundy'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                >
                    <div className="bg-primary-background rounded-2xl shadow-sm border border-secondary-background p-6 max-w-2xl">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-text-primary font-sans mb-1">Public Profile</h2>
                                    <p className="text-sm text-text-secondary">This will be displayed on your profile.</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-secondary-background rounded-full border-4 border-primary-background shadow-sm overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80" alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <button className="px-4 py-2 border border-secondary-background rounded-xl text-sm font-medium hover:bg-secondary-background text-text-primary transition-colors">Change Avatar</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-primary">First Name</label>
                                        <input type="text" defaultValue="Admin" className="w-full px-4 py-2 bg-secondary-background text-text-primary border border-secondary-background rounded-xl focus:ring-2 focus:ring-admin-burgundy/10 focus:border-admin-burgundy/20 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-primary">Last Name</label>
                                        <input type="text" defaultValue="User" className="w-full px-4 py-2 bg-secondary-background text-text-primary border border-secondary-background rounded-xl focus:ring-2 focus:ring-admin-burgundy/10 focus:border-admin-burgundy/20 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-primary">Email Address</label>
                                    <input type="email" defaultValue="jenniferikhaxuangbe642@gmail.com" className="w-full px-4 py-2 bg-secondary-background text-text-primary border border-secondary-background rounded-xl focus:ring-2 focus:ring-admin-burgundy/10 focus:border-admin-burgundy/20 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-primary">Bio</label>
                                    <textarea rows={4} className="w-full px-4 py-2 bg-secondary-background text-text-primary border border-secondary-background rounded-xl focus:ring-2 focus:ring-admin-burgundy/10 focus:border-admin-burgundy/20 outline-none transition-all" placeholder="Tell us a little about yourself..."></textarea>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-text-primary font-sans mb-1">Password & Security</h2>
                                    <p className="text-sm text-text-secondary">Manage your password and security preferences.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-primary">Current Password</label>
                                        <input type="password" className="w-full px-4 py-2 bg-secondary-background text-text-primary border border-secondary-background rounded-xl focus:ring-2 focus:ring-admin-burgundy/10 focus:border-admin-burgundy/20 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-primary">New Password</label>
                                        <input type="password" className="w-full px-4 py-2 bg-secondary-background text-text-primary border border-secondary-background rounded-xl focus:ring-2 focus:ring-admin-burgundy/10 focus:border-admin-burgundy/20 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-primary">Confirm New Password</label>
                                        <input type="password" className="w-full px-4 py-2 bg-secondary-background text-text-primary border border-secondary-background rounded-xl focus:ring-2 focus:ring-admin-burgundy/10 focus:border-admin-burgundy/20 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Placeholder for other tabs */}
                        {['notifications', 'store', 'support'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-16 h-16 bg-secondary-background rounded-full flex items-center justify-center mb-4 text-text-secondary">
                                    {activeTab === 'notifications' ? <Bell size={32} /> : activeTab === 'store' ? <Store size={32} /> : <HelpCircle size={32} />}
                                </div>
                                <h3 className="text-lg font-bold text-text-primary">Under Construction</h3>
                                <p className="text-text-secondary max-w-xs">{tabs.find(t => t.id === activeTab)?.label} will be available in the next update.</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-secondary-background flex justify-end">
                            <button className="flex items-center gap-2 px-6 py-2 bg-admin-burgundy text-white rounded-xl hover:bg-admin-burgundy/90 shadow-lg shadow-admin-burgundy/20 transition-colors">
                                <Save size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
};
