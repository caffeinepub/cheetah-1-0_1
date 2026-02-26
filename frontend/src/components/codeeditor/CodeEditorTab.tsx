import React, { useEffect, useRef, useState } from 'react';
import { Play, Save, RotateCcw } from 'lucide-react';

declare global {
    interface Window {
        CodeMirror: (element: HTMLElement, options: Record<string, unknown>) => {
            getValue: () => string;
            setValue: (value: string) => void;
            setOption: (key: string, value: unknown) => void;
            on: (event: string, handler: () => void) => void;
        };
    }
}

const LANGUAGE_MODES: Record<string, string> = {
    HTML: 'htmlmixed',
    CSS: 'css',
    JavaScript: 'javascript',
    Python: 'python',
};

const DEFAULT_CODE: Record<string, string> = {
    HTML: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #1a0a2e; color: #c084fc; font-family: monospace; padding: 20px; }
    h1 { color: #a855f7; text-shadow: 0 0 10px #a855f7; }
  </style>
</head>
<body>
  <h1>Hello from Cheetah!</h1>
  <p>Edit this code and click Run to preview.</p>
</body>
</html>`,
    CSS: `body {
  background: #1a0a2e;
  color: #c084fc;
  font-family: monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

.box {
  padding: 20px;
  border: 2px solid #a855f7;
  border-radius: 8px;
  box-shadow: 0 0 20px #a855f7;
}`,
    JavaScript: `// JavaScript Playground
const greeting = "Hello from Cheetah!";
console.log(greeting);

// Try some code:
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

document.body.innerHTML = \`
  <div style="background:#1a0a2e;color:#c084fc;padding:20px;font-family:monospace;min-height:100vh">
    <h2 style="color:#a855f7">\${greeting}</h2>
    <p>Doubled: \${doubled.join(', ')}</p>
  </div>
\`;`,
    Python: `# Python code (display only - not executable in browser)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Print first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

# List comprehension example
squares = [x**2 for x in range(1, 11)]
print("Squares:", squares)`,
};

const STORAGE_KEY = 'cheetah-code-editor';

export const CodeEditorTab: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const cmRef = useRef<ReturnType<typeof window.CodeMirror> | null>(null);
    const previewRef = useRef<HTMLIFrameElement>(null);
    const [language, setLanguage] = useState('HTML');
    const [output, setOutput] = useState('');
    const [hasRun, setHasRun] = useState(false);

    const storageKey = `${STORAGE_KEY}-${language}`;

    useEffect(() => {
        if (!editorRef.current || !window.CodeMirror) return;

        const saved = localStorage.getItem(storageKey) || DEFAULT_CODE[language];

        if (cmRef.current) {
            cmRef.current.setValue(saved);
            cmRef.current.setOption('mode', LANGUAGE_MODES[language]);
            return;
        }

        cmRef.current = window.CodeMirror(editorRef.current, {
            value: saved,
            mode: LANGUAGE_MODES[language],
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: false,
            tabSize: 2,
            indentWithTabs: false,
            autofocus: true,
        });

        cmRef.current.on('change', () => {
            if (cmRef.current) {
                localStorage.setItem(storageKey, cmRef.current.getValue());
            }
        });
    }, [language, storageKey]);

    const handleRun = () => {
        if (!cmRef.current) return;
        const code = cmRef.current.getValue();

        if (language === 'Python') {
            setOutput('Python execution is not supported in the browser. Use the code as reference.');
            setHasRun(true);
            return;
        }

        if (!previewRef.current) return;

        let html = '';
        if (language === 'HTML') {
            html = code;
        } else if (language === 'CSS') {
            html = `<html><head><style>${code}</style></head><body><div class="box">CSS Preview</div></body></html>`;
        } else if (language === 'JavaScript') {
            html = `<html><head></head><body><script>${code}<\/script></body></html>`;
        }

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewRef.current.src = url;
        setHasRun(true);
        setOutput('');
    };

    const handleReset = () => {
        if (!cmRef.current) return;
        cmRef.current.setValue(DEFAULT_CODE[language]);
        localStorage.setItem(storageKey, DEFAULT_CODE[language]);
    };

    return (
        <div className="flex flex-col h-full gap-0">
            {/* Toolbar */}
            <div
                className="flex items-center gap-3 px-4 py-2 flex-shrink-0"
                style={{
                    background: 'oklch(0.14 0.03 290 / 0.9)',
                    borderBottom: '1px solid oklch(0.3 0.08 295 / 0.3)',
                }}
            >
                <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="amethyst-select rounded-lg px-3 py-1.5 text-sm"
                >
                    {Object.keys(LANGUAGE_MODES).map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>

                <button
                    onClick={handleRun}
                    className="neon-btn flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm"
                >
                    <Play size={13} />
                    Run
                </button>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono transition-all"
                    style={{
                        background: 'oklch(0.2 0.05 290 / 0.5)',
                        border: '1px solid oklch(0.35 0.1 295 / 0.3)',
                        color: 'oklch(0.65 0.1 295)',
                    }}
                >
                    <RotateCcw size={13} />
                    Reset
                </button>

                <span className="ml-auto text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Save size={11} />
                    Auto-saved
                </span>
            </div>

            {/* Editor + Preview */}
            <div className="flex-1 flex min-h-0">
                {/* Editor */}
                <div className="flex-1 min-w-0 overflow-hidden" style={{ borderRight: '1px solid oklch(0.3 0.08 295 / 0.3)' }}>
                    <div ref={editorRef} className="h-full" />
                </div>

                {/* Preview */}
                <div className="flex-1 min-w-0 flex flex-col">
                    <div
                        className="px-3 py-1.5 text-xs font-mono flex-shrink-0"
                        style={{
                            background: 'oklch(0.14 0.03 290 / 0.9)',
                            borderBottom: '1px solid oklch(0.3 0.08 295 / 0.3)',
                            color: 'oklch(0.55 0.1 295)',
                        }}
                    >
                        PREVIEW {language === 'Python' ? '(Python not executable)' : ''}
                    </div>
                    {output ? (
                        <div className="flex-1 p-4 font-mono text-sm" style={{ color: 'oklch(0.7 0.15 25)', background: 'oklch(0.12 0.02 290)' }}>
                            {output}
                        </div>
                    ) : hasRun ? (
                        <iframe
                            ref={previewRef}
                            className="flex-1 border-0 w-full"
                            title="Code Preview"
                            sandbox="allow-scripts"
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center" style={{ background: 'oklch(0.12 0.02 290)' }}>
                            <div className="text-center">
                                <Play size={32} className="mx-auto mb-2 opacity-20" style={{ color: 'oklch(0.62 0.25 295)' }} />
                                <p className="text-xs font-mono text-muted-foreground">Click Run to preview</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
