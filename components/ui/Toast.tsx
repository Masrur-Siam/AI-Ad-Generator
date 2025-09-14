
import React, { useState, useEffect } from 'react';

interface ToastProps {
    message: string;
    isError?: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isError = false }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 3700);
        return () => clearTimeout(timer);
    }, [message]);

    const bgColor = isError ? 'bg-rose-600' : 'bg-emerald-600';

    return (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg text-white shadow-2xl transition-all duration-300 ease-in-out ${bgColor} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {message}
        </div>
    );
};

export default Toast;
