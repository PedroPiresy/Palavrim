import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface SpellbookProps {
  onCastRevealLetter: () => void;
  canCastRevealLetter: boolean;
  mana: number;
  spellUses: number;
}

const REVEAL_COST = 25;
const MAX_USES = 2;

export const Spellbook: React.FC<SpellbookProps> = ({ onCastRevealLetter, canCastRevealLetter, mana, spellUses }) => {
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
    <div className="flex justify-center items-center gap-6 my-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-mono text-yellow-400" title="Sua Mana atual">
          <Zap size={16} />
          <span>{mana}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono text-purple-300" title="Usos de feitiço restantes">
          <Sparkles size={16} />
          <span>{MAX_USES - spellUses}/{MAX_USES}</span>
        </div>
      </div>
      
      <button
        onClick={onCastRevealLetter}
        disabled={isDisabled}
        className="flex items-center gap-2 px-4 py-2 font-mono font-bold text-sm rounded-lg border-2 border-purple-600 bg-purple-900/50 text-white transition-all duration-200 hover:bg-purple-800 hover:border-purple-500 disabled:bg-gray-700/50 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        title={getTitle()}
      >
        <Sparkles size={16} />
        Revelar Letra
      </button>
    </div>
  );
}; 