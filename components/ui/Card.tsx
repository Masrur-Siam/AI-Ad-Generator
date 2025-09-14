
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`bg-slate-800 p-4 rounded-xl border border-white/10 shadow-lg shadow-black/20 ${className || ''}`}>
            {children}
        </div>
    );
};

export default Card;
