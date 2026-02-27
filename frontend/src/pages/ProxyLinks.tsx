import React from 'react';
import { Globe, ExternalLink, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProxyService {
    name: string;
    url: string;
    displayUrl: string;
    description: string;
    isPrimary?: boolean;
    isActive?: boolean;
}

const PROXY_SERVICES: ProxyService[] = [
    {
        name: 'ProxySite',
        url: 'https://www.proxysite.com',
        displayUrl: 'proxysite.com',
        description: 'Classic web proxy for bypassing restrictions and browsing anonymously.',
    },
    {
        name: 'ProxyOrb',
        url: 'https://proxyorb.com',
        displayUrl: 'proxyorb.com',
        description: 'Fast and reliable proxy service for secure web access.',
    },
    {
        name: 'ProxyProxy',
        url: 'https://proxyproxy.net/?__cpo=aHR0cHM6Ly9jaGVldGFoMTItNGV2LmNhZmZlaW5lLnh5eg#caffeineAdminToken=4e5885a0f3111a08883c7259d557d207cdc0e8c8ef2349289317f3bbf1bb43b2',
        displayUrl: 'proxyproxy.net',
        description: 'Our primary proxy — pre-configured and ready to use. Most reliable for daily browsing.',
        isPrimary: true,
        isActive: true,
    },
];

interface ProxyLinksProps {
    onOpenUrl: (url: string, newTab?: boolean) => void;
}

export const ProxyLinks: React.FC<ProxyLinksProps> = ({ onOpenUrl }) => {
    const handleLaunch = (service: ProxyService) => {
        onOpenUrl(service.url, false);
    };

    return (
        <div
            className="flex-1 flex flex-col min-h-0 overflow-auto p-6"
            style={{ background: 'oklch(0.11 0.025 290)' }}
        >
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="p-2 rounded-lg"
                        style={{ background: 'oklch(0.25 0.12 295 / 0.4)', border: '1px solid oklch(0.45 0.18 295 / 0.4)' }}
                    >
                        <Globe size={22} style={{ color: 'oklch(0.75 0.18 295)' }} />
                    </div>
                    <h1
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: 'oklch(0.92 0.06 295)' }}
                    >
                        Proxy Services
                    </h1>
                </div>
                <p className="text-sm ml-1" style={{ color: 'oklch(0.55 0.08 295)' }}>
                    Quick access to all proxy services. Click Launch to open in the browser.
                </p>
            </div>

            {/* Proxy Cards */}
            <div className="flex flex-col gap-4 max-w-2xl">
                {PROXY_SERVICES.map((service, index) => (
                    <div
                        key={service.name}
                        className="relative rounded-xl p-5 transition-all duration-200"
                        style={{
                            background: service.isPrimary
                                ? 'oklch(0.18 0.08 295 / 0.7)'
                                : 'oklch(0.15 0.04 290 / 0.7)',
                            border: service.isPrimary
                                ? '1px solid oklch(0.55 0.22 295 / 0.6)'
                                : '1px solid oklch(0.3 0.08 295 / 0.3)',
                            boxShadow: service.isPrimary
                                ? '0 0 24px oklch(0.55 0.22 295 / 0.15), inset 0 1px 0 oklch(0.7 0.15 295 / 0.1)'
                                : 'none',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {/* Primary glow accent */}
                        {service.isPrimary && (
                            <div
                                className="absolute inset-0 rounded-xl pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse at top left, oklch(0.55 0.22 295 / 0.08) 0%, transparent 60%)',
                                }}
                            />
                        )}

                        <div className="flex items-start justify-between gap-4">
                            {/* Left: Info */}
                            <div className="flex items-start gap-3 min-w-0">
                                {/* Number badge */}
                                <div
                                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono mt-0.5"
                                    style={{
                                        background: service.isPrimary
                                            ? 'oklch(0.55 0.22 295 / 0.3)'
                                            : 'oklch(0.25 0.06 290 / 0.5)',
                                        color: service.isPrimary
                                            ? 'oklch(0.85 0.18 295)'
                                            : 'oklch(0.55 0.08 295)',
                                        border: service.isPrimary
                                            ? '1px solid oklch(0.55 0.22 295 / 0.5)'
                                            : '1px solid oklch(0.35 0.08 295 / 0.3)',
                                    }}
                                >
                                    {index + 1}
                                </div>

                                <div className="min-w-0">
                                    {/* Name + badges */}
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span
                                            className="font-semibold text-base"
                                            style={{ color: service.isPrimary ? 'oklch(0.92 0.12 295)' : 'oklch(0.82 0.06 295)' }}
                                        >
                                            {service.name}
                                        </span>
                                        {service.isPrimary && (
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                                                style={{
                                                    background: 'oklch(0.55 0.22 295 / 0.25)',
                                                    color: 'oklch(0.85 0.2 295)',
                                                    border: '1px solid oklch(0.55 0.22 295 / 0.5)',
                                                }}
                                            >
                                                <Star size={10} fill="currentColor" />
                                                Primary
                                            </span>
                                        )}
                                        {service.isActive && (
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                                                style={{
                                                    background: 'oklch(0.45 0.18 145 / 0.2)',
                                                    color: 'oklch(0.75 0.18 145)',
                                                    border: '1px solid oklch(0.55 0.18 145 / 0.4)',
                                                }}
                                            >
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ background: 'oklch(0.75 0.18 145)', boxShadow: '0 0 4px oklch(0.75 0.18 145)' }}
                                                />
                                                In Use
                                            </span>
                                        )}
                                    </div>

                                    {/* URL */}
                                    <div
                                        className="text-xs font-mono mb-2 truncate"
                                        style={{ color: 'oklch(0.5 0.1 295)' }}
                                    >
                                        {service.displayUrl}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.6 0.06 295)' }}>
                                        {service.description}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Launch button */}
                            <div className="shrink-0">
                                <button
                                    onClick={() => handleLaunch(service)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95"
                                    style={
                                        service.isPrimary
                                            ? {
                                                background: 'oklch(0.55 0.22 295 / 0.3)',
                                                color: 'oklch(0.9 0.15 295)',
                                                border: '1px solid oklch(0.55 0.22 295 / 0.6)',
                                                boxShadow: '0 0 12px oklch(0.55 0.22 295 / 0.2)',
                                            }
                                            : {
                                                background: 'oklch(0.22 0.06 290 / 0.6)',
                                                color: 'oklch(0.72 0.1 295)',
                                                border: '1px solid oklch(0.38 0.1 295 / 0.4)',
                                            }
                                    }
                                >
                                    <ExternalLink size={14} />
                                    Launch
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer tip */}
            <div
                className="mt-8 flex items-center gap-2 text-xs max-w-2xl"
                style={{ color: 'oklch(0.42 0.07 295)' }}
            >
                <Zap size={12} />
                <span>Launching a proxy opens it in the current browser tab. Use Ctrl+T to open in a new tab first.</span>
            </div>
        </div>
    );
};
