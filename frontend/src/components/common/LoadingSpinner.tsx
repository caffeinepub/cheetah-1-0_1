import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label }) => {
    const sizeMap = { sm: 24, md: 40, lg: 60 };
    const px = sizeMap[size];

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                style={{
                    width: px,
                    height: px,
                    border: `${size === 'sm' ? 2 : 3}px solid oklch(0.3 0.1 295)`,
                    borderTopColor: 'oklch(0.7 0.25 295)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
            {label && (
                <span className="text-xs font-mono text-muted-foreground animate-pulse">{label}</span>
            )}
        </div>
    );
};
