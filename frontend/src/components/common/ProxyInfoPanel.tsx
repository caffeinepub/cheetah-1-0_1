import React, { useState } from 'react';
import { Info, X, Shield, Zap, Globe, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface ProxyInfoPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProxyInfoPanel: React.FC<ProxyInfoPanelProps> = ({ isOpen, onClose }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleSection = (section: string) => {
        setExpandedSection(prev => (prev === section ? null : section));
    };

    return (
        <div
            className="absolute top-full left-0 right-0 z-50 page-enter"
            style={{
                background: 'oklch(0.14 0.035 290 / 0.97)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid oklch(0.55 0.2 295 / 0.35)',
                boxShadow: '0 8px 40px oklch(0.12 0.025 290 / 0.8), 0 0 30px oklch(0.62 0.25 295 / 0.1)',
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: '1px solid oklch(0.4 0.15 295 / 0.2)' }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ background: 'oklch(0.45 0.22 295 / 0.25)', border: '1px solid oklch(0.62 0.25 295 / 0.4)' }}
                    >
                        <Shield size={12} style={{ color: 'oklch(0.72 0.25 295)' }} />
                    </div>
                    <span className="text-xs font-mono font-bold tracking-widest uppercase" style={{ color: 'oklch(0.82 0.18 295)' }}>
                        Proxy Configuration
                    </span>
                    <span
                        className="text-xs font-mono px-1.5 py-0.5 rounded"
                        style={{
                            background: 'oklch(0.45 0.22 295 / 0.2)',
                            border: '1px solid oklch(0.62 0.25 295 / 0.3)',
                            color: 'oklch(0.7 0.2 295)',
                        }}
                    >
                        v1.0
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded transition-all"
                    style={{ color: 'oklch(0.55 0.1 295)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.82 0.18 295)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.55 0.1 295)')}
                    title="Close"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 py-3 grid grid-cols-1 gap-2 max-h-72 overflow-y-auto">

                {/* CORS Proxy Route */}
                <div
                    className="rounded-lg overflow-hidden"
                    style={{ border: '1px solid oklch(0.4 0.15 295 / 0.25)' }}
                >
                    <button
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left transition-all"
                        style={{ background: 'oklch(0.18 0.05 290 / 0.6)' }}
                        onClick={() => toggleSection('cors')}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.22 0.07 295 / 0.5)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.18 0.05 290 / 0.6)')}
                    >
                        <div className="flex items-center gap-2">
                            <Globe size={12} style={{ color: 'oklch(0.65 0.22 295)' }} />
                            <span className="text-xs font-mono font-semibold" style={{ color: 'oklch(0.85 0.12 295)' }}>
                                CORS Proxy Layer
                            </span>
                        </div>
                        {expandedSection === 'cors'
                            ? <ChevronUp size={12} style={{ color: 'oklch(0.55 0.1 295)' }} />
                            : <ChevronDown size={12} style={{ color: 'oklch(0.55 0.1 295)' }} />
                        }
                    </button>
                    {expandedSection === 'cors' && (
                        <div
                            className="px-3 py-2.5 space-y-2"
                            style={{ background: 'oklch(0.14 0.03 290 / 0.7)', borderTop: '1px solid oklch(0.4 0.15 295 / 0.2)' }}
                        >
                            <p className="text-xs font-mono" style={{ color: 'oklch(0.7 0.06 290)' }}>
                                All browsing traffic is routed through the <span style={{ color: 'oklch(0.72 0.22 295)' }}>allorigins.win</span> CORS proxy to bypass cross-origin restrictions.
                            </p>
                            <div
                                className="rounded px-2.5 py-2 font-mono text-xs flex items-center gap-2 overflow-x-auto"
                                style={{
                                    background: 'oklch(0.1 0.02 290)',
                                    border: '1px solid oklch(0.35 0.12 295 / 0.4)',
                                    color: 'oklch(0.65 0.2 295)',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <span style={{ color: 'oklch(0.5 0.08 290)' }}>GET</span>
                                <span>https://api.allorigins.win/raw?url=</span>
                                <span style={{ color: 'oklch(0.72 0.22 310)' }}>&lt;encoded-url&gt;</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Port & Forwarding */}
                <div
                    className="rounded-lg overflow-hidden"
                    style={{ border: '1px solid oklch(0.4 0.15 295 / 0.25)' }}
                >
                    <button
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left transition-all"
                        style={{ background: 'oklch(0.18 0.05 290 / 0.6)' }}
                        onClick={() => toggleSection('port')}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.22 0.07 295 / 0.5)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.18 0.05 290 / 0.6)')}
                    >
                        <div className="flex items-center gap-2">
                            <Zap size={12} style={{ color: 'oklch(0.65 0.22 295)' }} />
                            <span className="text-xs font-mono font-semibold" style={{ color: 'oklch(0.85 0.12 295)' }}>
                                Request Forwarding
                            </span>
                        </div>
                        {expandedSection === 'port'
                            ? <ChevronUp size={12} style={{ color: 'oklch(0.55 0.1 295)' }} />
                            : <ChevronDown size={12} style={{ color: 'oklch(0.55 0.1 295)' }} />
                        }
                    </button>
                    {expandedSection === 'port' && (
                        <div
                            className="px-3 py-2.5 space-y-2"
                            style={{ background: 'oklch(0.14 0.03 290 / 0.7)', borderTop: '1px solid oklch(0.4 0.15 295 / 0.2)' }}
                        >
                            <p className="text-xs font-mono" style={{ color: 'oklch(0.7 0.06 290)' }}>
                                Conceptually equivalent to a local proxy server listening on port{' '}
                                <span style={{ color: 'oklch(0.72 0.22 295)' }}>8000</span> and forwarding requests to the target URL.
                            </p>
                            <div
                                className="rounded px-2.5 py-2 font-mono text-xs flex items-center gap-2"
                                style={{
                                    background: 'oklch(0.1 0.02 290)',
                                    border: '1px solid oklch(0.35 0.12 295 / 0.4)',
                                }}
                            >
                                <span style={{ color: 'oklch(0.62 0.18 295)' }}>localhost</span>
                                <span style={{ color: 'oklch(0.5 0.08 290)' }}>:</span>
                                <span style={{ color: 'oklch(0.72 0.22 310)' }}>8000</span>
                                <ArrowRight size={10} style={{ color: 'oklch(0.5 0.08 290)' }} />
                                <span style={{ color: 'oklch(0.7 0.15 295)' }}>target URL</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status row */}
                <div
                    className="rounded-lg px-3 py-2 flex items-center justify-between"
                    style={{
                        background: 'oklch(0.18 0.05 290 / 0.5)',
                        border: '1px solid oklch(0.4 0.15 295 / 0.2)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                    background: 'oklch(0.65 0.22 150)',
                                    boxShadow: '0 0 6px oklch(0.65 0.22 150 / 0.8)',
                                    animation: 'pulse-glow 2s ease-in-out infinite',
                                }}
                            />
                            <span className="text-xs font-mono" style={{ color: 'oklch(0.65 0.22 150)' }}>Active</span>
                        </div>
                        <span className="text-xs font-mono" style={{ color: 'oklch(0.45 0.08 290)' }}>|</span>
                        <span className="text-xs font-mono" style={{ color: 'oklch(0.6 0.06 290)' }}>
                            Provider: <span style={{ color: 'oklch(0.7 0.18 295)' }}>allorigins.win</span>
                        </span>
                    </div>
                    <span className="text-xs font-mono" style={{ color: 'oklch(0.5 0.08 290)' }}>
                        Port <span style={{ color: 'oklch(0.65 0.18 295)' }}>8000</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

interface ProxyInfoButtonProps {
    onClick: () => void;
    isActive: boolean;
}

export const ProxyInfoButton: React.FC<ProxyInfoButtonProps> = ({ onClick, isActive }) => (
    <button
        onClick={onClick}
        className="p-1.5 rounded transition-all"
        style={{
            color: isActive ? 'oklch(0.72 0.25 295)' : 'oklch(0.55 0.1 295)',
            background: isActive ? 'oklch(0.45 0.22 295 / 0.2)' : 'transparent',
            border: `1px solid ${isActive ? 'oklch(0.62 0.25 295 / 0.4)' : 'transparent'}`,
        }}
        title="Proxy Info"
    >
        <Info size={15} />
    </button>
);
