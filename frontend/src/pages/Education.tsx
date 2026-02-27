import React, { useState, useCallback } from 'react';
import { GraduationCap, Send, CheckCircle2, XCircle, Trophy, Flame, BookOpen, FlaskConical, Calculator, Languages, Cpu, RefreshCw, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizQuestion {
    id: string;
    subject: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

// ─── Quiz Data ────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
    // Math
    { id: 'm1', subject: 'Math', question: 'What is 7 × 8?', options: ['54', '56', '63', '48'], correctIndex: 1, explanation: '7 × 8 = 56. You can think of it as 7 × 4 × 2 = 28 × 2 = 56.' },
    { id: 'm2', subject: 'Math', question: 'What is the square root of 144?', options: ['11', '12', '13', '14'], correctIndex: 1, explanation: '√144 = 12, because 12 × 12 = 144.' },
    { id: 'm3', subject: 'Math', question: 'Solve: 3x + 6 = 21. What is x?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: '3x = 21 − 6 = 15, so x = 15 ÷ 3 = 5.' },
    { id: 'm4', subject: 'Math', question: 'What is 25% of 200?', options: ['25', '40', '50', '75'], correctIndex: 2, explanation: '25% = 1/4, and 200 ÷ 4 = 50.' },
    { id: 'm5', subject: 'Math', question: 'What is the area of a rectangle with length 8 and width 5?', options: ['13', '26', '40', '45'], correctIndex: 2, explanation: 'Area = length × width = 8 × 5 = 40.' },
    { id: 'm6', subject: 'Math', question: 'What is 2³ (2 to the power of 3)?', options: ['6', '8', '9', '12'], correctIndex: 1, explanation: '2³ = 2 × 2 × 2 = 8.' },
    { id: 'm7', subject: 'Math', question: 'What is the perimeter of a square with side length 6?', options: ['12', '18', '24', '36'], correctIndex: 2, explanation: 'Perimeter = 4 × side = 4 × 6 = 24.' },
    // ELA
    { id: 'e1', subject: 'ELA', question: 'Which word is a synonym for "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctIndex: 1, explanation: '"Joyful" means feeling great happiness — a synonym for happy.' },
    { id: 'e2', subject: 'ELA', question: 'What is the plural of "child"?', options: ['Childs', 'Childes', 'Children', 'Childrens'], correctIndex: 2, explanation: '"Children" is the irregular plural of "child".' },
    { id: 'e3', subject: 'ELA', question: 'Which sentence uses correct punctuation?', options: ["Its a nice day.", "It's a nice day.", "Its' a nice day.", "It is' a nice day."], correctIndex: 1, explanation: '"It\'s" is the contraction of "it is" and requires an apostrophe.' },
    { id: 'e4', subject: 'ELA', question: 'What part of speech is the word "quickly"?', options: ['Noun', 'Verb', 'Adjective', 'Adverb'], correctIndex: 3, explanation: '"Quickly" modifies a verb (e.g., "ran quickly"), making it an adverb.' },
    { id: 'e5', subject: 'ELA', question: 'What is the main idea of a paragraph?', options: ['The last sentence', 'The most important point', 'A supporting detail', 'The title'], correctIndex: 1, explanation: 'The main idea is the central, most important point the paragraph is making.' },
    { id: 'e6', subject: 'ELA', question: 'Which word is an antonym for "ancient"?', options: ['Old', 'Historic', 'Modern', 'Aged'], correctIndex: 2, explanation: '"Modern" means new or current — the opposite of ancient.' },
    { id: 'e7', subject: 'ELA', question: 'A story\'s "setting" refers to:', options: ['The main character', 'The problem in the story', 'The time and place of the story', 'The lesson learned'], correctIndex: 2, explanation: 'Setting describes where and when a story takes place.' },
    // Science
    { id: 's1', subject: 'Science', question: 'What is the chemical symbol for water?', options: ['WA', 'H2O', 'HO2', 'W2O'], correctIndex: 1, explanation: 'Water is H₂O — two hydrogen atoms bonded to one oxygen atom.' },
    { id: 's2', subject: 'Science', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctIndex: 2, explanation: 'Mercury is the innermost planet in our solar system.' },
    { id: 's3', subject: 'Science', question: 'What process do plants use to make food from sunlight?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Evaporation'], correctIndex: 1, explanation: 'Photosynthesis converts sunlight, CO₂, and water into glucose and oxygen.' },
    { id: 's4', subject: 'Science', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], correctIndex: 2, explanation: 'Mitochondria produce ATP energy through cellular respiration.' },
    { id: 's5', subject: 'Science', question: 'What state of matter has a definite shape and volume?', options: ['Gas', 'Liquid', 'Plasma', 'Solid'], correctIndex: 3, explanation: 'Solids have tightly packed particles giving them a fixed shape and volume.' },
    { id: 's6', subject: 'Science', question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '246'], correctIndex: 1, explanation: 'An adult human body has 206 bones.' },
    { id: 's7', subject: 'Science', question: 'What force pulls objects toward Earth?', options: ['Magnetism', 'Friction', 'Gravity', 'Tension'], correctIndex: 2, explanation: 'Gravity is the attractive force between masses — it keeps us on the ground.' },
    // History
    { id: 'h1', subject: 'History', question: 'In what year did the United States declare independence?', options: ['1765', '1776', '1783', '1812'], correctIndex: 1, explanation: 'The Declaration of Independence was signed on July 4, 1776.' },
    { id: 'h2', subject: 'History', question: 'Who was the first President of the United States?', options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'], correctIndex: 2, explanation: 'George Washington served as the first U.S. President from 1789–1797.' },
    { id: 'h3', subject: 'History', question: 'Which ancient wonder was located in Egypt?', options: ['Colosseum', 'Great Pyramid of Giza', 'Parthenon', 'Stonehenge'], correctIndex: 1, explanation: 'The Great Pyramid of Giza is the only ancient wonder still largely intact.' },
    { id: 'h4', subject: 'History', question: 'What was the name of the ship that brought the Pilgrims to America in 1620?', options: ['Santa Maria', 'Mayflower', 'Endeavour', 'Discovery'], correctIndex: 1, explanation: 'The Mayflower carried 102 passengers from England to Plymouth, Massachusetts.' },
    // Computer Science
    { id: 'c1', subject: 'CS', question: 'What does "CPU" stand for?', options: ['Central Processing Unit', 'Computer Power Unit', 'Core Program Utility', 'Central Program Uplink'], correctIndex: 0, explanation: 'CPU stands for Central Processing Unit — the brain of the computer.' },
    { id: 'c2', subject: 'CS', question: 'What is the binary representation of the decimal number 5?', options: ['011', '100', '101', '110'], correctIndex: 2, explanation: '5 in binary is 101 (1×4 + 0×2 + 1×1 = 5).' },
    { id: 'c3', subject: 'CS', question: 'Which of these is a programming language?', options: ['HTML', 'Python', 'CSS', 'Markdown'], correctIndex: 1, explanation: 'Python is a general-purpose programming language. HTML and CSS are markup/style languages.' },
    { id: 'c4', subject: 'CS', question: 'What does "www" stand for in a web address?', options: ['World Wide Web', 'Wide World Web', 'Web World Wide', 'World Web Wide'], correctIndex: 0, explanation: 'WWW stands for World Wide Web, the system of interlinked web pages.' },
];

const SUBJECTS_FILTER = ['All', 'Math', 'ELA', 'Science', 'History', 'CS'];

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
    Math: <Calculator size={14} />,
    ELA: <Languages size={14} />,
    Science: <FlaskConical size={14} />,
    History: <BookOpen size={14} />,
    CS: <Cpu size={14} />,
    Other: <GraduationCap size={14} />,
};

const SUBJECT_COLORS: Record<string, string> = {
    Math: 'oklch(0.65 0.22 250)',
    ELA: 'oklch(0.68 0.22 150)',
    Science: 'oklch(0.68 0.22 195)',
    History: 'oklch(0.68 0.22 60)',
    CS: 'oklch(0.68 0.22 295)',
    Other: 'oklch(0.68 0.22 320)',
};

const AI_SUBJECTS = ['Math', 'ELA', 'Science', 'History', 'Computer Science', 'Other'];

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
        .replace(/^\s*\d+\.\s+(.+)$/gm, '<li style="margin:3px 0;padding-left:4px">$1</li>')
        .replace(/\n\n/g, '</p><p style="margin:8px 0">')
        .replace(/\n/g, '<br/>');
}

function pickRandom<T>(arr: T[], exclude?: T): T {
    const pool = exclude !== undefined ? arr.filter(x => x !== exclude) : arr;
    return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Ed AI Chat Sub-component ─────────────────────────────────────────────────

const EdAIChat: React.FC = () => {
    const [subject, setSubject] = useState('Math');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAsk = async () => {
        if (!question.trim() || isLoading) return;
        setIsLoading(true);
        setError('');
        setAnswer('');
        try {
            const prompt = `You are Ed, a friendly and encouraging AI tutor for students. Subject: ${subject}.\n\nStudent question: ${question}\n\nProvide a clear, educational answer with step-by-step explanation where appropriate. Be encouraging and use simple language. Use markdown formatting.`;
            let result: string;
            if (typeof window.puter !== 'undefined' && window.puter?.ai?.chat) {
                const response = await window.puter.ai.chat(prompt);
                result = typeof response === 'string' ? response : (response?.message?.content ?? 'No response received.');
            } else {
                result = `**Ed AI is unavailable right now.**\n\nPuter.js is not loaded. Please check your internet connection and reload the page.\n\nYour question was: *${question}*`;
            }
            setAnswer(result);
        } catch {
            setError('Ed AI could not respond. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="glass-panel rounded-2xl p-6 flex flex-col gap-4"
            style={{ border: '1px solid oklch(0.5 0.2 295 / 0.3)', boxShadow: '0 0 30px oklch(0.55 0.22 295 / 0.08)' }}
        >
            {/* Section header */}
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'oklch(0.28 0.15 295 / 0.5)', border: '1px solid oklch(0.55 0.2 295 / 0.4)', boxShadow: '0 0 14px oklch(0.62 0.25 295 / 0.25)' }}
                >
                    <span className="text-lg">🤖</span>
                </div>
                <div>
                    <h2 className="text-base font-display font-bold tracking-wider" style={{ color: 'oklch(0.88 0.18 295)' }}>
                        Ask Ed AI
                    </h2>
                    <p className="text-xs font-mono" style={{ color: 'oklch(0.5 0.1 295)' }}>Your personal AI tutor — ask anything!</p>
                </div>
            </div>

            {/* Subject + Input row */}
            <div className="flex flex-col sm:flex-row gap-3">
                <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="amethyst-select rounded-lg px-3 py-2 text-sm shrink-0 sm:w-44"
                >
                    {AI_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex flex-1 gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAsk(); }}
                        placeholder="Ask Ed a question… (press Enter)"
                        className="amethyst-input rounded-lg px-3 py-2 text-sm flex-1 min-w-0"
                    />
                    <button
                        onClick={handleAsk}
                        disabled={isLoading || !question.trim()}
                        className="neon-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {isLoading ? 'Thinking…' : 'Ask'}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg px-4 py-3 text-sm font-mono" style={{ background: 'oklch(0.2 0.08 25 / 0.4)', border: '1px solid oklch(0.5 0.15 25 / 0.4)', color: 'oklch(0.75 0.15 25)' }}>
                    {error}
                </div>
            )}

            {/* Answer */}
            {answer && (
                <div
                    className="rounded-xl p-4"
                    style={{ background: 'oklch(0.16 0.05 295 / 0.5)', border: '1px solid oklch(0.45 0.15 295 / 0.25)' }}
                >
                    <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'oklch(0.6 0.12 295)' }}>
                        Ed's Answer
                    </div>
                    <div
                        className="text-sm leading-relaxed"
                        style={{ color: 'oklch(0.85 0.05 290)', fontFamily: 'Rajdhani, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(answer) }}
                    />
                </div>
            )}
        </div>
    );
};

// ─── Quiz / Challenge Section ─────────────────────────────────────────────────

const ChallengeSection: React.FC = () => {
    const getFiltered = useCallback((subject: string) => {
        if (subject === 'All') return QUIZ_QUESTIONS;
        return QUIZ_QUESTIONS.filter(q => q.subject === subject);
    }, []);

    const [filterSubject, setFilterSubject] = useState('All');
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(() => pickRandom(QUIZ_QUESTIONS));
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);

    const handleFilterChange = (subject: string) => {
        setFilterSubject(subject);
        const pool = getFiltered(subject);
        setCurrentQuestion(pickRandom(pool));
        setSelectedIndex(null);
    };

    const handleAnswer = (idx: number) => {
        if (selectedIndex !== null) return;
        setSelectedIndex(idx);
        const isCorrect = idx === currentQuestion.correctIndex;
        setTotalAnswered(t => t + 1);
        if (isCorrect) {
            setCorrectCount(c => c + 1);
            setStreak(s => {
                const next = s + 1;
                setBestStreak(b => Math.max(b, next));
                return next;
            });
        } else {
            setStreak(0);
        }
    };

    const handleNext = () => {
        const pool = getFiltered(filterSubject);
        setCurrentQuestion(prev => pickRandom(pool, prev));
        setSelectedIndex(null);
    };

    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const isAnswered = selectedIndex !== null;
    const isCorrect = isAnswered && selectedIndex === currentQuestion.correctIndex;

    return (
        <div
            className="glass-panel rounded-2xl p-6 flex flex-col gap-5"
            style={{ border: '1px solid oklch(0.5 0.2 150 / 0.25)', boxShadow: '0 0 30px oklch(0.55 0.22 150 / 0.06)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'oklch(0.25 0.12 150 / 0.5)', border: '1px solid oklch(0.5 0.2 150 / 0.4)', boxShadow: '0 0 14px oklch(0.6 0.22 150 / 0.2)' }}
                    >
                        <Trophy size={18} style={{ color: 'oklch(0.72 0.22 150)' }} />
                    </div>
                    <div>
                        <h2 className="text-base font-display font-bold tracking-wider" style={{ color: 'oklch(0.88 0.18 150)' }}>
                            Challenge Yourself
                        </h2>
                        <p className="text-xs font-mono" style={{ color: 'oklch(0.5 0.1 150)' }}>Test your knowledge with quick quizzes</p>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'oklch(0.2 0.08 295 / 0.4)', border: '1px solid oklch(0.4 0.12 295 / 0.3)' }}>
                        <Trophy size={12} style={{ color: 'oklch(0.7 0.2 295)' }} />
                        <span className="text-xs font-mono" style={{ color: 'oklch(0.75 0.15 295)' }}>{correctCount}/{totalAnswered}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'oklch(0.2 0.1 60 / 0.4)', border: '1px solid oklch(0.45 0.15 60 / 0.3)' }}>
                        <Flame size={12} style={{ color: 'oklch(0.72 0.22 60)' }} />
                        <span className="text-xs font-mono" style={{ color: 'oklch(0.78 0.18 60)' }}>Streak: {streak}</span>
                    </div>
                    {totalAnswered > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'oklch(0.2 0.08 150 / 0.4)', border: '1px solid oklch(0.4 0.15 150 / 0.3)' }}>
                            <CheckCircle2 size={12} style={{ color: 'oklch(0.7 0.2 150)' }} />
                            <span className="text-xs font-mono" style={{ color: 'oklch(0.75 0.18 150)' }}>{accuracy}% accuracy</span>
                        </div>
                    )}
                    {bestStreak >= 3 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'oklch(0.2 0.1 30 / 0.4)', border: '1px solid oklch(0.45 0.18 30 / 0.3)' }}>
                            <span className="text-xs font-mono" style={{ color: 'oklch(0.78 0.2 30)' }}>🏆 Best: {bestStreak}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Subject filter */}
            <div className="flex flex-wrap gap-2">
                {SUBJECTS_FILTER.map(s => (
                    <button
                        key={s}
                        onClick={() => handleFilterChange(s)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                        style={{
                            background: filterSubject === s ? 'oklch(0.35 0.18 295 / 0.5)' : 'oklch(0.18 0.05 295 / 0.4)',
                            border: `1px solid ${filterSubject === s ? 'oklch(0.6 0.22 295 / 0.5)' : 'oklch(0.35 0.1 295 / 0.25)'}`,
                            color: filterSubject === s ? 'oklch(0.85 0.2 295)' : 'oklch(0.55 0.1 295)',
                            boxShadow: filterSubject === s ? '0 0 10px oklch(0.62 0.25 295 / 0.2)' : 'none',
                        }}
                    >
                        {s !== 'All' && SUBJECT_ICONS[s]}
                        {s}
                    </button>
                ))}
            </div>

            {/* Question card */}
            <div
                className="rounded-xl p-5 flex flex-col gap-4"
                style={{ background: 'oklch(0.15 0.04 295 / 0.6)', border: '1px solid oklch(0.38 0.12 295 / 0.25)' }}
            >
                {/* Subject badge + question */}
                <div className="flex items-start gap-3">
                    <span
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono shrink-0 mt-0.5"
                        style={{
                            background: `${SUBJECT_COLORS[currentQuestion.subject] ?? 'oklch(0.65 0.2 295)'}22`,
                            border: `1px solid ${SUBJECT_COLORS[currentQuestion.subject] ?? 'oklch(0.65 0.2 295)'}55`,
                            color: SUBJECT_COLORS[currentQuestion.subject] ?? 'oklch(0.65 0.2 295)',
                        }}
                    >
                        {SUBJECT_ICONS[currentQuestion.subject]}
                        {currentQuestion.subject}
                    </span>
                    <p className="text-sm font-display font-semibold leading-relaxed" style={{ color: 'oklch(0.9 0.08 290)' }}>
                        {currentQuestion.question}
                    </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentQuestion.options.map((opt, idx) => {
                        const isSelected = selectedIndex === idx;
                        const isRight = idx === currentQuestion.correctIndex;
                        let bg = 'oklch(0.2 0.06 295 / 0.4)';
                        let border = 'oklch(0.38 0.1 295 / 0.3)';
                        let color = 'oklch(0.78 0.08 290)';
                        let shadow = 'none';

                        if (isAnswered) {
                            if (isRight) {
                                bg = 'oklch(0.25 0.12 150 / 0.5)';
                                border = 'oklch(0.55 0.2 150 / 0.6)';
                                color = 'oklch(0.82 0.2 150)';
                                shadow = '0 0 12px oklch(0.6 0.22 150 / 0.25)';
                            } else if (isSelected) {
                                bg = 'oklch(0.22 0.1 25 / 0.5)';
                                border = 'oklch(0.55 0.18 25 / 0.6)';
                                color = 'oklch(0.78 0.18 25)';
                                shadow = '0 0 12px oklch(0.55 0.2 25 / 0.2)';
                            } else {
                                bg = 'oklch(0.16 0.04 295 / 0.3)';
                                border = 'oklch(0.3 0.08 295 / 0.2)';
                                color = 'oklch(0.5 0.06 290)';
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={isAnswered}
                                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-mono text-left transition-all disabled:cursor-default"
                                style={{ background: bg, border: `1px solid ${border}`, color, boxShadow: shadow }}
                            >
                                <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold"
                                    style={{ background: 'oklch(0.25 0.08 295 / 0.5)', border: `1px solid ${border}` }}
                                >
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                                {isAnswered && isRight && <CheckCircle2 size={14} className="ml-auto shrink-0" style={{ color: 'oklch(0.72 0.22 150)' }} />}
                                {isAnswered && isSelected && !isRight && <XCircle size={14} className="ml-auto shrink-0" style={{ color: 'oklch(0.68 0.2 25)' }} />}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback + Next */}
                {isAnswered && (
                    <div className="flex flex-col gap-3">
                        <div
                            className="rounded-lg px-4 py-3 text-sm"
                            style={{
                                background: isCorrect ? 'oklch(0.22 0.1 150 / 0.35)' : 'oklch(0.2 0.08 25 / 0.35)',
                                border: `1px solid ${isCorrect ? 'oklch(0.5 0.18 150 / 0.4)' : 'oklch(0.5 0.15 25 / 0.4)'}`,
                                color: isCorrect ? 'oklch(0.8 0.2 150)' : 'oklch(0.78 0.18 25)',
                            }}
                        >
                            <span className="font-bold">{isCorrect ? '✅ Correct! ' : '❌ Not quite. '}</span>
                            <span style={{ color: 'oklch(0.78 0.06 290)' }}>{currentQuestion.explanation}</span>
                        </div>
                        <button
                            onClick={handleNext}
                            className="neon-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm self-end"
                        >
                            <RefreshCw size={14} />
                            Next Question
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Education Page ──────────────────────────────────────────────────────

export const Education: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto page-enter">
            {/* Hero Banner */}
            <div
                className="relative overflow-hidden px-6 py-10"
                style={{
                    background: 'linear-gradient(135deg, oklch(0.16 0.06 295 / 0.95) 0%, oklch(0.14 0.04 270 / 0.95) 50%, oklch(0.16 0.06 150 / 0.8) 100%)',
                    borderBottom: '1px solid oklch(0.4 0.15 295 / 0.25)',
                }}
            >
                {/* Decorative glow orbs */}
                <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'oklch(0.55 0.25 295 / 0.06)', filter: 'blur(60px)', transform: 'translateY(-50%)' }} />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'oklch(0.55 0.25 150 / 0.06)', filter: 'blur(50px)', transform: 'translateY(50%)' }} />

                <div className="max-w-4xl mx-auto relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                            style={{
                                background: 'oklch(0.28 0.15 295 / 0.5)',
                                border: '1px solid oklch(0.6 0.22 295 / 0.4)',
                                boxShadow: '0 0 24px oklch(0.62 0.25 295 / 0.3)',
                            }}
                        >
                            <GraduationCap size={28} style={{ color: 'oklch(0.82 0.22 295)' }} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold gradient-text tracking-wider leading-tight">
                                EDUCATION HUB
                            </h1>
                            <p className="text-sm font-mono mt-1" style={{ color: 'oklch(0.6 0.1 295)' }}>
                                Powered by Cheetah 1.0 · AI Tutor + Interactive Quizzes
                            </p>
                        </div>
                    </div>

                    <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'oklch(0.72 0.08 290)', fontFamily: 'Rajdhani, sans-serif' }}>
                        Welcome to the Cheetah Education Hub! Ask <strong style={{ color: 'oklch(0.82 0.18 295)' }}>Ed AI</strong> any homework question across Math, ELA, Science, History, and more — then challenge yourself with our interactive quizzes to test what you know. Learning has never been this fast. 🐆
                    </p>

                    {/* Quick stats */}
                    <div className="flex flex-wrap gap-3 mt-5">
                        {[
                            { label: 'Subjects', value: '5+', color: 'oklch(0.68 0.22 295)' },
                            { label: 'Quiz Questions', value: `${QUIZ_QUESTIONS.length}`, color: 'oklch(0.68 0.22 150)' },
                            { label: 'AI Tutor', value: 'Ed AI', color: 'oklch(0.68 0.22 60)' },
                        ].map(stat => (
                            <div
                                key={stat.label}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                                style={{ background: 'oklch(0.18 0.06 295 / 0.5)', border: `1px solid ${stat.color}33` }}
                            >
                                <span className="text-lg font-display font-bold" style={{ color: stat.color }}>{stat.value}</span>
                                <span className="text-xs font-mono" style={{ color: 'oklch(0.55 0.08 290)' }}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                    {/* Ed AI Chat */}
                    <EdAIChat />

                    {/* Challenge Section */}
                    <ChallengeSection />
                </div>
            </div>
        </div>
    );
};
