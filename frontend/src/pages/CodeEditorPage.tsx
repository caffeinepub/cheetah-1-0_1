import React, { useState } from 'react';
import { Code2, Presentation, Globe } from 'lucide-react';
import { CodeEditorTab } from '../components/codeeditor/CodeEditorTab';
import { PresentationBuilderTab } from '../components/codeeditor/PresentationBuilderTab';
import { WebsiteBuilderTab } from '../components/codeeditor/WebsiteBuilderTab';

type SubTab = 'editor' | 'presentation' | 'website';

interface SubTabItem {
    id: SubTab;
    label: string;
    icon: React.ReactNode;
}

const subTabs: SubTabItem[] = [
    { id: 'editor', label: 'Code Editor', icon: <Code2 size={14} /> },
    { id: 'presentation', label: 'Presentation', icon: <Presentation size={14} /> },
    { id: 'website', label: 'Website Builder', icon: <Globe size={14} /> },
];

export const CodeEditorPage: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('editor');

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Sub-tab bar */}
            <div
                className="flex items-center gap-1 px-3 py-2 flex-shrink-0"
                style={{
                    background: 'oklch(0.14 0.03 290 / 0.95)',
                    borderBottom: '1px solid oklch(0.3 0.08 295 / 0.3)',
                }}
            >
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono transition-all"
                        style={
                            activeSubTab === tab.id
                                ? {
                                      background: 'linear-gradient(135deg, oklch(0.35 0.18 295 / 0.6), oklch(0.3 0.2 310 / 0.4))',
                                      color: 'oklch(0.92 0.15 295)',
                                      border: '1px solid oklch(0.55 0.2 295 / 0.5)',
                                      boxShadow: '0 0 12px oklch(0.62 0.25 295 / 0.25)',
                                  }
                                : {
                                      background: 'oklch(0.18 0.04 290 / 0.4)',
                                      color: 'oklch(0.6 0.08 290)',
                                      border: '1px solid oklch(0.3 0.08 295 / 0.3)',
                                  }
                        }
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sub-tab content */}
            <div className="flex-1 min-h-0 overflow-hidden">
                {activeSubTab === 'editor' && <CodeEditorTab />}
                {activeSubTab === 'presentation' && <PresentationBuilderTab />}
                {activeSubTab === 'website' && <WebsiteBuilderTab />}
            </div>
        </div>
    );
};
