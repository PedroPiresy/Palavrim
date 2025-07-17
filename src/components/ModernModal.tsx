import React from 'react';
import { X } from 'lucide-react';

interface ModernModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const ModernModal: React.FC<ModernModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div className={`modal w-full ${maxWidth} max-h-[90vh] flex flex-col animate-scale-in`}>
        <div className="modal-header p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};