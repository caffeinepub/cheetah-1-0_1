import React from 'react';
import { SiTiktok, SiYoutube, SiWikipedia, SiOpenai, SiGoogle } from 'react-icons/si';
import { Tv } from 'lucide-react';

interface QuickSite {
    name: string;
    url: string;
    description: string;
    icon: React.ReactNode;
    accentColor: string;
    bgGradient: string;
}

// Custom Disney+ icon since SiDisneyplus doesn't exist in this version of react-icons
const DisneyPlusIcon: React.FC<{ size?: number }> = ({ size = 36 }) => (
    <div
        style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Georgia, serif',
            fontWeight: 900,
            fontSize: size * 0.45,
            letterSpacing: '-0.05em',
            lineHeight: 1,
        }}
    >
        D+
    </div>
);

const quickSites: QuickSite[] = [
    {
        name: 'TikTok',
        url: 'https://www.tiktok.com',
        description: 'Short-form video platform',
        icon: <SiTiktok size={36} />,
        accentColor: 'oklch(0.75 0.05 200)',
        bgGradient: 'linear-gradient(135deg, oklch(0.18 0.04 200 / 0.5), oklch(0.22 0.06 340 / 0.4))',
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com',
        description: 'Watch & share videos',
        icon: <SiYoutube size={36} />,
        accentColor: 'oklch(0.6 0.22 25)',
        bgGradient: 'linear-gradient(135deg, oklch(0.2 0.08 25 / 0.5), oklch(0.18 0.04 25 / 0.3))',
    },
    {
        name: 'Wikipedia',
        url: 'https://www.wikipedia.org',
        description: 'Free encyclopedia',
        icon: <SiWikipedia size={36} />,
        accentColor: 'oklch(0.85 0.02 290)',
        bgGradient: 'linear-gradient(135deg, oklch(0.22 0.03 290 / 0.5), oklch(0.18 0.02 290 / 0.3))',
    },
    {
        name: 'Disney+',
        url: 'https://www.disneyplus.com',
        description: 'Stream Disney, Marvel & more',
        icon: <DisneyPlusIcon size={36} />,
        accentColor: 'oklch(0.6 0.2 250)',
        bgGradient: 'linear-gradient(135deg, oklch(0.2 0.08 250 / 0.5), oklch(0.18 0.05 250 / 0.3))',
    },
    {
        name: 'ChatGPT',
        url: 'https://chat.openai.com',
        description: 'AI-powered chat assistant',
        icon: <SiOpenai size={36} />,
        accentColor: 'oklch(0.75 0.15 160)',
        bgGradient: 'linear-gradient(135deg, oklch(0.2 0.06 160 / 0.5), oklch(0.18 0.04 160 / 0.3))',
    },
    {
        name: 'Google Gemini',
        url: 'https://gemini.google.com',
        description: "Google's AI assistant",
        icon: <SiGoogle size={36} />,
        accentColor: 'oklch(0.65 0.2 250)',
        bgGradient: 'linear-gradient(135deg, oklch(0.2 0.08 250 / 0.4), oklch(0.2 0.08 150 / 0.3))',
    },
];

interface QuickOpenProps {
    onOpenUrl: (url: string, newTab?: boolean) => void;
}

export const QuickOpen: React.FC<QuickOpenProps> = ({ onOpenUrl }) => {
    return (
        <div className="h-full overflow-y-auto p-6 page-enter">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-display font-bold gradient-text tracking-wider mb-1">
                        QUICK OPEN
                    </h1>
                    <p className="text-sm font-mono text-muted-foreground">
                        One-click access to popular sites — opens in proxy
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {quickSites.map(site => (
                        <button
                            key={site.url}
                            onClick={() => onOpenUrl(site.url, true)}
                            className="site-card glass-panel rounded-2xl p-6 text-left flex flex-col gap-4 group relative overflow-hidden"
                            style={{
                                border: `1px solid ${site.accentColor.replace(')', ' / 0.25)')}`,
                                background: site.bgGradient,
                            }}
                        >
                            {/* Glow orb */}
                            <div
                                className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"
                                style={{
                                    background: site.accentColor,
                                    filter: 'blur(20px)',
                                }}
                            />

                            {/* Icon */}
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                                style={{
                                    background: `${site.accentColor.replace(')', ' / 0.15)')}`,
                                    color: site.accentColor,
                                    border: `1px solid ${site.accentColor.replace(')', ' / 0.3)')}`,
                                    boxShadow: `0 0 20px ${site.accentColor.replace(')', ' / 0.2)')}`,
                                    transition: 'box-shadow 0.25s ease',
                                }}
                            >
                                {site.icon}
                            </div>

                            {/* Text */}
                            <div className="relative z-10">
                                <div
                                    className="font-display font-bold text-lg mb-1 tracking-wide"
                                    style={{ color: 'oklch(0.92 0.06 290)' }}
                                >
                                    {site.name}
                                </div>
                                <div
                                    className="text-xs font-mono leading-relaxed"
                                    style={{ color: 'oklch(0.58 0.06 290)' }}
                                >
                                    {site.description}
                                </div>
                            </div>

                            {/* Hover CTA */}
                            <div
                                className="relative z-10 text-xs font-mono opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 mt-auto"
                                style={{ color: site.accentColor }}
                            >
                                Open in proxy →
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
