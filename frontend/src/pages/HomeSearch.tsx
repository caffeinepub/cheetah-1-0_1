import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe, Search, ExternalLink, RefreshCw } from 'lucide-react';
import type { Tab } from '../hooks/useTabs';
import { PROXY_COUNT, isTikTokUrl } from '../hooks/useTabs';
import { ProxyInfoPanel, ProxyInfoButton } from '../components/common/ProxyInfoPanel';

interface HomeSearchProps {
    activeTab: Tab | null;
    onOpenUrl: (url: string, newTab?: boolean) => void;
    addressBarRef: React.RefObject<HTMLInputElement | null>;
    onRetryProxy?: (id: string) => void;
    onNavigateToUrl?: (id: string, url?: string) => void;
}

export const HomeSearch: React.FC<HomeSearchProps> = ({
    activeTab,
    onOpenUrl,
    addressBarRef,
    onRetryProxy,
    onNavigateToUrl,
}) => {
    const [addressValue, setAddressValue] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showProxyInfo, setShowProxyInfo] = useState(false);
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
        if (activeTab?.url) {
            onOpenUrl(activeTab.url);
        }
    };

    // Active proxy label for display
    const proxyIdx = activeTab?.proxyIndex ?? 0;
    const proxyLabels = ['proxycroxy.io', 'corsproxy.io', 'cors-anywhere', 'codetabs.com', 'thingproxy'];
    const activeProxyLabel = proxyLabels[proxyIdx] ?? `proxy ${proxyIdx + 1}`;

    const handleTryAgain = () => {
        if (activeTab && onNavigateToUrl) {
            onNavigateToUrl(activeTab.id);
        }
    };

    const handleOpenInNewWindow = () => {
        if (activeTab?.url) {
            window.open(activeTab.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Address Bar */}
            <div
                className="flex items-center gap-2 px-3 py-2 flex-shrink-0 relative"
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

                {/* Active proxy indicator */}
                {activeTab?.proxyUrl && (
                    <span
                        className="hidden sm:flex items-center text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                            background: 'oklch(0.2 0.08 295 / 0.5)',
                            border: '1px solid oklch(0.4 0.12 295 / 0.3)',
                            color: 'oklch(0.55 0.12 295)',
                        }}
                        title={`Using proxy: ${activeProxyLabel}`}
                    >
                        {activeProxyLabel}
                    </span>
                )}

                <ProxyInfoButton
                    onClick={() => setShowProxyInfo(s => !s)}
                    isActive={showProxyInfo}
                />

                <button
                    onClick={() => setShowSearch(s => !s)}
                    className={`p-1.5 rounded transition-all ${showSearch ? 'text-primary' : ''}`}
                    style={{ color: showSearch ? 'oklch(0.7 0.25 295)' : 'oklch(0.55 0.1 295)' }}
                    title="Toggle Search"
                >
                    <Search size={15} />
                </button>

                {/* Proxy Info Panel — anchored below address bar */}
                <ProxyInfoPanel
                    isOpen={showProxyInfo}
                    onClose={() => setShowProxyInfo(false)}
                />
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
                <ErrorPage
                    url={activeTab.url}
                    onTryAgain={handleTryAgain}
                    onOpenInNewWindow={handleOpenInNewWindow}
                />
            ) : (
                <div className="flex-1 relative" style={{ minHeight: 0 }}>
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

            <div className="flex gap-3 flex-wrap justify-center">
                <button
                    onClick={onShowSearch}
                    className="neon-btn px-4 py-2 rounded-lg text-sm font-mono"
                >
                    Search
                </button>
                {quickLinks.map(link => (
                    <button
                        key={link.label}
                        onClick={() => onOpenUrl(link.url)}
                        className="glass-panel px-4 py-2 rounded-lg text-sm font-mono transition-all hover:scale-105"
                        style={{ color: link.color, border: `1px solid ${link.color}40` }}
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 text-xs font-mono text-muted-foreground flex-wrap justify-center">
                <span className="glass-panel px-3 py-1.5 rounded-full">Ctrl+T New Tab</span>
                <span className="glass-panel px-3 py-1.5 rounded-full">Ctrl+W Close</span>
                <span className="glass-panel px-3 py-1.5 rounded-full">Ctrl+L Address Bar</span>
                <span className="glass-panel px-3 py-1.5 rounded-full">Ctrl/⌘+P Panic</span>
            </div>
        </div>
    );
};

interface ErrorPageProps {
    url: string;
    onTryAgain?: () => void;
    onOpenInNewWindow?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ url, onTryAgain, onOpenInNewWindow }) => {
    const isTikTok = isTikTokUrl(url);

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 animated-bg" style={{ minHeight: 0 }}>
            <div className="glass-panel rounded-xl p-8 max-w-md text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'oklch(0.85 0.1 295)' }}>
                    Unable to Load Page
                </h3>
                {isTikTok ? (
                    <>
                        <p className="text-sm font-mono text-muted-foreground mb-2">
                            TikTok blocks embedding via X-Frame-Options headers.
                        </p>
                        <p className="text-xs font-mono mb-4" style={{ color: 'oklch(0.5 0.08 295)' }}>
                            Tried {PROXY_COUNT} proxy servers + embed fallback
                        </p>
                        <a
                            href="https://www.tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="neon-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold mb-4 w-full justify-center"
                            style={{
                                background: 'linear-gradient(135deg, oklch(0.18 0.04 200 / 0.8), oklch(0.22 0.06 340 / 0.6))',
                                border: '1px solid oklch(0.75 0.05 200 / 0.5)',
                                color: 'oklch(0.9 0.05 200)',
                                boxShadow: '0 0 16px oklch(0.75 0.05 200 / 0.3)',
                            }}
                        >
                            <ExternalLink size={16} />
                            Open TikTok in New Tab
                        </a>
                    </>
                ) : (
                    <>
                        <p className="text-sm font-mono text-muted-foreground mb-2">
                            All proxy routes were tried. This site may block embedding.
                        </p>
                        <p className="text-xs font-mono mb-4" style={{ color: 'oklch(0.5 0.08 295)' }}>
                            Tried {PROXY_COUNT} proxy servers
                        </p>
                    </>
                )}
                <div className="flex gap-3 justify-center flex-wrap">
                    {onTryAgain && (
                        <button
                            onClick={onTryAgain}
                            className="neon-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                            style={{ boxShadow: '0 0 12px oklch(0.62 0.25 295 / 0.3)' }}
                        >
                            <RotateCw size={14} />
                            Try Again
                        </button>
                    )}
                    {onOpenInNewWindow && (
                        <button
                            onClick={onOpenInNewWindow}
                            className="neon-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                            style={{ boxShadow: '0 0 12px oklch(0.62 0.25 295 / 0.3)' }}
                        >
                            <ExternalLink size={14} />
                            Open in New Window
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
