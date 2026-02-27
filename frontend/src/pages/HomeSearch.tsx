import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe, Search, ExternalLink } from 'lucide-react';
import type { Tab } from '../hooks/useTabs';
import { PROXY_COUNT, isTikTokUrl, isSearchEngineUrl, DIRECT_PROXY_INDEX } from '../hooks/useTabs';
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

    // Determine if the active tab is using a proxy or loading directly
    const proxyIdx = activeTab?.proxyIndex ?? 0;
    const isDirect = activeTab ? (activeTab.proxyIndex === DIRECT_PROXY_INDEX || isSearchEngineUrl(activeTab.url)) : false;
    const proxyLabels = ['google.com', 'corsproxy.io', 'cors-anywhere', 'codetabs.com', 'thingproxy'];
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

                {/* Connection indicator: Direct for search, proxy label for proxied URLs */}
                {activeTab?.proxyUrl && (
                    isDirect ? (
                        <span
                            className="hidden sm:flex items-center text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{
                                background: 'oklch(0.18 0.06 150 / 0.5)',
                                border: '1px solid oklch(0.45 0.15 150 / 0.4)',
                                color: 'oklch(0.65 0.18 150)',
                            }}
                            title="Direct connection — no proxy"
                        >
                            direct
                        </span>
                    ) : (
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
                    )
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
                    <div className="gcse-search" />
                </div>
            )}

            {/* Tab content area */}
            <div className="flex-1 relative" style={{ minHeight: 0 }}>
                {!activeTab?.proxyUrl ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 animated-bg h-full">
                        <div className="text-center animate-float">
                            <img
                                src="/assets/generated/cheetah-logo.dim_128x128.png"
                                alt="Cheetah"
                                className="w-20 h-20 mx-auto mb-4 opacity-80"
                                style={{ filter: 'drop-shadow(0 0 20px oklch(0.62 0.25 295 / 0.6))' }}
                            />
                            <h2 className="text-2xl font-display font-bold gradient-text mb-2">
                                Cheetah 1.0
                            </h2>
                            <p className="text-sm font-mono text-muted-foreground">
                                Enter a URL or search to get started
                            </p>
                        </div>
                        <div className="flex gap-3 text-xs font-mono text-muted-foreground">
                            <span className="glass-panel px-3 py-1.5 rounded-full">Ctrl+T New Tab</span>
                            <span className="glass-panel px-3 py-1.5 rounded-full">Ctrl+W Close</span>
                            <span className="glass-panel px-3 py-1.5 rounded-full">Ctrl+L Address Bar</span>
                        </div>
                    </div>
                ) : activeTab?.hasError ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 animated-bg h-full">
                        <div className="glass-panel rounded-xl p-8 max-w-md text-center">
                            <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'oklch(0.85 0.1 295)' }}>
                                Unable to Load Page
                            </h3>
                            <p className="text-sm font-mono text-muted-foreground mb-2">
                                All proxy routes were tried. This site may block embedding.
                            </p>
                            <p className="text-xs font-mono mb-5" style={{ color: 'oklch(0.5 0.08 295)' }}>
                                Tried {PROXY_COUNT} proxy servers
                            </p>
                            <div className="flex gap-3 justify-center flex-wrap">
                                <button
                                    onClick={handleTryAgain}
                                    className="neon-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                                    style={{ boxShadow: '0 0 12px oklch(0.62 0.25 295 / 0.3)' }}
                                >
                                    <RotateCw size={14} />
                                    Try Again
                                </button>
                                <button
                                    onClick={handleOpenInNewWindow}
                                    className="neon-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                                    style={{ boxShadow: '0 0 12px oklch(0.62 0.25 295 / 0.3)' }}
                                >
                                    <ExternalLink size={14} />
                                    Open in New Window
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <iframe
                        ref={iframeRef}
                        src={activeTab?.proxyUrl}
                        className="w-full h-full border-0"
                        title={activeTab?.title}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                        style={{ display: 'block' }}
                    />
                )}
            </div>
        </div>
    );
};

// Suppress unused import warnings
void isTikTokUrl;
void PROXY_COUNT;
