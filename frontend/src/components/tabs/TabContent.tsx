import React, { useRef } from 'react';
import { AlertTriangle, ExternalLink, RefreshCw, RotateCw } from 'lucide-react';
import type { Tab } from '../../hooks/useTabs';
import { PROXY_COUNT, isTikTokUrl } from '../../hooks/useTabs';

interface TabContentProps {
    tab: Tab;
    isActive: boolean;
    onLoad: (id: string) => void;
    onError: (id: string) => void;
    onRetry?: (id: string) => void;
    onNavigateToUrl?: (id: string, url?: string) => void;
}

export const TabContent: React.FC<TabContentProps> = ({ tab, isActive, onLoad, onError, onRetry, onNavigateToUrl }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleLoad = () => {
        onLoad(tab.id);
    };

    const handleError = () => {
        if (onRetry && tab.proxyIndex < PROXY_COUNT - 1) {
            onRetry(tab.id);
        } else {
            onError(tab.id);
        }
    };

    const handleTryAgain = () => {
        if (onNavigateToUrl) {
            onNavigateToUrl(tab.id);
        } else if (onRetry) {
            onRetry(tab.id);
        }
    };

    const handleOpenInNewWindow = () => {
        window.open(tab.url, '_blank', 'noopener,noreferrer');
    };

    if (!isActive) return null;

    if (!tab.proxyUrl) {
        return (
            <div
                className="flex-1 flex flex-col items-center justify-center gap-6 animated-bg"
                style={{ minHeight: 0 }}
            >
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
        );
    }

    if (tab.hasError) {
        const isTikTok = isTikTokUrl(tab.url);

        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 animated-bg" style={{ minHeight: 0 }}>
                <div className="glass-panel rounded-xl p-8 max-w-md text-center">
                    <AlertTriangle size={40} className="mx-auto mb-4" style={{ color: 'oklch(0.65 0.22 25)' }} />
                    <h3 className="text-lg font-display font-bold mb-2" style={{ color: 'oklch(0.85 0.1 295)' }}>
                        Unable to Load Page
                    </h3>
                    {isTikTok ? (
                        <>
                            <p className="text-sm font-mono text-muted-foreground mb-2">
                                TikTok blocks embedding via X-Frame-Options headers.
                            </p>
                            <p className="text-xs font-mono mb-5" style={{ color: 'oklch(0.5 0.08 295)' }}>
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
                            <p className="text-xs font-mono mb-5" style={{ color: 'oklch(0.5 0.08 295)' }}>
                                Tried {PROXY_COUNT} proxy servers
                            </p>
                        </>
                    )}
                    <div className="flex gap-3 justify-center flex-wrap">
                        <button
                            onClick={handleTryAgain}
                            className="neon-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                            style={{
                                boxShadow: '0 0 12px oklch(0.62 0.25 295 / 0.3)',
                            }}
                        >
                            <RotateCw size={14} />
                            Try Again
                        </button>
                        <button
                            onClick={handleOpenInNewWindow}
                            className="neon-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                            style={{
                                boxShadow: '0 0 12px oklch(0.62 0.25 295 / 0.3)',
                            }}
                        >
                            <ExternalLink size={14} />
                            Open in New Window
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
            <iframe
                ref={iframeRef}
                src={tab.proxyUrl}
                className="w-full h-full border-0"
                onLoad={handleLoad}
                onError={handleError}
                title={tab.title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                style={{ display: 'block' }}
            />
        </div>
    );
};
