import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-primary/30">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <Header toggleSidebar={toggleSidebar} />

            <main className="lg:ml-20 p-6 transition-all duration-300 min-h-[calc(100vh-80px)]">
                <div className="max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
