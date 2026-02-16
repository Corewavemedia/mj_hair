import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
    children: React.ReactNode;
}

const getPageTitle = (pathname: string) => {
    switch (pathname) {
        case '/': return 'Dashboard';
        case '/products': return 'All Products';
        case '/add-products': return 'Add New Product';
        case '/orders': return 'Order Management';
        case '/sales-report': return 'Sales Report';
        case '/invoice': return 'Invoices';
        case '/invoice/new': return 'New Invoice';
        case '/custom-catering': return 'Custom Catering';
        case '/customers': return 'Customers';
        case '/settings': return 'Settings';
        default: return 'Dashboard';
    }
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const title = getPageTitle(location.pathname);

    return (
        <div className="min-h-screen font-sans text-gray-900 m-0 pt-6 bg-main-background">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className='w-full px-4 md:px-8'>
                <Header onMenuClick={() => setIsSidebarOpen(true)} title={title} />
            </div>
            <main className="md:ml-64 p-4 md:p-8 pt-6 min-h-[calc(100vh-80px)]">
                <div className="w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
