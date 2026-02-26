import React from 'react';
import { Home, Gamepad2, Brain, Code2, Zap } from 'lucide-react';

export type PageId = 'home' | 'games' | 'ai' | 'code' | 'quickopen';

interface NavItem {
    id: PageId;
    label: string;
    icon: React.ReactNode;
    shortLabel: string;
}

const navItems: NavItem[] = [
    { id: 'home', label: 'Search & Proxy', icon: <Home size={16} />, shortLabel: 'Home' },
    { id: 'games', label: 'Games', icon: <Gamepad2 size={16} />, shortLabel: 'Games' },
    { id: 'ai', label: 'AI Assistant', icon: <Brain size={16} />, shortLabel: 'AI' },
    { id: 'code', label: 'Code Editor', icon: <Code2 size={16} />, shortLabel: 'Code' },
    { id: 'quickopen', label: 'Quick Open', icon: <Zap size={16} />, shortLabel: 'Quick' },
];

interface NavigationProps {
    activePage: PageId;
    onNavigate: (page: PageId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activePage, onNavigate }) => {
    return (
        <nav
            className="flex flex-col gap-1 p-2 flex-shrink-0"
            style={{
                width: '160px',
                background: 'oklch(0.13 0.03 290 / 0.9)',
                borderRight: '1px solid oklch(0.35 0.1 295 / 0.3)',
                backdropFilter: 'blur(16px)',
            }}
        >
            <div className="px-2 py-2 mb-1">
                <span
                    className="text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'oklch(0.45 0.1 295)' }}
                >
                    Navigation
                </span>
            </div>
            {navItems.map(item => (
                <button
                    key={item.id}
                    className={`nav-item w-full text-left ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                </button>
            ))}

            <div className="mt-auto pt-4 px-2">
                <div
                    className="text-xs font-mono text-center py-2 rounded"
                    style={{
                        color: 'oklch(0.4 0.08 295)',
                        borderTop: '1px solid oklch(0.3 0.08 295 / 0.3)',
                    }}
                >
                    <div>Ctrl+T New Tab</div>
                    <div>Ctrl+W Close</div>
                    <div>Ctrl+L Address</div>
                </div>
            </div>
        </nav>
    );
};
