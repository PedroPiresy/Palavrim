import { ranks } from './stats';

export type MessageType = 
  'welcome' | 'win' | 'loss' | 'levelUp' | 'generic' |
  'firstGuessFlop' | 'lastAttempt' | 'clutchWin' | 'flawlessWin' |
  'usedSpell' | 'duplicateGuess' | 'invalidWord' | 'foundPresent' | 'makingProgress' |
  'oneLetterAway' | 'anotherBadGuess';

const messages: Record<MessageType, string[]> = {
  welcome: [
    "Hmm, uma nova mente para desafiar. Mostre-me o que sabe.",
    "As palavras antigas aguardam. Não me decepcione.",
    "Concentre-se. A primeira letra é o primeiro passo na jornada.",
    "Acha que consegue decifrar o enigma de hoje? Veremos.",
    "Ah, é você de novo. Espero que tenha aprendido algo desde a última vez.",
  ],
  win: [
    "Hmph. Não foi tão ruim... para um iniciante.",
    "Uma vitória! Mas a verdadeira maestria exige consistência.",
    "Correto. As estrelas estavam ao seu favor hoje.",
    "Finalmente! Achei que não ia conseguir.",
  ],
  loss: [
    "Até a mente mais brilhante às vezes tropeça. A palavra era óbvia.",
    "A magia das palavras requer mais prática. Tente novamente.",
    "Derrota? Encare como uma lição. Uma lição de que você precisa melhorar.",
    "Eu escolheria uma palavra mais fácil para você, mas onde estaria a graça?",
  ],
  levelUp: [
    "Sinta a nova energia fluindo! Sua magia está mais forte.",
    "Um novo patamar! Seu nome ecoa nos corredores da sabedoria.",
    "Excelente! A cada nível, você se aproxima da verdadeira maestria.",
  ],
  generic: [
    "Já tentou usar uma vogal menos comum? 'U', talvez?",
    "Às vezes, a resposta mais simples é a correta. Raramente, mas acontece.",
    "Está sentindo o fluxo da mana? Use-a com sabedoria. Ou não, e falhe. A escolha é sua.",
    "Hmm... essa foi uma escolha... *interessante* de palavra.",
    "Está piscando demais. Isso afeta a concentração.",
  ],
  firstGuessFlop: [
    "Um começo... humilde. Para dizer o mínimo.",
    "Nenhuma letra? Audacioso. E completamente errado.",
    "Isso foi um palpite ou um espirro no teclado?",
  ],
  anotherBadGuess: [
    "Ainda nenhuma letra... Você está tentando adivinhar ou me irritar?",
    "Sério? Outra vez? Todas as letras erradas. De novo.",
    "Estou começando a achar que você está fazendo isso de propósito.",
  ],
  lastAttempt: [
    "Sua última chance. Sem pressão.",
    "Tudo ou nada. A magia observa seu movimento final.",
    "Este é o momento da verdade. Ou da vergonha. Veremos.",
  ],
  clutchWin: [
    "Ufa! Por um fio de barba de gnomo. Foi sorte.",
    "No último segundo! Precisa de mais emoção na sua vida?",
    "Uma vitória suada. Quase tive que intervir.",
  ],
  flawlessWin: [
    "Impressionante. Devo admitir, não esperava por isso.",
    "Um prodígio! Ou sorte de principiante. Aposto na segunda.",
    "Resolver tão rápido? Você anda estudando o Grande Dicionário às escondidas?",
  ],
  usedSpell: [
    "Precisando de uma ajudinha? A verdadeira magia vem de dentro. E dos feitiços.",
    "Um pouco de mana em troca de um pouco de conhecimento. Troca justa.",
    "Não consegue sozinho, é? Tudo bem, eu não julgo. Muito.",
  ],
  duplicateGuess: [
    "Você já tentou essa palavra. A memória é uma ferramenta mágica, sabe?",
    "Tentar a mesma coisa esperando um resultado diferente? Que conceito... *humano*.",
    "Olá? Eco? Já vimos essa palavra antes.",
  ],
  invalidWord: [
    "Isso não é uma palavra. É um amontoado de letras. Tente de novo.",
    "Meu dicionário arcano não reconhece esse termo. E ele conhece todos.",
    "Você está inventando palavras? Deixe isso para os bardos.",
  ],
  foundPresent: [
    "Uma peça do quebra-cabeça! Mas... no lugar errado.",
    "Está no caminho certo, mas o caminho é torto. Continue.",
    "Você sentiu um vislumbre da verdade. Pena que foi só um vislumbre.",
    "Quente. Fervendo. Ops, lugar errado. Esfriou.",
  ],
  makingProgress: [
    "Ah, agora estamos chegando a algum lugar! Peças no lugar certo, outras quase lá.",
    "Um bom progresso. As peças do enigma começam a se encaixar.",
    "Verde e amarelo... um bom presságio. Continue neste caminho.",
    "Excelente! Você está desemaranhando o feitiço da palavra.",
  ],
  oneLetterAway: [
    "É agora! Você está a um sopro de resolver o enigma!",
    "Só mais uma letra! Sinto a magia se concentrando!",
    "Você conseguiu! Ou quase... Não erre agora.",
    "Está na ponta da língua... ou melhor, dos dedos!",
  ]
};

export const getMascotMessage = (type: MessageType, rank?: string): string => {
  const messageList = messages[type];
  let finalMessage = messageList[Math.floor(Math.random() * messageList.length)];

  if (type === 'levelUp' && rank) {
    finalMessage += ` Você agora é um ${rank}!`;
  }
  
  return finalMessage;
}; 