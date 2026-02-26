import React, { useState, useRef } from 'react';
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

    const handleOpenUrl = (url: string, newTab = false) => {
        // When opening a URL from any page, switch to home to show the proxy
        openUrl(url, newTab);
        setActivePage('home');
    };

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden animated-bg">
            {/* App Header */}
            <Header />

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

            {/* Footer */}
            <footer
                className="flex-shrink-0 flex items-center justify-center px-4 py-1.5 text-xs font-mono"
                style={{
                    background: 'oklch(0.12 0.03 290 / 0.95)',
                    borderTop: '1px solid oklch(0.3 0.08 295 / 0.3)',
                    color: 'oklch(0.4 0.08 295)',
                }}
            >
                <span>
                    © {new Date().getFullYear()} Cheetah 1.0 · Built with{' '}
                    <span style={{ color: 'oklch(0.65 0.22 0)' }}>♥</span>{' '}
                    using{' '}
                    <a
                        href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'cheetah-proxy')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors"
                        style={{ color: 'oklch(0.62 0.18 295)' }}
                        onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = 'oklch(0.75 0.25 295)')}
                        onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = 'oklch(0.62 0.18 295)')}
                    >
                        caffeine.ai
                    </a>
                </span>
            </footer>
        </div>
    );
}
