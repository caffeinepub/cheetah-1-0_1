import React from 'react';
import { Gamepad2, Calculator, BookOpen, Keyboard, Code, Trophy, Atom, Pencil, Star, Zap, GraduationCap } from 'lucide-react';

interface GameSite {
    name: string;
    url: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

const gameSites: GameSite[] = [
    {
        name: 'Math Playground',
        url: 'https://www.mathplayground.com',
        description: 'Fun math games & logic puzzles',
        icon: <Calculator size={28} />,
        color: 'oklch(0.65 0.22 250)',
        bgColor: 'oklch(0.25 0.1 250 / 0.3)',
    },
    {
        name: 'Cool Math Games',
        url: 'https://www.coolmathgames.com',
        description: 'Strategy & skill games',
        icon: <Zap size={28} />,
        color: 'oklch(0.7 0.22 30)',
        bgColor: 'oklch(0.25 0.1 30 / 0.3)',
    },
    {
        name: 'Hooda Math',
        url: 'https://www.hoodamath.com',
        description: 'Math games for all grades',
        icon: <Star size={28} />,
        color: 'oklch(0.7 0.22 60)',
        bgColor: 'oklch(0.25 0.1 60 / 0.3)',
    },
    {
        name: 'ABCya',
        url: 'https://www.abcya.com',
        description: 'Educational games K-6',
        icon: <Pencil size={28} />,
        color: 'oklch(0.65 0.22 150)',
        bgColor: 'oklch(0.22 0.1 150 / 0.3)',
    },
    {
        name: 'Funbrain',
        url: 'https://www.funbrain.com',
        description: 'Games, books & videos',
        icon: <BookOpen size={28} />,
        color: 'oklch(0.65 0.22 200)',
        bgColor: 'oklch(0.22 0.1 200 / 0.3)',
    },
    {
        name: 'PBS Kids Games',
        url: 'https://pbskids.org/games',
        description: 'Games with PBS characters',
        icon: <Trophy size={28} />,
        color: 'oklch(0.65 0.22 280)',
        bgColor: 'oklch(0.22 0.1 280 / 0.3)',
    },
    {
        name: 'Typing Club',
        url: 'https://www.typingclub.com',
        description: 'Learn to type faster',
        icon: <Keyboard size={28} />,
        color: 'oklch(0.65 0.22 310)',
        bgColor: 'oklch(0.22 0.1 310 / 0.3)',
    },
    {
        name: 'Scratch',
        url: 'https://scratch.mit.edu',
        description: 'Create & share projects',
        icon: <Code size={28} />,
        color: 'oklch(0.65 0.22 30)',
        bgColor: 'oklch(0.22 0.1 30 / 0.3)',
    },
    {
        name: 'Khan Academy',
        url: 'https://www.khanacademy.org',
        description: 'Free world-class education',
        icon: <Atom size={28} />,
        color: 'oklch(0.65 0.22 150)',
        bgColor: 'oklch(0.22 0.1 150 / 0.3)',
    },
    {
        name: 'Prodigy Game',
        url: 'https://www.prodigygame.com',
        description: 'Math RPG adventure game',
        icon: <Gamepad2 size={28} />,
        color: 'oklch(0.65 0.22 295)',
        bgColor: 'oklch(0.22 0.1 295 / 0.3)',
    },
    {
        name: 'Blooket',
        url: 'https://www.blooket.com',
        description: 'Game-based learning platform',
        icon: <GraduationCap size={28} />,
        color: 'oklch(0.68 0.22 195)',
        bgColor: 'oklch(0.22 0.1 195 / 0.3)',
    },
];

interface GamesProps {
    onOpenUrl: (url: string, newTab?: boolean) => void;
}

export const Games: React.FC<GamesProps> = ({ onOpenUrl }) => {
    return (
        <div className="h-full overflow-y-auto p-6 page-enter">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-display font-bold gradient-text tracking-wider mb-1">
                        UNBLOCKED GAMES
                    </h1>
                    <p className="text-sm font-mono text-muted-foreground">
                        Educational & fun sites — click any card to open in proxy
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {gameSites.map(site => (
                        <button
                            key={site.url}
                            onClick={() => onOpenUrl(site.url, true)}
                            className="site-card glass-panel rounded-xl p-4 text-left flex flex-col gap-3 group"
                            style={{
                                border: `1px solid ${site.color.replace(')', ' / 0.25)')}`,
                            }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{
                                    background: site.bgColor,
                                    color: site.color,
                                    boxShadow: `0 0 12px ${site.color.replace(')', ' / 0.2)')}`,
                                }}
                            >
                                {site.icon}
                            </div>
                            <div>
                                <div
                                    className="font-display font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors"
                                    style={{ color: 'oklch(0.88 0.06 290)' }}
                                >
                                    {site.name}
                                </div>
                                <div className="text-xs font-mono leading-relaxed" style={{ color: 'oklch(0.55 0.06 290)' }}>
                                    {site.description}
                                </div>
                            </div>
                            <div
                                className="text-xs font-mono mt-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                style={{ color: site.color }}
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
