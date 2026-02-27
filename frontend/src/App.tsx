import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, type PageId } from './components/layout/Navigation';
import { TabBar } from './components/tabs/TabBar';
import { HomeSearch } from './pages/HomeSearch';
import { Games } from './pages/Games';
import { AIAssistant } from './pages/AIAssistant';
import { CodeEditorPage } from './pages/CodeEditorPage';
import { QuickOpen } from './pages/QuickOpen';
import { useTabs } from './hooks/useTabs';

export default function App() {
    const [activePage, setActivePage] = useState<PageId>('home');
    const addressBarRef = useRef<HTMLInputElement | null>(null);

    // Panic mode state
    const [panicActive, setPanicActive] = useState(false);
    const [panicCountdown, setPanicCountdown] = useState(60);
    const panicTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const panicCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const {
        tabs,
        activeTabId,
        activeTab,
        openUrl,
        addTab,
        closeTab,
        switchTab,
        setTabLoading,
        setTabError,
    } = useTabs(addressBarRef);

    const activatePanic = useCallback(() => {
        if (panicActive) return;
        setPanicActive(true);
        setPanicCountdown(60);

        // Clear any existing timers
        if (panicTimerRef.current) clearTimeout(panicTimerRef.current);
        if (panicCountdownRef.current) clearInterval(panicCountdownRef.current);

        // Countdown display
        let remaining = 60;
        panicCountdownRef.current = setInterval(() => {
            remaining -= 1;
            setPanicCountdown(remaining);
            if (remaining <= 0) {
                if (panicCountdownRef.current) clearInterval(panicCountdownRef.current);
            }
        }, 1000);

        // Auto-dismiss after 60 seconds
        panicTimerRef.current = setTimeout(() => {
            setPanicActive(false);
            setPanicCountdown(60);
            if (panicCountdownRef.current) clearInterval(panicCountdownRef.current);
        }, 60000);
    }, [panicActive]);

    // Global keyboard shortcut for panic: Cmd/Ctrl + P or Cmd/Ctrl + B
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isMeta = e.metaKey || e.ctrlKey;
            if (isMeta && (e.key === 'p' || e.key === 'P' || e.key === 'b' || e.key === 'B')) {
                e.preventDefault();
                e.stopPropagation();
                activatePanic();
            }
        };
        window.addEventListener('keydown', handler, true);
        return () => window.removeEventListener('keydown', handler, true);
    }, [activatePanic]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (panicTimerRef.current) clearTimeout(panicTimerRef.current);
            if (panicCountdownRef.current) clearInterval(panicCountdownRef.current);
        };
    }, []);

    const handleOpenUrl = (url: string, newTab = false) => {
        openUrl(url, newTab);
        setActivePage('home');
    };

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden animated-bg">
            {/* App Header */}
            <Header onPanic={activatePanic} />

            {/* Tab Bar */}
            <TabBar
                tabs={tabs}
                activeTabId={activeTabId}
                onSwitch={switchTab}
                onClose={closeTab}
                onAdd={addTab}
            />

            {/* Main Layout */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Sidebar Navigation */}
                <Navigation activePage={activePage} onNavigate={setActivePage} />

                {/* Page Content */}
                <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
                    {activePage === 'home' && (
                        <HomeSearch
                            activeTab={activeTab}
                            onOpenUrl={handleOpenUrl}
                            addressBarRef={addressBarRef}
                        />
                    )}
                    {activePage === 'games' && (
                        <Games onOpenUrl={handleOpenUrl} />
                    )}
                    {activePage === 'ai' && (
                        <AIAssistant />
                    )}
                    {activePage === 'code' && (
                        <CodeEditorPage />
                    )}
                    {activePage === 'quickopen' && (
                        <QuickOpen onOpenUrl={handleOpenUrl} />
                    )}
                </main>
            </div>

            {/* Panic Overlay — full-viewport white screen, cannot be dismissed */}
            {panicActive && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'all',
                        userSelect: 'none',
                    }}
                    onContextMenu={e => e.preventDefault()}
                >
                    {/* Invisible — pure white screen, no text visible */}
                </div>
            )}
        </div>
    );
}
