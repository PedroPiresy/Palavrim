// Cache para armazenar palavras já consultadas e evitar requisições desnecessárias
const accentCache = new Map<string, string>();

/**
 * Remove acentos de uma string para comparação
 */
export function removerAcentosParaComparacao(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Busca a versão acentuada de uma palavra na API
 * @param palavraSemAcento - Palavra digitada pelo usuário (pode estar sem acento)
 * @returns Promise com a palavra acentuada ou a original se não encontrar
 */
export async function buscarPalavraAcentuada(palavraSemAcento: string): Promise<string> {
  // Normaliza a palavra para busca (sem acento, minúscula)
  const palavraNormalizada = removerAcentosParaComparacao(palavraSemAcento);
  
  // Verifica se já está no cache
  if (accentCache.has(palavraNormalizada)) {
    return accentCache.get(palavraNormalizada)!;
  }

  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    // Faz a requisição para buscar a palavra acentuada
    const response = await fetch(`${API_BASE_URL}/palavra-acentuada/${encodeURIComponent(palavraSemAcento.toLowerCase())}`);
    
    if (!response.ok) {
      // Se a API não encontrar ou der erro, usa a palavra original
      console.warn(`Não foi possível buscar acentuação para: ${palavraSemAcento}`);
      accentCache.set(palavraNormalizada, palavraSemAcento.toUpperCase());
      return palavraSemAcento.toUpperCase();
    }

    const data = await response.json();
    const palavraAcentuada = data.palavra || palavraSemAcento;
    
    // Armazena no cache e retorna em maiúscula (padrão do jogo)
    const resultado = palavraAcentuada.toUpperCase();
    accentCache.set(palavraNormalizada, resultado);
    
    return resultado;
    
  } catch (error) {
    console.error('Erro ao buscar palavra acentuada:', error);
    
    // Em caso de erro, usa a palavra original
    const fallback = palavraSemAcento.toUpperCase();
    accentCache.set(palavraNormalizada, fallback);
    return fallback;
  }
}

/**
 * Busca múltiplas palavras acentuadas de uma vez
 * @param palavras - Array de palavras para buscar acentuação
 * @returns Promise com array de palavras acentuadas
 */
export async function buscarPalavrasAcentuadas(palavras: string[]): Promise<string[]> {
  const promises = palavras.map(palavra => buscarPalavraAcentuada(palavra));
  return Promise.all(promises);
}

/**
 * Limpa o cache de acentuação (útil para testes ou reset)
 */
export function limparCacheAcentuacao(): void {
  accentCache.clear();
}

/**
 * Verifica se uma palavra já está no cache
 */
export function palavraEstaNoCacheAcentuacao(palavra: string): boolean {
  const palavraNormalizada = removerAcentosParaComparacao(palavra);
  return accentCache.has(palavraNormalizada);
}

/**
 * Obtém estatísticas do cache (para debug)
 */
export function getEstatisticasCache(): { tamanho: number; palavras: string[] } {
  return {
    tamanho: accentCache.size,
    palavras: Array.from(accentCache.keys())
  };
}