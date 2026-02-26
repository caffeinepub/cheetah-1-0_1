import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface Slide {
    id: string;
    title: string;
    body: string;
    bgColor: string;
    textColor: string;
}

const STORAGE_KEY = 'cheetah-presentation';

const DEFAULT_SLIDES: Slide[] = [
    {
        id: '1',
        title: 'Welcome to Cheetah Presentations',
        body: 'Create beautiful slides with ease.\nClick to edit this slide.',
        bgColor: '#1a0a2e',
        textColor: '#c084fc',
    },
    {
        id: '2',
        title: 'Add Your Content',
        body: 'Use the editor on the left to customize each slide.\nAdd text, change colors, and more.',
        bgColor: '#0f172a',
        textColor: '#818cf8',
    },
];

function loadSlides(): Slide[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_SLIDES;
    } catch {
        return DEFAULT_SLIDES;
    }
}

export const PresentationBuilderTab: React.FC = () => {
    const [slides, setSlides] = useState<Slide[]>(loadSlides);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isPresenting, setIsPresenting] = useState(false);
    const [presentIdx, setPresentIdx] = useState(0);
    const presentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    }, [slides]);

    const activeSlide = slides[activeIdx] ?? slides[0];

    const addSlide = () => {
        const newSlide: Slide = {
            id: Date.now().toString(),
            title: 'New Slide',
            body: 'Add your content here.',
            bgColor: '#1a0a2e',
            textColor: '#c084fc',
        };
        const newSlides = [...slides, newSlide];
        setSlides(newSlides);
        setActiveIdx(newSlides.length - 1);
    };

    const deleteSlide = (idx: number) => {
        if (slides.length <= 1) return;
        const newSlides = slides.filter((_, i) => i !== idx);
        setSlides(newSlides);
        setActiveIdx(Math.min(activeIdx, newSlides.length - 1));
    };

    const updateSlide = (field: keyof Slide, value: string) => {
        setSlides(prev => prev.map((s, i) => i === activeIdx ? { ...s, [field]: value } : s));
    };

    const startPresent = () => {
        setPresentIdx(activeIdx);
        setIsPresenting(true);
        setTimeout(() => {
            presentRef.current?.requestFullscreen?.().catch(() => {});
        }, 100);
    };

    const stopPresent = () => {
        setIsPresenting(false);
        if (document.fullscreenElement) document.exitFullscreen?.();
    };

    useEffect(() => {
        if (!isPresenting) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                setPresentIdx(i => Math.min(i + 1, slides.length - 1));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                setPresentIdx(i => Math.max(i - 1, 0));
            } else if (e.key === 'Escape') {
                stopPresent();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isPresenting, slides.length]);

    return (
        <div className="flex h-full min-h-0">
            {/* Slide List */}
            <div
                className="w-48 flex flex-col flex-shrink-0 overflow-y-auto"
                style={{
                    background: 'oklch(0.13 0.03 290 / 0.9)',
                    borderRight: '1px solid oklch(0.3 0.08 295 / 0.3)',
                }}
            >
                <div className="p-2 flex-shrink-0">
                    <button
                        onClick={addSlide}
                        className="neon-btn w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs"
                    >
                        <Plus size={12} />
                        Add Slide
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                    {slides.map((slide, idx) => (
                        <div
                            key={slide.id}
                            className={`slide-preview cursor-pointer relative group ${idx === activeIdx ? 'active-slide' : ''}`}
                            onClick={() => setActiveIdx(idx)}
                        >
                            <div
                                className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
                                style={{ background: slide.bgColor, color: slide.textColor, minHeight: '70px' }}
                            >
                                <div className="text-xs font-bold truncate w-full">{slide.title}</div>
                                <div className="text-xs opacity-60 truncate w-full mt-0.5">{slide.body.split('\n')[0]}</div>
                            </div>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={e => { e.stopPropagation(); deleteSlide(idx); }}
                                    className="w-5 h-5 rounded flex items-center justify-center"
                                    style={{ background: 'oklch(0.3 0.15 25 / 0.8)', color: 'oklch(0.75 0.2 25)' }}
                                >
                                    <X size={10} />
                                </button>
                            </div>
                            <div
                                className="absolute bottom-1 left-1 text-xs font-mono opacity-50"
                                style={{ color: slide.textColor }}
                            >
                                {idx + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                {/* Toolbar */}
                <div
                    className="flex items-center gap-3 px-4 py-2 flex-shrink-0"
                    style={{
                        background: 'oklch(0.14 0.03 290 / 0.9)',
                        borderBottom: '1px solid oklch(0.3 0.08 295 / 0.3)',
                    }}
                >
                    <button
                        onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                        disabled={activeIdx === 0}
                        className="p-1.5 rounded disabled:opacity-30 transition-all"
                        style={{ color: 'oklch(0.65 0.15 295)' }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-mono" style={{ color: 'oklch(0.6 0.1 295)' }}>
                        {activeIdx + 1} / {slides.length}
                    </span>
                    <button
                        onClick={() => setActiveIdx(i => Math.min(slides.length - 1, i + 1))}
                        disabled={activeIdx === slides.length - 1}
                        className="p-1.5 rounded disabled:opacity-30 transition-all"
                        style={{ color: 'oklch(0.65 0.15 295)' }}
                    >
                        <ChevronRight size={16} />
                    </button>

                    <div className="h-4 w-px mx-1" style={{ background: 'oklch(0.35 0.1 295 / 0.4)' }} />

                    <button
                        onClick={startPresent}
                        className="neon-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    >
                        <Maximize2 size={12} />
                        Present
                    </button>
                </div>

                {/* Main area */}
                <div className="flex-1 flex min-h-0 gap-0">
                    {/* Slide Preview */}
                    <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'oklch(0.11 0.02 290)' }}>
                        {activeSlide && (
                            <div
                                className="w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl"
                                style={{
                                    aspectRatio: '16/9',
                                    background: activeSlide.bgColor,
                                    color: activeSlide.textColor,
                                    border: '2px solid oklch(0.45 0.15 295 / 0.4)',
                                    boxShadow: '0 0 40px oklch(0.62 0.25 295 / 0.2)',
                                }}
                            >
                                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                                    <h2 className="text-3xl font-display font-bold mb-4">{activeSlide.title}</h2>
                                    <p className="text-lg opacity-80 whitespace-pre-line">{activeSlide.body}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Edit Panel */}
                    {activeSlide && (
                        <div
                            className="w-64 flex flex-col gap-4 p-4 flex-shrink-0 overflow-y-auto"
                            style={{
                                background: 'oklch(0.14 0.03 290 / 0.9)',
                                borderLeft: '1px solid oklch(0.3 0.08 295 / 0.3)',
                            }}
                        >
                            <div className="text-xs font-mono uppercase tracking-wider" style={{ color: 'oklch(0.55 0.1 295)' }}>
                                Edit Slide
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-mono" style={{ color: 'oklch(0.6 0.1 295)' }}>Title</label>
                                <input
                                    type="text"
                                    value={activeSlide.title}
                                    onChange={e => updateSlide('title', e.target.value)}
                                    className="amethyst-input rounded-lg px-3 py-2 text-sm w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-mono" style={{ color: 'oklch(0.6 0.1 295)' }}>Body Text</label>
                                <textarea
                                    value={activeSlide.body}
                                    onChange={e => updateSlide('body', e.target.value)}
                                    rows={5}
                                    className="amethyst-input rounded-lg px-3 py-2 text-sm w-full resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-mono" style={{ color: 'oklch(0.6 0.1 295)' }}>Background Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={activeSlide.bgColor}
                                        onChange={e => updateSlide('bgColor', e.target.value)}
                                        className="w-10 h-8 rounded cursor-pointer border-0"
                                        style={{ background: 'none' }}
                                    />
                                    <input
                                        type="text"
                                        value={activeSlide.bgColor}
                                        onChange={e => updateSlide('bgColor', e.target.value)}
                                        className="amethyst-input flex-1 rounded-lg px-2 py-1.5 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-mono" style={{ color: 'oklch(0.6 0.1 295)' }}>Text Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={activeSlide.textColor}
                                        onChange={e => updateSlide('textColor', e.target.value)}
                                        className="w-10 h-8 rounded cursor-pointer border-0"
                                        style={{ background: 'none' }}
                                    />
                                    <input
                                        type="text"
                                        value={activeSlide.textColor}
                                        onChange={e => updateSlide('textColor', e.target.value)}
                                        className="amethyst-input flex-1 rounded-lg px-2 py-1.5 text-xs"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => deleteSlide(activeIdx)}
                                disabled={slides.length <= 1}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-all disabled:opacity-30"
                                style={{
                                    background: 'oklch(0.2 0.08 25 / 0.3)',
                                    border: '1px solid oklch(0.45 0.15 25 / 0.3)',
                                    color: 'oklch(0.65 0.18 25)',
                                }}
                            >
                                <Trash2 size={12} />
                                Delete Slide
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Fullscreen Presentation Mode */}
            {isPresenting && (
                <div
                    ref={presentRef}
                    className="fixed inset-0 z-50 flex flex-col"
                    style={{ background: slides[presentIdx]?.bgColor || '#000' }}
                >
                    <div
                        className="flex-1 flex flex-col items-center justify-center p-16 text-center"
                        style={{ color: slides[presentIdx]?.textColor || '#fff' }}
                    >
                        <h1 className="text-5xl font-display font-bold mb-8">{slides[presentIdx]?.title}</h1>
                        <p className="text-2xl opacity-80 whitespace-pre-line max-w-3xl">{slides[presentIdx]?.body}</p>
                    </div>
                    <div className="flex items-center justify-between px-8 py-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <button
                            onClick={() => setPresentIdx(i => Math.max(0, i - 1))}
                            disabled={presentIdx === 0}
                            className="p-2 rounded-lg disabled:opacity-30 transition-all"
                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            {presentIdx + 1} / {slides.length} · ESC to exit
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPresentIdx(i => Math.min(slides.length - 1, i + 1))}
                                disabled={presentIdx === slides.length - 1}
                                className="p-2 rounded-lg disabled:opacity-30 transition-all"
                                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                            >
                                <ChevronRight size={24} />
                            </button>
                            <button
                                onClick={stopPresent}
                                className="p-2 rounded-lg transition-all"
                                style={{ background: 'rgba(255,0,0,0.2)', color: '#ff6b6b' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
