import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Tab {
    id: string;
    title: string;
    url: string;
    proxyUrl: string;
    proxyIndex: number;
    favicon?: string;
    hasError: boolean;
    isTikTokEmbed?: boolean;
}

// Ordered list of proxy strategies
const PROXY_LIST = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
    (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

export const PROXY_COUNT = PROXY_LIST.length;

// Sentinel value indicating no proxy is used (direct navigation)
export const DIRECT_PROXY_INDEX = -1;

// TikTok embed URL used as a final fallback before showing error
const TIKTOK_EMBED_URL = 'https://www.tiktok.com/embed/';

export function isTikTokUrl(url: string): boolean {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        return hostname === 'tiktok.com';
    } catch {
        return url.includes('tiktok.com');
    }
}

/**
 * Returns true if the URL is a search engine results page that should
 * be loaded directly without any proxy wrapping.
 */
export function isSearchEngineUrl(url: string): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.replace('www.', '');
        // Google search
        if (hostname === 'google.com' && parsed.pathname.startsWith('/search')) return true;
        // Bing search
        if (hostname === 'bing.com' && parsed.pathname.startsWith('/search')) return true;
        // DuckDuckGo search
        if (hostname === 'duckduckgo.com' && (parsed.pathname === '/' || parsed.pathname === '')) return true;
        // Yahoo search
        if (hostname === 'search.yahoo.com') return true;
        return false;
    } catch {
        return false;
    }
}

export function makeProxyUrl(url: string, proxyIndex = 0): string {
    if (!url) return '';
    // Search engine URLs bypass the proxy and load directly
    if (isSearchEngineUrl(url)) return url;
    const idx = Math.min(proxyIndex, PROXY_LIST.length - 1);
    return PROXY_LIST[idx](url);
}

export function normalizeUrl(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.includes('.') && !trimmed.includes(' ')) return 'https://' + trimmed;
    return 'https://www.google.com/search?q=' + encodeURIComponent(trimmed);
}

function createNewTab(url = '', title = 'New Tab'): Tab {
    const normalized = url ? normalizeUrl(url) : '';
    const isDirect = normalized ? isSearchEngineUrl(normalized) : false;
    return {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        title,
        url: normalized,
        proxyUrl: normalized ? makeProxyUrl(normalized, 0) : '',
        proxyIndex: isDirect ? DIRECT_PROXY_INDEX : 0,
        hasError: false,
        isTikTokEmbed: false,
    };
}

interface TabsState {
    tabs: Tab[];
    activeTabId: string | null;
}

export function useTabs(addressBarRef?: React.RefObject<HTMLInputElement | null>) {
    const [state, setState] = useLocalStorage<TabsState>('cheetah-tabs', {
        tabs: [createNewTab()],
        activeTabId: null,
    });

    // Fix: ensure activeTabId is valid on init
    const tabs = state.tabs.length > 0 ? state.tabs : [createNewTab()];
    const activeTabId = state.activeTabId && tabs.find(t => t.id === state.activeTabId)
        ? state.activeTabId
        : tabs[0]?.id ?? null;

    const setTabs = useCallback((updater: (prev: TabsState) => TabsState) => {
        setState(prev => updater(prev));
    }, [setState]);

    const openUrl = useCallback((url: string, newTab = false, proxyIndex = 0) => {
        const normalized = normalizeUrl(url);
        const isDirect = isSearchEngineUrl(normalized);
        // Direct search engine URLs bypass proxy entirely
        const proxy = isDirect ? normalized : makeProxyUrl(normalized, proxyIndex);
        const effectiveProxyIndex = isDirect ? DIRECT_PROXY_INDEX : proxyIndex;
        const title = (() => {
            try { return new URL(normalized).hostname; } catch { return url; }
        })();

        if (newTab) {
            const tab = createNewTab(normalized, title);
            tab.proxyUrl = proxy;
            tab.proxyIndex = effectiveProxyIndex;
            setTabs(prev => ({
                tabs: [...prev.tabs, tab],
                activeTabId: tab.id,
            }));
        } else {
            setTabs(prev => ({
                ...prev,
                tabs: prev.tabs.map(t =>
                    t.id === activeTabId
                        ? { ...t, url: normalized, proxyUrl: proxy, proxyIndex: effectiveProxyIndex, title, hasError: false, isTikTokEmbed: false }
                        : t
                ),
            }));
        }
    }, [activeTabId, setTabs]);

    /**
     * Re-initiate the full proxy chain from the beginning for a given tab.
     * Resets proxyIndex to 0 and clears error state.
     * For search engine URLs, resets to direct navigation (no proxy).
     */
    const navigateToUrl = useCallback((id: string, url?: string) => {
        setTabs(prev => {
            const tab = prev.tabs.find(t => t.id === id);
            if (!tab) return prev;
            const targetUrl = url ?? tab.url;
            const isDirect = isSearchEngineUrl(targetUrl);
            const newProxyUrl = isDirect ? targetUrl : makeProxyUrl(targetUrl, 0);
            const newProxyIndex = isDirect ? DIRECT_PROXY_INDEX : 0;
            return {
                ...prev,
                tabs: prev.tabs.map(t =>
                    t.id === id
                        ? { ...t, url: targetUrl, proxyUrl: newProxyUrl, proxyIndex: newProxyIndex, hasError: false, isTikTokEmbed: false }
                        : t
                ),
            };
        });
    }, [setTabs]);

    const retryWithNextProxy = useCallback((id: string) => {
        setTabs(prev => {
            const tab = prev.tabs.find(t => t.id === id);
            if (!tab) return prev;

            // Search engine URLs never use proxy — skip retry logic
            if (isSearchEngineUrl(tab.url)) {
                return {
                    ...prev,
                    tabs: prev.tabs.map(t =>
                        t.id === id ? { ...t, hasError: true } : t
                    ),
                };
            }

            const nextIndex = tab.proxyIndex + 1;

            if (nextIndex >= PROXY_COUNT) {
                // All standard proxies exhausted — try TikTok embed as final fallback
                if (isTikTokUrl(tab.url) && !tab.isTikTokEmbed) {
                    return {
                        ...prev,
                        tabs: prev.tabs.map(t =>
                            t.id === id
                                ? { ...t, proxyUrl: TIKTOK_EMBED_URL, proxyIndex: nextIndex, hasError: false, isTikTokEmbed: true }
                                : t
                        ),
                    };
                }
                // All proxies exhausted — show error
                return {
                    ...prev,
                    tabs: prev.tabs.map(t =>
                        t.id === id ? { ...t, hasError: true } : t
                    ),
                };
            }

            const newProxyUrl = makeProxyUrl(tab.url, nextIndex);
            return {
                ...prev,
                tabs: prev.tabs.map(t =>
                    t.id === id
                        ? { ...t, proxyUrl: newProxyUrl, proxyIndex: nextIndex, hasError: false }
                        : t
                ),
            };
        });
    }, [setTabs]);

    const addTab = useCallback(() => {
        const tab = createNewTab();
        setTabs(prev => ({
            tabs: [...prev.tabs, tab],
            activeTabId: tab.id,
        }));
    }, [setTabs]);

    const closeTab = useCallback((id: string) => {
        setTabs(prev => {
            const idx = prev.tabs.findIndex(t => t.id === id);
            const newTabs = prev.tabs.filter(t => t.id !== id);
            if (newTabs.length === 0) {
                const fresh = createNewTab();
                return { tabs: [fresh], activeTabId: fresh.id };
            }
            let newActive = prev.activeTabId;
            if (prev.activeTabId === id) {
                newActive = newTabs[Math.max(0, idx - 1)]?.id ?? newTabs[0]?.id ?? null;
            }
            return { tabs: newTabs, activeTabId: newActive };
        });
    }, [setTabs]);

    const switchTab = useCallback((id: string) => {
        setTabs(prev => ({ ...prev, activeTabId: id }));
    }, [setTabs]);

    const setTabLoading = useCallback((_id: string, _isLoading: boolean) => {
        // No-op: loading state removed
    }, []);

    const setTabError = useCallback((id: string, hasError: boolean) => {
        setTabs(prev => ({
            ...prev,
            tabs: prev.tabs.map(t => t.id === id ? { ...t, hasError } : t),
        }));
    }, [setTabs]);

    const setTabTitle = useCallback((id: string, title: string) => {
        setTabs(prev => ({
            ...prev,
            tabs: prev.tabs.map(t => t.id === id ? { ...t, title } : t),
        }));
    }, [setTabs]);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                addTab();
            } else if (e.ctrlKey && e.key === 'w') {
                e.preventDefault();
                if (activeTabId) closeTab(activeTabId);
            } else if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                addressBarRef?.current?.focus();
                addressBarRef?.current?.select();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [addTab, closeTab, activeTabId, addressBarRef]);

    const activeTab = tabs.find(t => t.id === activeTabId) ?? null;

    return {
        tabs,
        activeTabId,
        activeTab,
        openUrl,
        addTab,
        closeTab,
        switchTab,
        setTabLoading,
        setTabError,
        setTabTitle,
        retryWithNextProxy,
        navigateToUrl,
        makeProxyUrl,
        normalizeUrl,
    };
}
