import React from 'react';
import { 
    Bell, 
    Menu, 
    Sun, 
    Search as SearchIcon, 
    Moon 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '@clerk/clerk-react';

interface HeaderProps {
    onMenuClick: () => void;
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title = "All Products" }) => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useUser();
    const isDarkMode = theme === 'dark';

    return (
        <header className="h-[80px] bg-primary-background md:rounded-b-[20px] shadow-sm flex items-center justify-between px-6 sticky top-0 z-20 md:ml-64 transition-all rounded-2xl">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="md:hidden p-2 text-text-secondary hover:bg-secondary-background rounded-lg">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-bold text-text-primary hidden sm:block">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative w-[300px] hidden md:block">
                    <input
                        type="text"
                        placeholder="Search data, users, or reports"
                        className="w-full pl-6 pr-10 py-3 bg-text-primary/10 rounded-xl text-xs text-text-secondary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-gray-100 transition-all font-medium"
                    />
                    <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-primary bg-text-primary/10 rounded-xl hover:bg-text-primary/20 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </button>

                    <button
                        className="relative w-16 h-7 bg-text-primary/10 rounded-full p-1 flex items-center cursor-pointer"
                        onClick={toggleTheme}
                    >
                        <div className={`w-5 h-5 bg-text-primary/15 rounded-full shadow-sm flex items-center justify-center text-primary transform transition-transform ${isDarkMode ? 'translate-x-[36px]' : 'translate-x-0'}`}>
                            {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
                        </div>
                    </button>

                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                            src={user?.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"}
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};
