import React from 'react';
import { Zap } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header
            className="flex items-center gap-3 px-4 py-2 flex-shrink-0"
            style={{
                background: 'oklch(0.13 0.04 290 / 0.95)',
                borderBottom: '1px solid oklch(0.4 0.15 295 / 0.3)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 2px 20px oklch(0.62 0.25 295 / 0.15)',
            }}
        >
            <div className="flex items-center gap-2.5">
                <div className="relative">
                    <img
                        src="/assets/generated/cheetah-logo.dim_128x128.png"
                        alt="Cheetah"
                        className="w-8 h-8"
                        style={{ filter: 'drop-shadow(0 0 8px oklch(0.7 0.28 295 / 0.8))' }}
                    />
                </div>
                <div className="flex items-baseline gap-1.5">
                    <span
                        className="text-lg font-display font-bold tracking-wider gradient-text"
                        style={{ letterSpacing: '0.08em' }}
                    >
                        CHEETAH
                    </span>
                    <span
                        className="text-xs font-mono font-semibold"
                        style={{ color: 'oklch(0.6 0.18 310)', letterSpacing: '0.1em' }}
                    >
                        1.0
                    </span>
                </div>
            </div>

            <div
                className="h-5 w-px mx-1"
                style={{ background: 'oklch(0.4 0.12 295 / 0.4)' }}
            />

            <div className="flex items-center gap-1.5">
                <Zap size={12} style={{ color: 'oklch(0.7 0.25 295)' }} />
                <span className="text-xs font-mono" style={{ color: 'oklch(0.55 0.1 295)' }}>
                    PROXY BROWSER
                </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
                    style={{
                        background: 'oklch(0.25 0.1 295 / 0.4)',
                        border: '1px solid oklch(0.5 0.18 295 / 0.3)',
                        color: 'oklch(0.7 0.15 295)',
                    }}
                >
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            background: 'oklch(0.7 0.25 150)',
                            boxShadow: '0 0 6px oklch(0.7 0.25 150 / 0.8)',
                            animation: 'pulse-glow 2s ease-in-out infinite',
                        }}
                    />
                    SECURE
                </div>
            </div>
        </header>
    );
};
