import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe, Search } from 'lucide-react';
import type { Tab } from '../hooks/useTabs';

interface HomeSearchProps {
    activeTab: Tab | null;
    onOpenUrl: (url: string, newTab?: boolean) => void;
    addressBarRef: React.RefObject<HTMLInputElement | null>;
}

export const HomeSearch: React.FC<HomeSearchProps> = ({ activeTab, onOpenUrl, addressBarRef }) => {
    const [addressValue, setAddressValue] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (activeTab?.url) {
            setAddressValue(activeTab.url);
        } else {
            setAddressValue('');
        }
    }, [activeTab?.url, activeTab?.id]);

    const handleNavigate = useCallback(() => {
        if (!addressValue.trim()) return;
        onOpenUrl(addressValue.trim());
    }, [addressValue, onOpenUrl]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleNavigate();
    };

    const handleBack = () => {
        try { iframeRef.current?.contentWindow?.history.back(); } catch { /* cross-origin */ }
    };
    const handleForward = () => {
        try { iframeRef.current?.contentWindow?.history.forward(); } catch { /* cross-origin */ }
    };
    const handleRefresh = () => {
        if (activeTab?.proxyUrl) {
            onOpenUrl(activeTab.url);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Address Bar */}
            <div
                className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
                style={{
                    background: 'oklch(0.15 0.04 290 / 0.8)',
                    borderBottom: '1px solid oklch(0.3 0.08 295 / 0.3)',
                }}
            >
                <button
                    onClick={handleBack}
                    className="p-1.5 rounded transition-all hover:text-primary"
                    style={{ color: 'oklch(0.55 0.1 295)' }}
                    title="Back"
                >
                    <ArrowLeft size={15} />
                </button>
                <button
                    onClick={handleForward}
                    className="p-1.5 rounded transition-all hover:text-primary"
                    style={{ color: 'oklch(0.55 0.1 295)' }}
                    title="Forward"
                >
                    <ArrowRight size={15} />
                </button>
                <button
                    onClick={handleRefresh}
                    className="p-1.5 rounded transition-all hover:text-primary"
                    style={{ color: 'oklch(0.55 0.1 295)' }}
                    title="Refresh"
                >
                    <RotateCw size={15} />
                </button>

                <div className="flex-1 flex items-center gap-2 relative">
                    <Globe size={13} className="absolute left-3 z-10" style={{ color: 'oklch(0.55 0.1 295)' }} />
                    <input
                        ref={addressBarRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={addressValue}
                        onChange={e => setAddressValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter URL or search..."
                        className="amethyst-input w-full pl-8 pr-3 py-1.5 rounded-lg text-sm"
                    />
                </div>

                <button
                    onClick={() => setShowSearch(s => !s)}
                    className={`p-1.5 rounded transition-all ${showSearch ? 'text-primary' : ''}`}
                    style={{ color: showSearch ? 'oklch(0.7 0.25 295)' : 'oklch(0.55 0.1 295)' }}
                    title="Toggle Search"
                >
                    <Search size={15} />
                </button>
            </div>

            {/* Google CSE Search */}
            {showSearch && (
                <div
                    className="px-4 py-3 flex-shrink-0"
                    style={{
                        background: 'oklch(0.14 0.03 290 / 0.9)',
                        borderBottom: '1px solid oklch(0.3 0.08 295 / 0.3)',
                    }}
                >
                    <div className="gcse-search" data-resultsUrl="javascript:void(0)" />
                </div>
            )}

            {/* Content area - show new tab page or iframe */}
            {!activeTab?.proxyUrl ? (
                <NewTabPage onOpenUrl={onOpenUrl} onShowSearch={() => setShowSearch(true)} />
            ) : activeTab.hasError ? (
                <ErrorPage url={activeTab.url} />
            ) : (
                <div className="flex-1 relative" style={{ minHeight: 0 }}>
                    {activeTab.isLoading && (
                        <div
                            className="absolute inset-0 z-10 flex items-center justify-center"
                            style={{ background: 'oklch(0.12 0.025 290 / 0.85)', backdropFilter: 'blur(4px)' }}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className="spinner" />
                                <span className="text-xs font-mono text-muted-foreground animate-pulse">
                                    Loading via Cheetah proxy...
                                </span>
                            </div>
                        </div>
                    )}
                    <iframe
                        ref={iframeRef}
                        src={activeTab.proxyUrl}
                        className="w-full h-full border-0"
                        title={activeTab.title}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                        style={{ display: 'block' }}
                    />
                </div>
            )}
        </div>
    );
};

const NewTabPage: React.FC<{ onOpenUrl: (url: string, newTab?: boolean) => void; onShowSearch: () => void }> = ({ onOpenUrl, onShowSearch }) => {
    const quickLinks = [
        { label: 'Google', url: 'https://google.com', color: 'oklch(0.65 0.2 250)' },
        { label: 'YouTube', url: 'https://youtube.com', color: 'oklch(0.55 0.22 25)' },
        { label: 'Wikipedia', url: 'https://wikipedia.org', color: 'oklch(0.7 0.05 290)' },
        { label: 'Khan Academy', url: 'https://khanacademy.org', color: 'oklch(0.6 0.2 150)' },
        { label: 'Scratch', url: 'https://scratch.mit.edu', color: 'oklch(0.65 0.2 30)' },
        { label: 'ChatGPT', url: 'https://chat.openai.com', color: 'oklch(0.7 0.15 160)' },
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 animated-bg p-8" style={{ minHeight: 0 }}>
            <div className="text-center animate-float">
                <img
                    src="/assets/generated/cheetah-logo.dim_128x128.png"
                    alt="Cheetah"
                    className="w-16 h-16 mx-auto mb-3"
                    style={{ filter: 'drop-shadow(0 0 16px oklch(0.62 0.25 295 / 0.7))' }}
                />
                <h1 className="text-3xl font-display font-bold gradient-text tracking-wider">CHEETAH 1.0</h1>
                <p className="text-sm font-mono mt-1" style={{ color: 'oklch(0.55 0.1 295)' }}>
                    High-Speed Proxy Browser
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onShowSearch}
                    className="neon-btn px-5 py-2.5 rounded-lg text-sm flex items-center gap-2"
                >
                    <Search size={14} />
                    Google Search
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                {quickLinks.map(link => (
                    <button
                        key={link.url}
                        onClick={() => onOpenUrl(link.url)}
                        className="glass-panel rounded-lg p-3 text-center site-card"
                        style={{ borderColor: `${link.color} / 0.3` }}
                    >
                        <div
                            className="w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-mono font-bold"
                            style={{ background: `${link.color} / 0.2`, color: link.color }}
                        >
                            {link.label[0]}
                        </div>
                        <span className="text-xs font-mono" style={{ color: 'oklch(0.75 0.08 290)' }}>
                            {link.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const ErrorPage: React.FC<{ url: string }> = ({ url }) => (
    <div className="flex-1 flex items-center justify-center animated-bg" style={{ minHeight: 0 }}>
        <div className="glass-panel rounded-xl p-8 max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'oklch(0.85 0.1 295)' }}>
                Unable to Load Page
            </h3>
            <p className="text-sm font-mono text-muted-foreground mb-4">
                This site cannot be embedded due to security restrictions (X-Frame-Options or CSP).
            </p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            >
                Open Directly ↗
            </a>
        </div>
    </div>
);
