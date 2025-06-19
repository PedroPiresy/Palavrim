//const API_BASE_URL = 'http://localhost:5134'; // Ajuste para sua URL da API
const API_BASE_URL = 'https://palavrimapi.onrender.com';
let palavraAtual: string = '';

export const api = {
  async getTamanho(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/tamanho`);
      if (!response.ok) throw new Error('Erro ao buscar tamanho da palavra');
      const data = await response.json();
      return data.tamanho || 5; // Default para 5 se não retornar
    } catch (error) {
      console.error('Erro na API getTamanho:', error);
      return 5; // Fallback
    }
  },

  async getPalavraDoDia(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/palavra-do-dia`);
      if (!response.ok) throw new Error('Erro ao buscar palavra do dia');
      const data = await response.json();
      return data.palavra?.toUpperCase() || 'PALAVRA'; // Default
    } catch (error) {
      console.error('Erro na API getPalavraDoDia:', error);
      return 'PALAVRA'; // Fallback
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

  async verificarPalavra(palavra: string): Promise<{ existe: boolean; estados: ('correct' | 'present' | 'absent')[] }> {
    try {
      // Primeiro verifica se a palavra existe no dicionário
      const responsePrefixo = await fetch(`${API_BASE_URL}/prefixo/${palavra.toLowerCase()}`);
      if (!responsePrefixo.ok) return { existe: false, estados: [] };
      const palavras = await responsePrefixo.json();
      const palavraExiste = palavras.some((p: string) => 
        p.toUpperCase() === palavra.toUpperCase()
      );

      if (!palavraExiste) {
        return { existe: false, estados: [] };
      }

      // Se não tiver palavra atual, busca uma
      if (!palavraAtual) {
        await this.getPalavraAleatoria();
      }
      
      // Se as palavras tiverem tamanhos diferentes, retorna erro
      if (palavra.length !== palavraAtual.length) {
        return { existe: false, estados: [] };
      }

      // Conta as ocorrências de cada letra na palavra correta
      const contagemLetras: { [key: string]: number } = {};
      palavraAtual.split('').forEach((letra: string) => {
        contagemLetras[letra] = (contagemLetras[letra] || 0) + 1;
      });

      // Primeiro passo: marca as letras corretas
      const estados: ('correct' | 'present' | 'absent')[] = [];
      const letrasUsadas: { [key: number]: boolean } = {};

      // Marca as letras corretas primeiro
      palavra.split('').forEach((letra, index) => {
        if (letra === palavraAtual[index]) {
          estados[index] = 'correct';
          letrasUsadas[index] = true;
          contagemLetras[letra]--;
        }
      });

      // Segundo passo: marca as letras presentes mas em posição errada
      palavra.split('').forEach((letra, index) => {
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