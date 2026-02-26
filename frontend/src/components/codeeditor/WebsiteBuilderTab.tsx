import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Type, Image, MousePointer, Heading, Info, ChevronUp, ChevronDown, EyeOff } from 'lucide-react';

type ComponentType = 'header' | 'text' | 'image' | 'button';

interface WebComponent {
    id: string;
    type: ComponentType;
    content: string;
    style: {
        color: string;
        bgColor: string;
        fontSize: string;
        align: string;
    };
}

const STORAGE_KEY = 'cheetah-website-builder';

function loadComponents(): WebComponent[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? (JSON.parse(saved) as WebComponent[]) : [];
    } catch {
        return [];
    }
}

function renderComponentHtml(comp: WebComponent): string {
    const { color, bgColor, fontSize, align } = comp.style;

    switch (comp.type) {
        case 'header':
            return `<h1 style="color:${color};background:${bgColor};font-size:2em;font-weight:bold;padding:16px;text-align:${align};margin:0;font-family:Rajdhani,sans-serif;letter-spacing:0.05em">${comp.content}</h1>`;
        case 'text':
            return `<p style="color:${color};background:${bgColor};font-size:${fontSize};padding:12px 16px;text-align:${align};margin:0;line-height:1.6">${comp.content}</p>`;
        case 'image':
            return `<div style="padding:16px;text-align:${align};background:${bgColor}"><div style="display:inline-block;background:#2d1b4e;border:2px dashed #7c3aed;border-radius:8px;padding:32px 48px;color:#a855f7;font-family:monospace">🖼️ ${comp.content || 'Image Placeholder'}</div></div>`;
        case 'button':
            return `<div style="padding:12px 16px;text-align:${align};background:${bgColor}"><button style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;border:none;padding:10px 24px;border-radius:8px;font-size:${fontSize};cursor:pointer;font-family:monospace;box-shadow:0 0 15px rgba(124,58,237,0.4)">${comp.content}</button></div>`;
        default:
            return '';
    }
}

const COMPONENT_ICONS: Record<ComponentType, React.ReactNode> = {
    header: <Heading size={14} />,
    text: <Type size={14} />,
    image: <Image size={14} />,
    button: <MousePointer size={14} />,
};

const COMPONENT_DEFAULTS: Record<ComponentType, Omit<WebComponent, 'id'>> = {
    header: { type: 'header', content: 'Page Title', style: { color: '#c084fc', bgColor: 'transparent', fontSize: '2em', align: 'center' } },
    text: { type: 'text', content: 'Add your text content here. Click to edit.', style: { color: '#e2e8f0', bgColor: 'transparent', fontSize: '16px', align: 'left' } },
    image: { type: 'image', content: 'Image Placeholder', style: { color: '#a855f7', bgColor: 'transparent', fontSize: '16px', align: 'center' } },
    button: { type: 'button', content: 'Click Me', style: { color: '#fff', bgColor: 'transparent', fontSize: '14px', align: 'center' } },
};

export const WebsiteBuilderTab: React.FC = () => {
    const [components, setComponents] = useState<WebComponent[]>(loadComponents);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(components));
    }, [components]);

    const selectedComp = components.find(c => c.id === selectedId) ?? null;

    const addComponent = (type: ComponentType) => {
        const newComp: WebComponent = {
            id: Date.now().toString(),
            ...COMPONENT_DEFAULTS[type],
        };
        setComponents(prev => [...prev, newComp]);
        setSelectedId(newComp.id);
    };

    const updateComponent = (id: string, field: keyof Omit<WebComponent, 'id' | 'style'>, value: string) => {
        setComponents(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const updateStyle = (id: string, styleKey: keyof WebComponent['style'], value: string) => {
        setComponents(prev => prev.map(c =>
            c.id === id ? { ...c, style: { ...c.style, [styleKey]: value } } : c
        ));
    };

    const deleteComponent = (id: string) => {
        setComponents(prev => prev.filter(c => c.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const moveUp = (idx: number) => {
        if (idx === 0) return;
        setComponents(prev => {
            const arr = [...prev];
            [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
            return arr;
        });
    };

    const moveDown = (idx: number) => {
        setComponents(prev => {
            if (idx === prev.length - 1) return prev;
            const arr = [...prev];
            [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
            return arr;
        });
    };

    const generatePreview = () => {
        const body = components.map(renderComponentHtml).join('\n');
        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f0a1e; font-family: 'Segoe UI', sans-serif; min-height: 100vh; }
</style>
</head>
<body>${body}</body>
</html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(url);
        setShowPreview(true);
    };

    return (
        <div className="flex h-full min-h-0">
            {/* Left: Component Palette + Layer List */}
            <div
                className="w-52 flex flex-col flex-shrink-0 overflow-hidden"
                style={{
                    background: 'oklch(0.13 0.03 290 / 0.9)',
                    borderRight: '1px solid oklch(0.3 0.08 295 / 0.3)',
                }}
            >
                {/* Add Components */}
                <div className="p-3 flex-shrink-0" style={{ borderBottom: '1px solid oklch(0.25 0.06 295 / 0.3)' }}>
                    <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'oklch(0.55 0.1 295)' }}>
                        Add Components
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                        {(['header', 'text', 'image', 'button'] as ComponentType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => addComponent(type)}
                                className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-mono transition-all"
                                style={{
                                    background: 'oklch(0.2 0.06 295 / 0.4)',
                                    border: '1px solid oklch(0.4 0.12 295 / 0.3)',
                                    color: 'oklch(0.75 0.12 295)',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.28 0.1 295 / 0.5)';
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 8px oklch(0.62 0.25 295 / 0.2)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.2 0.06 295 / 0.4)';
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                                }}
                            >
                                {COMPONENT_ICONS[type]}
                                <span className="capitalize">{type}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Layers */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="text-xs font-mono uppercase tracking-wider mb-2 px-1" style={{ color: 'oklch(0.55 0.1 295)' }}>
                        Layers ({components.length})
                    </div>
                    {components.length === 0 && (
                        <div className="text-xs font-mono text-center py-4" style={{ color: 'oklch(0.4 0.06 290)' }}>
                            No components yet
                        </div>
                    )}
                    {components.map((comp, idx) => (
                        <div
                            key={comp.id}
                            className="flex items-center gap-1 px-2 py-1.5 rounded-lg mb-1 cursor-pointer transition-all"
                            style={{
                                background: selectedId === comp.id
                                    ? 'oklch(0.28 0.1 295 / 0.5)'
                                    : 'oklch(0.18 0.04 290 / 0.4)',
                                border: `1px solid ${selectedId === comp.id ? 'oklch(0.55 0.2 295 / 0.4)' : 'oklch(0.28 0.06 295 / 0.2)'}`,
                            }}
                            onClick={() => setSelectedId(comp.id)}
                        >
                            <span style={{ color: 'oklch(0.6 0.12 295)' }}>{COMPONENT_ICONS[comp.type]}</span>
                            <span className="flex-1 text-xs font-mono truncate" style={{ color: 'oklch(0.75 0.08 290)' }}>
                                {comp.content.slice(0, 16)}
                            </span>
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                <button
                                    onClick={e => { e.stopPropagation(); moveUp(idx); }}
                                    disabled={idx === 0}
                                    className="p-0.5 rounded disabled:opacity-20 transition-all"
                                    style={{ color: 'oklch(0.6 0.1 295)' }}
                                >
                                    <ChevronUp size={10} />
                                </button>
                                <button
                                    onClick={e => { e.stopPropagation(); moveDown(idx); }}
                                    disabled={idx === components.length - 1}
                                    className="p-0.5 rounded disabled:opacity-20 transition-all"
                                    style={{ color: 'oklch(0.6 0.1 295)' }}
                                >
                                    <ChevronDown size={10} />
                                </button>
                                <button
                                    onClick={e => { e.stopPropagation(); deleteComponent(comp.id); }}
                                    className="p-0.5 rounded transition-all"
                                    style={{ color: 'oklch(0.55 0.15 25)' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.7 0.22 25)')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.55 0.15 25)')}
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Note */}
                <div
                    className="p-3 flex-shrink-0 flex items-start gap-2"
                    style={{
                        borderTop: '1px solid oklch(0.25 0.06 295 / 0.3)',
                        background: 'oklch(0.18 0.06 295 / 0.3)',
                    }}
                >
                    <Info size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.6 0.15 295)' }} />
                    <p className="text-xs font-mono leading-relaxed" style={{ color: 'oklch(0.5 0.08 295)' }}>
                        Public sharing only available through the Cheetah proxy
                    </p>
                </div>
            </div>

            {/* Center: Preview */}
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
                        onClick={generatePreview}
                        className="neon-btn flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs"
                    >
                        <Eye size={13} />
                        Preview
                    </button>
                    {showPreview && (
                        <button
                            onClick={() => setShowPreview(false)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                            style={{
                                background: 'oklch(0.2 0.05 290 / 0.5)',
                                border: '1px solid oklch(0.35 0.1 295 / 0.3)',
                                color: 'oklch(0.65 0.1 295)',
                            }}
                        >
                            <EyeOff size={13} />
                            Edit
                        </button>
                    )}
                    <span className="ml-auto text-xs font-mono" style={{ color: 'oklch(0.45 0.08 295)' }}>
                        {components.length} component{components.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Canvas or Preview */}
                <div className="flex-1 overflow-y-auto min-h-0" style={{ background: 'oklch(0.11 0.02 290)' }}>
                    {showPreview && previewUrl ? (
                        <iframe
                            src={previewUrl}
                            className="w-full h-full border-0"
                            title="Website Preview"
                            sandbox="allow-scripts"
                        />
                    ) : (
                        <div className="p-4 min-h-full">
                            {components.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-3">
                                    <Plus size={32} className="opacity-20" style={{ color: 'oklch(0.62 0.25 295)' }} />
                                    <p className="text-sm font-mono text-muted-foreground">
                                        Add components from the left panel
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className="rounded-xl overflow-hidden"
                                    style={{
                                        background: '#0f0a1e',
                                        border: '1px solid oklch(0.35 0.1 295 / 0.3)',
                                        minHeight: '300px',
                                    }}
                                >
                                    {components.map(comp => (
                                        <div
                                            key={comp.id}
                                            className="cursor-pointer transition-all"
                                            style={{
                                                outline: selectedId === comp.id ? '2px solid oklch(0.62 0.25 295 / 0.6)' : '2px solid transparent',
                                            }}
                                            onClick={() => setSelectedId(comp.id)}
                                            dangerouslySetInnerHTML={{ __html: renderComponentHtml(comp) }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Properties Panel */}
            {selectedComp && (
                <div
                    className="w-56 flex flex-col flex-shrink-0 overflow-y-auto"
                    style={{
                        background: 'oklch(0.14 0.03 290 / 0.9)',
                        borderLeft: '1px solid oklch(0.3 0.08 295 / 0.3)',
                    }}
                >
                    <div className="p-3 flex-shrink-0" style={{ borderBottom: '1px solid oklch(0.25 0.06 295 / 0.3)' }}>
                        <div className="flex items-center gap-2">
                            <span style={{ color: 'oklch(0.65 0.15 295)' }}>{COMPONENT_ICONS[selectedComp.type]}</span>
                            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'oklch(0.6 0.12 295)' }}>
                                {selectedComp.type} Properties
                            </span>
                        </div>
                    </div>

                    <div className="p-3 flex flex-col gap-3">
                        {/* Content */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-mono" style={{ color: 'oklch(0.55 0.1 295)' }}>Content</label>
                            {selectedComp.type === 'text' ? (
                                <textarea
                                    value={selectedComp.content}
                                    onChange={e => updateComponent(selectedComp.id, 'content', e.target.value)}
                                    rows={3}
                                    className="amethyst-input rounded-lg px-2 py-1.5 text-xs w-full resize-none"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={selectedComp.content}
                                    onChange={e => updateComponent(selectedComp.id, 'content', e.target.value)}
                                    className="amethyst-input rounded-lg px-2 py-1.5 text-xs w-full"
                                />
                            )}
                        </div>

                        {/* Text Color */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-mono" style={{ color: 'oklch(0.55 0.1 295)' }}>Text Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={selectedComp.style.color}
                                    onChange={e => updateStyle(selectedComp.id, 'color', e.target.value)}
                                    className="w-8 h-7 rounded cursor-pointer border-0 bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={selectedComp.style.color}
                                    onChange={e => updateStyle(selectedComp.id, 'color', e.target.value)}
                                    className="amethyst-input flex-1 rounded-lg px-2 py-1 text-xs"
                                />
                            </div>
                        </div>

                        {/* Background Color */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-mono" style={{ color: 'oklch(0.55 0.1 295)' }}>Background</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={selectedComp.style.bgColor === 'transparent' ? '#000000' : selectedComp.style.bgColor}
                                    onChange={e => updateStyle(selectedComp.id, 'bgColor', e.target.value)}
                                    className="w-8 h-7 rounded cursor-pointer border-0 bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={selectedComp.style.bgColor}
                                    onChange={e => updateStyle(selectedComp.id, 'bgColor', e.target.value)}
                                    className="amethyst-input flex-1 rounded-lg px-2 py-1 text-xs"
                                />
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-mono" style={{ color: 'oklch(0.55 0.1 295)' }}>Font Size</label>
                            <input
                                type="text"
                                value={selectedComp.style.fontSize}
                                onChange={e => updateStyle(selectedComp.id, 'fontSize', e.target.value)}
                                className="amethyst-input rounded-lg px-2 py-1.5 text-xs w-full"
                                placeholder="16px"
                            />
                        </div>

                        {/* Alignment */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-mono" style={{ color: 'oklch(0.55 0.1 295)' }}>Alignment</label>
                            <div className="flex gap-1">
                                {['left', 'center', 'right'].map(align => (
                                    <button
                                        key={align}
                                        onClick={() => updateStyle(selectedComp.id, 'align', align)}
                                        className="flex-1 py-1.5 rounded text-xs font-mono capitalize transition-all"
                                        style={
                                            selectedComp.style.align === align
                                                ? {
                                                      background: 'oklch(0.35 0.15 295 / 0.5)',
                                                      color: 'oklch(0.85 0.18 295)',
                                                      border: '1px solid oklch(0.55 0.2 295 / 0.4)',
                                                  }
                                                : {
                                                      background: 'oklch(0.18 0.04 290 / 0.4)',
                                                      color: 'oklch(0.55 0.08 290)',
                                                      border: '1px solid oklch(0.28 0.06 295 / 0.3)',
                                                  }
                                        }
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Delete */}
                        <button
                            onClick={() => deleteComponent(selectedComp.id)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-all mt-2"
                            style={{
                                background: 'oklch(0.2 0.08 25 / 0.3)',
                                border: '1px solid oklch(0.45 0.15 25 / 0.3)',
                                color: 'oklch(0.65 0.18 25)',
                            }}
                        >
                            <Trash2 size={12} />
                            Delete Component
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
