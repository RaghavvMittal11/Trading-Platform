import React from 'react';
import { LayoutDashboard, LineChart, Bot, Sparkles, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: LineChart, label: 'Backtest', path: '/backtest' },
        { icon: Bot, label: 'Trading Bots', path: '/bots' },
        { icon: Sparkles, label: 'Strategies', path: '/strategies' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-screen glass-card border-none rounded-none border-r border-dark-border
        transition-all duration-300 ease-in-out
        w-64 lg:w-20 lg:hover:w-64 group overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full p-3 lg:items-center lg:group-hover:items-stretch transition-all duration-300">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10 px-2 h-10 overflow-hidden whitespace-nowrap mt-3">
                        <div className="min-w-[2.5rem] w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-purple flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            Numatix
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 w-full">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 relative
                                    ${isActive(item.path) ? 'bg-primary/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                    lg:justify-center lg:group-hover:justify-start
                                `}
                                onClick={() => isOpen && toggleSidebar()}
                            >
                                <item.icon size={22} className={`shrink-0 ${isActive(item.path) ? 'text-primary-glow' : ''}`} />
                                <span className={`font-medium whitespace-nowrap transition-all duration-300 lg:absolute lg:left-12 opacity-0 lg:group-hover:opacity-100 lg:group-hover:static lg:block
                                    ${isOpen ? 'block' : 'hidden lg:block'}
                                `}>
                                    {item.label}
                                </span>
                                {isActive(item.path) && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)] lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="pt-6 border-t border-dark-border mt-auto w-full mb-3">
                        <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-colors group/profile lg:justify-center lg:group-hover:justify-start">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="User"
                                className="w-10 h-10 rounded-full border-2 border-dark-border group-hover:border-primary/50 transition-colors shrink-0"
                            />
                            <div className="text-left flex-1 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 overflow-hidden whitespace-nowrap delay-75">
                                <p className="text-sm font-semibold text-white">Alex Trader</p>
                                <p className="text-xs text-gray-400">Pro Plan</p>
                            </div>
                            <LogOut size={18} className="text-gray-500 group-hover:text-white transition-colors lg:opacity-0 lg:group-hover:opacity-100" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
