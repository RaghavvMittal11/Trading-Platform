import { LayoutDashboard, LineChart, Bot, Sparkles, Settings } from 'lucide-react';

/**
 * Navigation items for the sidebar.
 * @type {Array<{icon: import('lucide-react').LucideIcon, label: string, path: string}>}
 */
export const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: LineChart, label: 'Backtest', path: '/backtest' },
    { icon: Bot, label: 'Trading Bots', path: '/bots' },
    { icon: Sparkles, label: 'Strategies', path: '/strategies' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];
