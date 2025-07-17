import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface ModernSpellbookProps {
  onCastRevealLetter: () => void;
  canCastRevealLetter: boolean;
  mana: number;
  spellUses: number;
}

const REVEAL_COST = 25;
const MAX_USES = 2;

export const ModernSpellbook: React.FC<ModernSpellbookProps> = ({ 
  onCastRevealLetter, 
  canCastRevealLetter, 
  mana, 
  spellUses 
}) => {
  const hasEnoughMana = mana >= REVEAL_COST;
  const hasUsesLeft = spellUses < MAX_USES;
  const isDisabled = !canCastRevealLetter || !hasEnoughMana || !hasUsesLeft;

  const getTitle = () => {
    if (!hasUsesLeft) return `Limite de ${MAX_USES} usos por partida atingido.`;
    if (!hasEnoughMana) return 'Mana insuficiente';
    if (!canCastRevealLetter) return 'Nenhuma letra para revelar';
    return `Revela uma letra correta no grid (Custo: ${REVEAL_COST} Mana)`;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-6" data-tour="spellbook">
      <div className="card px-4 py-3 rounded-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm" title="Sua Mana atual" data-tour="spell-mana">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--warning)] to-[var(--warning)] flex items-center justify-center">
              <Zap size={14} className="text-[var(--bg-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--text-primary)] font-semibold text-xs leading-none">Mana</span>
              <span className="text-[var(--warning)] font-bold text-sm leading-none">{mana}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm" title="Usos de feitiço restantes" data-tour="spell-uses">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue-hover)] flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--text-primary)] font-semibold text-xs leading-none">Feitiços</span>
              <span className="text-[var(--accent-blue)] font-bold text-sm leading-none">{MAX_USES - spellUses}/{MAX_USES}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onCastRevealLetter}
        disabled={isDisabled}
        className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 ${
          isDisabled 
            ? 'btn-secondary opacity-50 cursor-not-allowed' 
            : 'btn-primary hover:scale-105 active:scale-95'
        }`}
        title={getTitle()}
        data-tour="spell-button"
      >
        <Sparkles size={16} />
        <span className="whitespace-nowrap">Revelar Letra</span>
      </button>
    </div>
  );
};