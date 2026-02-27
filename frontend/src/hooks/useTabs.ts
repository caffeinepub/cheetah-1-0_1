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
}

// Ordered list of proxy strategies
const PROXY_LIST = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
    (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
];

export const PROXY_COUNT = PROXY_LIST.length;

export function makeProxyUrl(url: string, proxyIndex = 0): string {
    if (!url) return '';
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
    return {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        title,
        url,
        proxyUrl: url ? makeProxyUrl(normalizeUrl(url), 0) : '',
        proxyIndex: 0,
        hasError: false,
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
        const proxy = makeProxyUrl(normalized, proxyIndex);
        const title = (() => {
            try { return new URL(normalized).hostname; } catch { return url; }
        })();

        if (newTab) {
            const tab = createNewTab(normalized, title);
            tab.proxyUrl = proxy;
            tab.proxyIndex = proxyIndex;
            setTabs(prev => ({
                tabs: [...prev.tabs, tab],
                activeTabId: tab.id,
            }));
        } else {
            setTabs(prev => ({
                ...prev,
                tabs: prev.tabs.map(t =>
                    t.id === activeTabId
                        ? { ...t, url: normalized, proxyUrl: proxy, proxyIndex, title, hasError: false }
                        : t
                ),
            }));
        }
    }, [activeTabId, setTabs]);

    const retryWithNextProxy = useCallback((id: string) => {
        setTabs(prev => {
            const tab = prev.tabs.find(t => t.id === id);
            if (!tab) return prev;
            const nextIndex = tab.proxyIndex + 1;
            if (nextIndex >= PROXY_COUNT) {
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
        makeProxyUrl,
        normalizeUrl,
    };
}
