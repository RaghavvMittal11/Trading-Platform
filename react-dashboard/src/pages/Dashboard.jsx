import React from 'react';
import StatsCard from '../components/StatsCard';
import PortfolioChart from '../components/PortfolioChart';
import ActiveTrades from '../components/ActiveTrades';
import StrategyPerformance from '../components/StrategyPerformance';
import { Bot, Activity, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Active Bots"
                    value="7"
                    change="+1"
                    isPositive={true}
                    icon={Bot}
                    glowColor="#22c55e"
                />
                <StatsCard
                    title="Total Trades"
                    value="342"
                    change="+342"
                    isPositive={true}
                    icon={Activity}
                    glowColor="#8b5cf6"
                />
                <StatsCard
                    title="Win Rate"
                    value="73.4%"
                    change="+2.1%"
                    isPositive={true}
                    icon={TrendingUp}
                    glowColor="#06b6d4"
                />
                <StatsCard
                    title="Avg Return"
                    value="2.8%"
                    change="+2.1%"
                    isPositive={true}
                    icon={DollarSign}
                    glowColor="#d946ef"
                />
            </div>

            {/* Main Chart Section */}
            <div className="w-full">
                <PortfolioChart />
            </div>

            {/* Bottom Grid: Trades & Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                <div className="lg:col-span-2 h-full">
                    <ActiveTrades />
                </div>
                <div className="lg:col-span-1 h-full">
                    <StrategyPerformance />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
