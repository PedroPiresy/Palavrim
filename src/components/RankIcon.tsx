import React from 'react';
import { Medal, Shield, Award, Wand2, Sun, Crown, Zap, Flame } from 'lucide-react';

interface RankIconProps {
  rank: string;
  size?: number;
  className?: string;
}

export const RankIcon: React.FC<RankIconProps> = ({ rank, size = 14, className = '' }) => {
  const defaultClassName = `sm:w-4 sm:h-4 ${className}`;

  switch (rank) {
    case 'Aprendiz de Letras':
      return <Medal size={size} className={`${defaultClassName} text-yellow-600`} />;
    case 'Iniciado das Sílabas':
      return <Shield size={size} className={`${defaultClassName} text-slate-400`} />;
    case 'Mago das Palavras':
      return <Award size={size} className={`${defaultClassName} text-yellow-400`} />;
    case 'Feiticeiro Ortográfico':
      return <Wand2 size={size} className={`${defaultClassName} text-cyan-400`} />;
    case 'Arquimago do Dicionário':
      return <Sun size={size} className={`${defaultClassName} text-amber-400`} />;
    case 'Lorde do Léxico':
      return <Crown size={size} className={`${defaultClassName} text-violet-400`} />;
    case 'Semideus da Semântica':
      return <Zap size={size} className={`${defaultClassName} text-rose-500`} />;
    case 'Avatar do Alfabeto':
      return <Flame size={size} className={`${defaultClassName} text-orange-500`} />;
    default:
      return <Medal size={size} className={`${defaultClassName} text-yellow-600`} />;
  }
}; 