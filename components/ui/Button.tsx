
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'normal' | 'small';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'normal', ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
    
    const sizeClasses = {
        normal: 'px-3.5 py-2.5 text-sm',
        small: 'px-3 py-2 text-xs',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:opacity-90 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed',
        secondary: 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-white/10 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed',
    };

    const className = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${props.className || ''}`;

    return (
        <button {...props} className={className}>
            {children}
        </button>
    );
};

export default Button;
