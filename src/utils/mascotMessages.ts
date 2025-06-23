import { ranks } from './stats';

export type MessageType = 
  'welcome' | 'win' | 'loss' | 'levelUp' | 'generic' |
  'firstGuessFlop' | 'lastAttempt' | 'clutchWin' | 'flawlessWin' |
  'usedSpell' | 'duplicateGuess' | 'invalidWord' | 'foundPresent' | 'makingProgress' |
  'oneLetterAway' | 'anotherBadGuess' |
  'duetoWelcome' | 'duetoWin' | 'duetoPartialWin' | 'duetoLoss' | 'duetoProgress' |
  'duetoInvalidWord' | 'duetoDuplicateGuess' | 'duetoFirstGuessFlop' | 'duetoAnotherBadGuess' | 'duetoLastAttempt' |
  'tetraWelcome' | 'tetraWin' | 'tetraPartialWin' | 'tetraLoss' | 'tetraProgress' |
  'tetraInvalidWord' | 'tetraDuplicateGuess' | 'tetraFirstGuessFlop' | 'tetraAnotherBadGuess' | 'tetraLastAttempt';

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
  ],
  // Mensagens específicas para o modo Dueto (Abracadupla)
  duetoWelcome: [
    "Ah, o modo Abracadupla! Duas palavras para decifrar. Sua mente está preparada para o desafio duplo?",
    "Duas palavras, uma mente. O teste de hoje requer foco dividido. Não se perca entre os enigmas.",
    "Bem-vindo ao reino das palavras gêmeas. Cada palpite afeta ambas as palavras. Use essa sabedoria.",
    "Duas palavras aguardam sua mente. Será que consegue manter o controle de ambas?",
    "O modo Abracadupla testa não só sua sabedoria, mas sua capacidade de multitarefa mágica.",
  ],
  duetoWin: [
    "Incrível! Você dominou ambas as palavras! A magia dupla flui através de você.",
    "Duas vitórias em uma! Sua mente é capaz de controlar múltiplos feitiços simultaneamente.",
    "Perfeito! Você provou que pode lidar com mais de um enigma por vez. Impressionante.",
    "Vitória dupla! A magia das palavras gêmeas reconhece seu domínio.",
  ],
  duetoPartialWin: [
    "Uma palavra conquistada! A outra ainda resiste. Continue a batalha.",
    "Meio caminho andado! Uma palavra caiu, mas a segunda ainda desafia sua mente.",
    "Bom progresso! Uma palavra decifrada. A segunda aguarda sua próxima tentativa.",
    "Você está no caminho certo! Uma palavra resolvida, uma ainda por resolver.",
  ],
  duetoLoss: [
    "Ambas as palavras resistiram. O modo Abracadupla é cruel com os despreparados.",
    "Duas derrotas. Talvez seja melhor dominar uma palavra antes de tentar duas.",
    "As palavras gêmeas venceram hoje. A magia dupla requer prática dupla.",
    "Derrota dupla. O modo Abracadupla não perdoa mentes divididas.",
  ],
  duetoProgress: [
    "Está progredindo em ambas as palavras! A magia dupla responde ao seu toque.",
    "Bom trabalho! Vejo progresso em ambas as palavras. Continue assim.",
    "Excelente! Você está desvendando os segredos das palavras gêmeas.",
    "A magia dupla está funcionando! Ambas as palavras revelam seus segredos.",
  ],
  // Mensagens ácidas específicas para o modo Dueto
  duetoInvalidWord: [
    "Isso não é uma palavra. É um amontoado de letras. E você tem duas palavras para decifrar, não uma.",
    "Meu dicionário arcano não reconhece esse termo. E ele conhece todos. Duas palavras, uma mente confusa.",
    "Você está inventando palavras? Deixe isso para os bardos. Foque nas duas palavras reais que aguardam.",
    "Palavra inválida. Com duas palavras para resolver, você não pode se dar ao luxo de inventar.",
  ],
  duetoDuplicateGuess: [
    "Você já tentou essa palavra. A memória é uma ferramenta mágica, sabe? Especialmente com duas palavras.",
    "Tentar a mesma coisa esperando um resultado diferente? Que conceito... *humano*. Duas palavras, mesma confusão.",
    "Olá? Eco? Já vimos essa palavra antes. E você tem duas palavras para resolver, não uma.",
    "Palavra repetida. Com duas palavras diferentes, você deveria ter mais opções criativas.",
  ],
  duetoFirstGuessFlop: [
    "Um começo... humilde. Para dizer o mínimo. Duas palavras, nenhuma letra correta.",
    "Nenhuma letra? Audacioso. E completamente errado. Duas palavras desafiam sua mente.",
    "Isso foi um palpite ou um espirro no teclado? Duas palavras aguardam uma abordagem melhor.",
    "Primeira tentativa, zero acertos. Duas palavras, uma mente perdida.",
  ],
  duetoAnotherBadGuess: [
    "Ainda nenhuma letra... Você está tentando adivinhar ou me irritar? Duas palavras, zero progresso.",
    "Sério? Outra vez? Todas as letras erradas. De novo. Duas palavras, uma estratégia falha.",
    "Estou começando a achar que você está fazendo isso de propósito. Duas palavras, uma mente teimosa.",
    "Nenhuma letra correta. Duas palavras, uma abordagem questionável.",
  ],
  duetoLastAttempt: [
    "Sua última chance. Sem pressão. Duas palavras, uma tentativa final.",
    "Tudo ou nada. A magia observa seu movimento final. Duas palavras, um momento decisivo.",
    "Este é o momento da verdade. Ou da vergonha. Veremos. Duas palavras, uma última oportunidade.",
    "Última tentativa. Duas palavras, uma chance final de redenção.",
  ],
  // Mensagens específicas para o modo Tetra (Abracatetra)
  tetraWelcome: [
    "O modo Abracatetra! Quatro palavras para dominar. Sua mente está pronta para o caos controlado?",
    "Quatro enigmas, uma mente. O teste supremo de concentração mágica começa agora.",
    "Bem-vindo ao reino das palavras quádruplas. Cada palpite afeta quatro palavras. Boa sorte.",
    "Quatro palavras aguardam. Este é o teste final de sua maestria mágica.",
    "O modo Abracatetra é para os verdadeiros mestres. Você se considera digno?",
  ],
  tetraWin: [
    "Incrível! Você dominou todas as quatro palavras! A magia quádrupla é sua!",
    "Vitória quádrupla! Você provou ser um verdadeiro mestre das palavras.",
    "Perfeito! Quatro palavras, quatro vitórias. A magia suprema flui através de você.",
    "Dominância total! Você conquistou o modo Abracatetra. Um feito lendário.",
  ],
  tetraPartialWin: [
    "Progresso sólido! Algumas palavras caíram, outras ainda resistem. Continue a batalha.",
    "Bom trabalho! Você está desvendando os segredos das palavras quádruplas.",
    "Excelente progresso! As palavras estão caindo uma a uma. Continue assim.",
    "Você está no caminho certo! A magia quádrupla responde ao seu comando.",
  ],
  tetraLoss: [
    "As quatro palavras resistiram. O modo Abracatetra é o teste supremo.",
    "Derrota quádrupla. Talvez seja melhor praticar com menos palavras primeiro.",
    "As palavras quádruplas venceram. Este modo não é para os fracos de espírito.",
    "Quatro derrotas. O modo Abracatetra requer maestria absoluta.",
  ],
  tetraProgress: [
    "Está progredindo em múltiplas palavras! A magia quádrupla está funcionando.",
    "Bom trabalho! Vejo progresso em várias palavras simultaneamente.",
    "Excelente! Você está controlando a magia de quatro palavras ao mesmo tempo.",
    "A magia quádrupla responde ao seu toque! Continue desvendando os segredos.",
  ],
  // Mensagens ácidas específicas para o modo Tetra
  tetraInvalidWord: [
    "Isso não é uma palavra. É um amontoado de letras. E você tem quatro palavras para decifrar.",
    "Meu dicionário arcano não reconhece esse termo. E ele conhece todos. Quatro palavras, uma mente perdida.",
    "Você está inventando palavras? Deixe isso para os bardos. Foque nas quatro palavras reais.",
    "Palavra inválida. Com quatro palavras para resolver, você não pode se dar ao luxo de inventar.",
  ],
  tetraDuplicateGuess: [
    "Você já tentou essa palavra. A memória é uma ferramenta mágica, sabe? Especialmente com quatro palavras.",
    "Tentar a mesma coisa esperando um resultado diferente? Que conceito... *humano*. Quatro palavras, mesma confusão.",
    "Olá? Eco? Já vimos essa palavra antes. E você tem quatro palavras para resolver.",
    "Palavra repetida. Com quatro palavras diferentes, você deveria ter mais opções criativas.",
  ],
  tetraFirstGuessFlop: [
    "Um começo... humilde. Para dizer o mínimo. Quatro palavras, nenhuma letra correta.",
    "Nenhuma letra? Audacioso. E completamente errado. Quatro palavras desafiam sua mente.",
    "Isso foi um palpite ou um espirro no teclado? Quatro palavras aguardam uma abordagem melhor.",
    "Primeira tentativa, zero acertos. Quatro palavras, uma mente perdida.",
  ],
  tetraAnotherBadGuess: [
    "Ainda nenhuma letra... Você está tentando adivinhar ou me irritar? Quatro palavras, zero progresso.",
    "Sério? Outra vez? Todas as letras erradas. De novo. Quatro palavras, uma estratégia falha.",
    "Estou começando a achar que você está fazendo isso de propósito. Quatro palavras, uma mente teimosa.",
    "Nenhuma letra correta. Quatro palavras, uma abordagem questionável.",
  ],
  tetraLastAttempt: [
    "Sua última chance. Sem pressão. Quatro palavras, uma tentativa final.",
    "Tudo ou nada. A magia observa seu movimento final. Quatro palavras, um momento decisivo.",
    "Este é o momento da verdade. Ou da vergonha. Veremos. Quatro palavras, uma última oportunidade.",
    "Última tentativa. Quatro palavras, uma chance final de redenção.",
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