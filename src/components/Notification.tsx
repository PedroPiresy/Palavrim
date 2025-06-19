import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 1500, // Reduzido de 3000 para 1500ms
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        // Animação de saída mais rápida
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 150); // Reduzido de 300 para 150ms
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-[#4ade80] flex-shrink-0" />;
      case 'error':
        return <AlertCircle size={18} className="text-[#ef4444] flex-shrink-0" />;
      default:
        return <Info size={18} className="text-[#8b5cf6] flex-shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-[#4ade80]';
      case 'error':
        return 'border-[#ef4444]';
      default:
        return 'border-[#8b5cf6]';
    }
  };

  if (!message || !isVisible) return null;

  return (
    <div
      className={`mx-auto flex items-center gap-2 px-4 py-2 rounded-lg border ${getBorderColor()} bg-[#2d2d2d] transition-all duration-150 ease-out transform font-mono text-base ${
        isLeaving 
          ? 'translate-y-2 opacity-0 scale-95' 
          : 'translate-y-0 opacity-100 scale-100'
      }`}
      style={{
        animation: isLeaving ? 'slideOut 150ms ease-in forwards' : 'slideIn 200ms ease-out'
      }}
    >
      {getIcon()}
      <span className="text-[#d0d0d0] font-mono font-medium leading-tight">{message}</span>
    </div>
  );
};