import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Copy, Check, Trash2, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface QAPair {
    id: string;
    subject: string;
    question: string;
    answer: string;
    timestamp: number;
}

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Computer Science', 'Other'];

const HISTORY_KEY = 'cheetah-ai-history';

function loadHistory(): QAPair[] {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveHistory(history: QAPair[]) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

function renderMarkdown(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code style="background:oklch(0.2 0.05 295 / 0.6);padding:1px 5px;border-radius:3px;font-family:JetBrains Mono,monospace;font-size:0.85em">$1</code>')
        .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre style="background:oklch(0.12 0.03 290);padding:12px;border-radius:8px;overflow-x:auto;border:1px solid oklch(0.35 0.1 295 / 0.3);margin:8px 0"><code style="font-family:JetBrains Mono,monospace;font-size:0.82em">$1</code></pre>')
        .replace(/^### (.+)$/gm, '<h3 style="font-size:1rem;font-weight:700;color:oklch(0.8 0.15 295);margin:12px 0 4px">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 style="font-size:1.1rem;font-weight:700;color:oklch(0.85 0.18 295);margin:14px 0 6px">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 style="font-size:1.2rem;font-weight:700;color:oklch(0.9 0.2 295);margin:16px 0 8px">$1</h1>')
        .replace(/^\s*[-*]\s+(.+)$/gm, '<li style="margin:3px 0;padding-left:4px">• $1</li>')
        .replace(/^\s*\d+\.\s+(.+)$/gm, '<li style="margin:3px 0;padding-left:4px;list-style:decimal">$1</li>')
        .replace(/\n\n/g, '</p><p style="margin:8px 0">')
        .replace(/\n/g, '<br/>');
}

declare global {
    interface Window {
        puter: {
            ai: {
                chat: (message: string) => Promise<{ message?: { content?: string } } | string>;
            };
        };
    }
}

export const AIAssistant: React.FC = () => {
    const [subject, setSubject] = useState('Math');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState<QAPair[]>(loadHistory);
    const [showHistory, setShowHistory] = useState(false);
    const [error, setError] = useState('');
    const answerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async () => {
        if (!question.trim() || isLoading) return;
        setIsLoading(true);
        setError('');
        setAnswer('');

        try {
            const prompt = `You are a helpful homework assistant. Subject: ${subject}.\n\nQuestion: ${question}\n\nProvide a clear, educational answer with step-by-step explanation where appropriate. Use markdown formatting.`;

            let result: string;
            if (typeof window.puter !== 'undefined' && window.puter?.ai?.chat) {
                const response = await window.puter.ai.chat(prompt);
                if (typeof response === 'string') {
                    result = response;
                } else {
                    result = response?.message?.content || 'No response received.';
                }
            } else {
                result = `**AI Assistant Unavailable**\n\nPuter.js is not loaded. Please check your internet connection and reload the page.\n\nYour question was: *${question}*`;
            }

            setAnswer(result);

            const pair: QAPair = {
                id: Date.now().toString(),
                subject,
                question: question.trim(),
                answer: result,
                timestamp: Date.now(),
            };
            const newHistory = [pair, ...history];
            setHistory(newHistory);
            saveHistory(newHistory);
        } catch (err) {
            setError('Failed to get AI response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!answer) return;
        await navigator.clipboard.writeText(answer);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearHistory = () => {
        setHistory([]);
        saveHistory([]);
    };

    return (
        <div className="h-full overflow-y-auto p-6 page-enter">
            <div className="max-w-3xl mx-auto flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: 'oklch(0.3 0.15 295 / 0.4)',
                            border: '1px solid oklch(0.55 0.2 295 / 0.4)',
                            boxShadow: '0 0 15px oklch(0.62 0.25 295 / 0.2)',
                        }}
                    >
                        <Brain size={20} style={{ color: 'oklch(0.75 0.22 295)' }} />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold gradient-text tracking-wider">
                            AI HOMEWORK HELPER
                        </h1>
                        <p className="text-xs font-mono text-muted-foreground">Powered by Puter.js AI</p>
                    </div>
                </div>

                {/* Input Panel */}
                <div
                    className="glass-panel rounded-xl p-5 flex flex-col gap-4"
                    style={{ border: '1px solid oklch(0.45 0.15 295 / 0.3)' }}
                >
                    {/* Subject Selector */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider" style={{ color: 'oklch(0.6 0.12 295)' }}>
                            Subject
                        </label>
                        <select
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="amethyst-select rounded-lg px-3 py-2 text-sm w-full"
                        >
                            {SUBJECTS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Question Input */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider" style={{ color: 'oklch(0.6 0.12 295)' }}>
                            Your Question
                        </label>
                        <textarea
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(); }}
                            placeholder="Type your homework question here... (Ctrl+Enter to submit)"
                            rows={4}
                            className="amethyst-input rounded-lg px-3 py-2.5 text-sm resize-none w-full"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !question.trim()}
                        className="neon-btn flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm self-end disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Thinking...
                            </>
                        ) : (
                            <>
                                <Send size={14} />
                                Get Answer
                            </>
                        )}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div
                        className="rounded-lg px-4 py-3 text-sm font-mono"
                        style={{
                            background: 'oklch(0.2 0.08 25 / 0.4)',
                            border: '1px solid oklch(0.5 0.15 25 / 0.4)',
                            color: 'oklch(0.75 0.15 25)',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Answer */}
                {answer && (
                    <div
                        className="glass-panel rounded-xl p-5 flex flex-col gap-3"
                        style={{ border: '1px solid oklch(0.5 0.18 295 / 0.3)' }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'oklch(0.6 0.12 295)' }}>
                                Answer
                            </span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                                style={{
                                    background: copied ? 'oklch(0.3 0.15 150 / 0.3)' : 'oklch(0.25 0.08 295 / 0.4)',
                                    border: `1px solid ${copied ? 'oklch(0.5 0.2 150 / 0.4)' : 'oklch(0.45 0.12 295 / 0.3)'}`,
                                    color: copied ? 'oklch(0.7 0.2 150)' : 'oklch(0.7 0.1 295)',
                                }}
                            >
                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                {copied ? 'Copied!' : 'Copy Answer'}
                            </button>
                        </div>
                        <div
                            ref={answerRef}
                            className="text-sm leading-relaxed"
                            style={{ color: 'oklch(0.85 0.05 290)', fontFamily: 'Rajdhani, sans-serif' }}
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(answer) }}
                        />
                    </div>
                )}

                {/* History */}
                {history.length > 0 && (
                    <div className="glass-panel rounded-xl overflow-hidden" style={{ border: '1px solid oklch(0.35 0.1 295 / 0.3)' }}>
                        <button
                            onClick={() => setShowHistory(s => !s)}
                            className="w-full flex items-center justify-between px-5 py-3 transition-all hover:bg-primary/5"
                        >
                            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'oklch(0.6 0.12 295)' }}>
                                Recent History ({history.length})
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={e => { e.stopPropagation(); clearHistory(); }}
                                    className="p-1 rounded hover:text-destructive transition-colors"
                                    style={{ color: 'oklch(0.5 0.08 295)' }}
                                >
                                    <Trash2 size={12} />
                                </button>
                                <ChevronDown
                                    size={14}
                                    style={{
                                        color: 'oklch(0.55 0.1 295)',
                                        transform: showHistory ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.2s',
                                    }}
                                />
                            </div>
                        </button>

                        {showHistory && (
                            <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: 'oklch(0.3 0.08 295 / 0.3)' }}>
                                {history.map(pair => (
                                    <div
                                        key={pair.id}
                                        className="px-5 py-3 cursor-pointer hover:bg-primary/5 transition-all"
                                        onClick={() => { setQuestion(pair.question); setAnswer(pair.answer); setSubject(pair.subject); }}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className="text-xs font-mono px-2 py-0.5 rounded-full"
                                                style={{
                                                    background: 'oklch(0.3 0.12 295 / 0.3)',
                                                    color: 'oklch(0.7 0.18 295)',
                                                    border: '1px solid oklch(0.5 0.15 295 / 0.3)',
                                                }}
                                            >
                                                {pair.subject}
                                            </span>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {new Date(pair.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-mono truncate" style={{ color: 'oklch(0.78 0.08 290)' }}>
                                            {pair.question}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
