const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let palavraAtual: string = '';

export function removerAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const api = {
  async getTamanho(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/tamanho`);
      if (!response.ok) throw new Error('Erro ao buscar tamanho da palavra');
      const data = await response.json();
      return data.tamanho || 5;
    } catch (error) {
      console.error('Erro na API getTamanho:', error);
      return 5;
    }
  },

  async getPalavraDoDia(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/palavra-do-dia`);
      if (!response.ok) throw new Error('Erro ao buscar palavra do dia');
      const data = await response.json();
      return data.palavra?.toUpperCase() || 'PALAVRA';
    } catch (error) {
      console.error('Erro na API getPalavraDoDia:', error);
      return 'PALAVRA';
    }
  },

  async getPalavraAleatoria(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/palavra-aleatoria`);
      if (!response.ok) throw new Error('Erro ao buscar palavra aleatória');
      const palavra = await response.json();
      palavraAtual = palavra.toUpperCase();
      return palavraAtual;
    } catch (error) {
      console.error('Erro na API getPalavraAleatoria:', error);
      return 'PALAVRA';
    }
  },

  async getPalavraAcentuada(palavra: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/palavra-acentuada/${encodeURIComponent(palavra.toLowerCase())}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Erro ao buscar palavra acentuada');
      }
      const data = await response.json();
      return data.palavra || null;
    } catch (error) {
      console.error('Erro na API getPalavraAcentuada:', error);
      return null;
    }
  },

  async getPalavrasAcentuadas(palavras: string[]): Promise<Record<string, string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/palavras-acentuadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ palavras: palavras.map(p => p.toLowerCase()) }),
      });
      
      if (!response.ok) throw new Error('Erro ao buscar palavras acentuadas');
      const data = await response.json();
      return data.palavras || {};
    } catch (error) {
      console.error('Erro na API getPalavrasAcentuadas:', error);
      // Fallback: retorna as palavras originais
      const fallback: Record<string, string> = {};
      palavras.forEach(palavra => {
        fallback[palavra.toLowerCase()] = palavra;
      });
      return fallback;
    }
  },

  async verificarPalavra(palavra: string): Promise<{ existe: boolean; estados: ('correct' | 'present' | 'absent')[] }> {
    try {
      // Verifica se existe no dicionário
      const responseValida = await fetch(`${API_BASE_URL}/valida/${palavra.toLowerCase()}`);
      if (!responseValida.ok) return { existe: false, estados: [] };
      const palavraExiste = await responseValida.json();

      if (!palavraExiste) {
        return { existe: false, estados: [] };
      }

      // Busca palavra correta se não tiver ainda
      if (!palavraAtual) {
        await this.getPalavraAleatoria();
      }

      if (palavra.length !== palavraAtual.length) {
        return { existe: false, estados: [] };
      }

      // Usar versões normalizadas para comparação
      const entradaSemAcento = removerAcentos(palavra.toUpperCase());
      const corretaSemAcento = removerAcentos(palavraAtual);

      // Conta as ocorrências de cada letra (sem acento) da palavra correta
      const contagemLetras: { [key: string]: number } = {};
      corretaSemAcento.split('').forEach((letra: string) => {
        contagemLetras[letra] = (contagemLetras[letra] || 0) + 1;
      });

      const estados: ('correct' | 'present' | 'absent')[] = [];
      const letrasUsadas: { [key: number]: boolean } = {};

      // Primeiro: marca as letras corretas
      entradaSemAcento.split('').forEach((letra, index) => {
        if (letra === corretaSemAcento[index]) {
          estados[index] = 'correct';
          letrasUsadas[index] = true;
          contagemLetras[letra]--;
        }
      });

      // Segundo: marca as presentes na posição errada
      entradaSemAcento.split('').forEach((letra, index) => {
        if (!letrasUsadas[index]) {
          if (contagemLetras[letra] > 0) {
            estados[index] = 'present';
            contagemLetras[letra]--;
          } else {
            estados[index] = 'absent';
          }
        }
      });

      return {
        existe: true,
        estados
      };
    } catch (error) {
      console.error('Erro ao verificar palavra:', error);
      return { existe: false, estados: [] };
    }
  }
};