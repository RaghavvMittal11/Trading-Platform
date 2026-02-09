import React from 'react';
import { Bell, Search, Plus, Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
    return (
        <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-dark-bg/80 border-b border-dark-border/50 lg:ml-20 transition-all duration-300">

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-white"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <h2 className="text-xl font-bold text-white">Trading Dashboard</h2>
                    <p className="text-sm text-gray-400 hidden sm:block">Welcome back! Here's your real-time overview.</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center px-4 py-2 rounded-full bg-dark-card border border-dark-border focus-within:border-primary/50 transition-colors w-64">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="bg-transparent border-none outline-none text-sm text-white ml-2 w-full placeholder-gray-600"
                    />
                </div>

                {/* Action Button */}
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent-purple rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <Plus size={18} />
                    Create Bot
                </button>

                {/* Notifications */}
                <button className="relative p-2.5 rounded-full bg-dark-card border border-dark-border hover:bg-white/5 transition-colors group">
                    <Bell size={20} className="text-gray-400 group-hover:text-white" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-red shadow-[0_0_8px_#ef4444]" />
                </button>
            </div>
        </header>
    );
};

export default Header;
