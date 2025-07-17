import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ModernNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const ModernNotification: React.FC<ModernNotificationProps> = ({
  message,
  type = 'info',
  duration = 2000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 200);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-[var(--success)] flex-shrink-0" />;
      case 'error':
        return <AlertCircle size={18} className="text-[var(--error)] flex-shrink-0" />;
      default:
        return <Info size={18} className="text-[var(--accent-blue)] flex-shrink-0" />;
    }
  };

  const getNotificationClass = () => {
    let baseClass = "notification flex items-center gap-3 px-4 py-3 max-w-md transition-all duration-200 ease-out";
    
    if (isLeaving) {
      baseClass += " translate-x-full opacity-0 scale-95";
    } else {
      baseClass += " translate-x-0 opacity-100 scale-100";
    }
    
    baseClass += ` ${type}`;
    
    return baseClass;
  };

  if (!message || !isVisible) return null;

  return (
    <div className={getNotificationClass()}>
      {getIcon()}
      <span className="text-[var(--text-primary)] font-medium leading-tight flex-1">
        {message}
      </span>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose?.();
          }, 200);
        }}
        className="btn-ghost p-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};