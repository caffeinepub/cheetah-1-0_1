import React, { useState } from 'react';
import { Info, X, Shield, Zap, Globe, ChevronDown, ChevronUp } from 'lucide-react';

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
                                All browsing traffic is routed through the <span style={{ color: 'oklch(0.72 0.22 295)' }}>google.com</span> CORS proxy to bypass cross-origin restrictions.
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
                                <span>https://google.com/search?q=</span>
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
                                Requests are forwarded through the google.com API endpoint. If the primary proxy fails, the browser automatically falls back through a chain of alternative CORS proxies.
                            </p>
                            <div className="flex flex-col gap-1">
                                {[
                                    'google.com/search?q=',
                                    'corsproxy.io/?url=',
                                    'cors-anywhere.herokuapp.com/',
                                    'api.codetabs.com/v1/proxy?quest=',
                                    'thingproxy.freeboard.io/fetch/',
                                ].map((proxy, i) => (
                                    <div
                                        key={proxy}
                                        className="flex items-center gap-2 text-xs font-mono px-2 py-1 rounded"
                                        style={{
                                            background: i === 0 ? 'oklch(0.2 0.08 295 / 0.3)' : 'oklch(0.12 0.02 290 / 0.5)',
                                            border: `1px solid ${i === 0 ? 'oklch(0.5 0.18 295 / 0.4)' : 'oklch(0.3 0.06 290 / 0.3)'}`,
                                        }}
                                    >
                                        <span
                                            className="w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0"
                                            style={{
                                                background: i === 0 ? 'oklch(0.55 0.22 295 / 0.4)' : 'oklch(0.25 0.05 290 / 0.5)',
                                                color: i === 0 ? 'oklch(0.82 0.2 295)' : 'oklch(0.5 0.08 290)',
                                                fontSize: '9px',
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <span style={{ color: i === 0 ? 'oklch(0.75 0.18 295)' : 'oklch(0.55 0.08 290)' }}>
                                            {proxy}
                                        </span>
                                        {i === 0 && (
                                            <span
                                                className="ml-auto text-xs px-1 rounded"
                                                style={{
                                                    background: 'oklch(0.35 0.15 150 / 0.3)',
                                                    color: 'oklch(0.65 0.18 150)',
                                                    fontSize: '9px',
                                                }}
                                            >
                                                active
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status */}
                <div
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{
                        background: 'oklch(0.18 0.05 290 / 0.6)',
                        border: '1px solid oklch(0.4 0.15 295 / 0.25)',
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Info size={12} style={{ color: 'oklch(0.65 0.22 295)' }} />
                        <span className="text-xs font-mono" style={{ color: 'oklch(0.7 0.08 290)' }}>
                            Primary Proxy
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: 'oklch(0.65 0.22 150)', boxShadow: '0 0 6px oklch(0.65 0.22 150)' }}
                        />
                        <span className="text-xs font-mono" style={{ color: 'oklch(0.72 0.22 295)' }}>
                            google.com
                        </span>
                    </div>
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
        style={{ color: isActive ? 'oklch(0.72 0.25 295)' : 'oklch(0.55 0.1 295)' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.72 0.25 295)')}
        onMouseLeave={e => {
            if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.55 0.1 295)';
        }}
        title="Proxy Info"
    >
        <Info size={15} />
    </button>
);
