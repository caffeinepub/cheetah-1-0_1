import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Tab {
    id: string;
    title: string;
    url: string;
    proxyUrl: string;
    favicon?: string;
    isLoading: boolean;
    hasError: boolean;
}

const PROXY_BASE = 'https://api.allorigins.win/raw?url=';

function makeProxyUrl(url: string): string {
    if (!url) return '';
    return PROXY_BASE + encodeURIComponent(url);
}

function normalizeUrl(input: string): string {
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
        proxyUrl: url ? makeProxyUrl(normalizeUrl(url)) : '',
        isLoading: false,
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

    const openUrl = useCallback((url: string, newTab = false) => {
        const normalized = normalizeUrl(url);
        const proxyUrl = makeProxyUrl(normalized);
        const title = (() => {
            try { return new URL(normalized).hostname; } catch { return url; }
        })();

        if (newTab) {
            const tab = createNewTab(normalized, title);
            tab.proxyUrl = proxyUrl;
            tab.isLoading = true;
            setTabs(prev => ({
                tabs: [...prev.tabs, tab],
                activeTabId: tab.id,
            }));
        } else {
            setTabs(prev => ({
                ...prev,
                tabs: prev.tabs.map(t =>
                    t.id === activeTabId
                        ? { ...t, url: normalized, proxyUrl, title, isLoading: true, hasError: false }
                        : t
                ),
            }));
        }
    }, [activeTabId, setTabs]);

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

    const setTabLoading = useCallback((id: string, isLoading: boolean) => {
        setTabs(prev => ({
            ...prev,
            tabs: prev.tabs.map(t => t.id === id ? { ...t, isLoading } : t),
        }));
    }, [setTabs]);

    const setTabError = useCallback((id: string, hasError: boolean) => {
        setTabs(prev => ({
            ...prev,
            tabs: prev.tabs.map(t => t.id === id ? { ...t, hasError, isLoading: false } : t),
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
        makeProxyUrl,
        normalizeUrl,
    };
}
