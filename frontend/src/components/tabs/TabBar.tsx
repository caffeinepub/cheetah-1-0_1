import React from 'react';
import { X, Plus, Globe } from 'lucide-react';
import type { Tab } from '../../hooks/useTabs';

interface TabBarProps {
    tabs: Tab[];
    activeTabId: string | null;
    onSwitch: (id: string) => void;
    onClose: (id: string) => void;
    onAdd: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onSwitch, onClose, onAdd }) => {
    return (
        <div
            className="flex items-end gap-0.5 px-2 overflow-x-auto"
            style={{
                background: 'oklch(0.13 0.03 290 / 0.9)',
                borderBottom: '1px solid oklch(0.35 0.12 295 / 0.4)',
                minHeight: '36px',
                scrollbarWidth: 'none',
            }}
        >
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    className={`proxy-tab ${tab.id === activeTabId ? 'active' : ''}`}
                    onClick={() => onSwitch(tab.id)}
                    title={tab.url || 'New Tab'}
                >
                    <Globe size={11} className="flex-shrink-0 opacity-60" />
                    <span className="truncate flex-1 text-xs">
                        {tab.title || 'New Tab'}
                    </span>
                    <button
                        onClick={e => { e.stopPropagation(); onClose(tab.id); }}
                        className="flex-shrink-0 rounded p-0.5 opacity-50 hover:opacity-100 hover:text-red-400 transition-all"
                        style={{ lineHeight: 1 }}
                    >
                        <X size={10} />
                    </button>
                </div>
            ))}
            <button
                onClick={onAdd}
                className="flex items-center justify-center w-7 h-7 rounded mb-0.5 ml-1 flex-shrink-0 transition-all"
                style={{
                    color: 'oklch(0.65 0.1 295)',
                    border: '1px dashed oklch(0.4 0.12 295 / 0.4)',
                }}
                title="New Tab (Ctrl+T)"
                onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.85 0.2 295)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.6 0.2 295 / 0.6)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 8px oklch(0.62 0.25 295 / 0.3)';
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.65 0.1 295)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.4 0.12 295 / 0.4)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                }}
            >
                <Plus size={13} />
            </button>
        </div>
    );
};
