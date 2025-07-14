const accentCache = new Map<string, string>();

export function removerAcentosParaComparacao(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export async function buscarPalavraAcentuada(palavraSemAcento: string): Promise<string> {
  const palavraNormalizada = removerAcentosParaComparacao(palavraSemAcento);
  
  if (accentCache.has(palavraNormalizada)) {
    return accentCache.get(palavraNormalizada)!;
  }

  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    const response = await fetch(`${API_BASE_URL}/palavra-acentuada/${encodeURIComponent(palavraSemAcento.toLowerCase())}`);
    
    if (!response.ok) {
      console.warn(`Não foi possível buscar acentuação para: ${palavraSemAcento}`);
      accentCache.set(palavraNormalizada, palavraSemAcento.toUpperCase());
      return palavraSemAcento.toUpperCase();
    }

    const data = await response.json();
    const palavraAcentuada = data.palavra || palavraSemAcento;
    
    const resultado = palavraAcentuada.toUpperCase();
    accentCache.set(palavraNormalizada, resultado);
    
    return resultado;
    
  } catch (error) {
    console.error('Erro ao buscar palavra acentuada:', error);
    
    const fallback = palavraSemAcento.toUpperCase();
    accentCache.set(palavraNormalizada, fallback);
    return fallback;
  }
}

export async function buscarPalavrasAcentuadas(palavras: string[]): Promise<string[]> {
  const promises = palavras.map(palavra => buscarPalavraAcentuada(palavra));
  return Promise.all(promises);
}

export function limparCacheAcentuacao(): void {
  accentCache.clear();
}

export function palavraEstaNoCacheAcentuacao(palavra: string): boolean {
  const palavraNormalizada = removerAcentosParaComparacao(palavra);
  return accentCache.has(palavraNormalizada);
}

export function getEstatisticasCache(): { tamanho: number; palavras: string[] } {
  return {
    tamanho: accentCache.size,
    palavras: Array.from(accentCache.keys())
  };
}