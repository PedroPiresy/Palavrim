# 🧙‍♂️ Palavrim

Palavrim é uma releitura moderna e cheia de funcionalidades do clássico jogo de adivinhar palavras, inspirado em jogos como Wordle e Termo. Desenvolvido com React, Vite, TypeScript e Tailwind CSS, ele oferece uma experiência de jogo fluida, responsiva e visualmente agradável.

![Palavrim Screenshot](https://i.imgur.com/example.png) 
*Substitua o link acima pela captura de tela do seu projeto.*

## ✨ Funcionalidades Principais

- **Modo de Jogo Clássico**: Adivinhe a palavra do dia em até 6 tentativas.
- **Modo Speed Run**: Teste sua velocidade! Um cronômetro registra o seu tempo para resolver o desafio o mais rápido possível.
- **Modos de Jogo Múltiplos**:
  - **Dueto (Abracadupla)**: Adivinhe duas palavras simultaneamente.
  - **Quarteto (Abracatetra)**: Desafie-se a adivinhar quatro palavras ao mesmo tempo.
- **Progresso Salvo no Navegador**:
  - Suas estatísticas de jogo são salvas localmente no seu navegador.
  - Acompanhe seu número de jogos, percentual de vitórias, sequência atual e melhor sequência.
  - Um gráfico de distribuição de tentativas mostra seu desempenho.
- **Integração com o Wiktionary**: Após descobrir a palavra, você pode ver seu significado diretamente no Wiktionary.
- **Modo Terminal Estilo Vim**:
  - Pressione `Shift + :` para ativar o modo de comando.
  - Use `q!` para reiniciar o jogo.
  - Use `admin` para ver a resposta (para fins de desenvolvimento).
- **Interface Moderna e Responsiva**:
  - Design limpo e minimalista, com tema escuro.
  - Componentes reutilizáveis e bem-estruturados.
  - Ícones da biblioteca `lucide-react`.

## 🚀 Tecnologias Utilizadas

- **Frontend**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

## 🛠️ Como Executar Localmente

Siga os passos abaixo para executar o projeto na sua máquina.

**Pré-requisitos:**
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/palavrim.git
    cd palavrim
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    *ou, se você usa Yarn:*
    ```bash
    yarn install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    *ou, com Yarn:*
    ```bash
    yarn dev
    ```

4.  **Abra no navegador:**
    Acesse `http://localhost:5173` (ou a porta indicada no seu terminal) para ver o jogo em ação.

## 📁 Estrutura dos Componentes

- **`src/components`**: Contém todos os componentes reutilizáveis da interface.
  - `GameHeader.tsx`: O cabeçalho da aplicação com os botões de navegação.
  - `GameGrid.tsx`: A grade onde as palavras são exibidas.
  - `Keyboard.tsx`: O teclado virtual para entrada de letras.
  - `StatsModal.tsx`: O modal que exibe as estatísticas do jogador.
  - `HelpModal.tsx`: O modal de ajuda com as instruções do jogo.
- **`src/hooks`**:
  - `useGame.ts`: O coração da lógica do jogo, gerenciando o estado, palpites e resultados.
- **`src/utils`**:
  - `api.ts`: Funções para se comunicar com a API (se houver).
  - `stats.ts`: Módulo para gerenciar o salvamento e carregamento das estatísticas no `localStorage`.
- **`src/types`**:
  - `game.ts`: Definições de tipos TypeScript usadas em toda a aplicação.

# 🎉 Palavrim

Bem-vindo ao **Palavrim**! Um jogo de adivinhação de palavras em português, inspirado no Wordle, mas com um toque brasileiro, modos extras e muita diversão! 🚀
<p align="center">
  <img src="public/assets/images/Palavrim.png" alt="Logo do Palavrim" width="200" />
</p>

[![Deploy Vercel](https://img.shields.io/badge/deploy-vercel-brightgreen?logo=vercel)](https://palavrim.vercel.app)
[![API Online](https://img.shields.io/badge/api-onrender-blue?logo=dotnet)](https://palavrimapi.onrender.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

---

## 📋 Sumário

- [Sobre](#sobre)
- [Demonstração](#demonstração)
- [Tecnologias](#tecnologias)
- [Ambiente](#ambiente)
- [Como rodar localmente](#como-rodar-localmente)
- [Testes](#testes)
- [Deploy](#deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)
- [Roadmap](#roadmap)

---

## 📝 Sobre

O **Palavrim** é um jogo de adivinhação de palavras em português, inspirado no Wordle, com modos extras, interface moderna e comandos estilo Vim. O objetivo é adivinhar a palavra secreta em até 6 tentativas, com feedback visual e dicionário nacional.

---

## 🎮 Demonstração

- 👉 [Jogue agora!](https://palavrim.vercel.app)
- 🌍 [API Online](https://palavrimapi.onrender.com)

---

## 🚀 Tecnologias

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/) (deploy)
- [C#](https://docs.microsoft.com/dotnet/csharp/) e [ASP.NET](https://dotnet.microsoft.com/apps/aspnet) (API)

---

## ⚙️ Ambiente

- Node.js >= 18.x
- npm >= 9.x
- API: [palavrimapi.onrender.com](https://palavrimapi.onrender.com) (ou local)

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
VITE_API_BASE_URL=http://localhost:5134
```

Para produção, use:

```
VITE_API_BASE_URL=https://palavrimapi.onrender.com
```

---

## 🖥️ Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/PedroPiresy/Palavrim.git
   cd Palavrim
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure o ambiente:**  
   Crie o arquivo `.env.local` conforme acima.
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:5173` no navegador.

---

## 🧪 Testes

> _Ainda não implementado._  
Sugestão: utilize [Jest](https://jestjs.io/) e [React Testing Library](https://testing-library.com/).

---

## ☁️ Deploy

O deploy é feito automaticamente via [Vercel](https://vercel.com/).  
Para deploy manual:

```bash
npm run build
# Faça upload da pasta dist/ para seu serviço de hospedagem
```

---

## 🗂️ Estrutura do Projeto

```
Palavrim/
  ├─ public/
  ├─ src/
  │   ├─ components/   # Componentes visuais e lógicos do jogo
  │   ├─ hooks/        # Hooks customizados de lógica
  │   ├─ types/        # Tipos TypeScript
  │   ├─ utils/        # Funções utilitárias e API
  ├─ index.html
  ├─ package.json
  └─ ...
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha nova feature'`
4. Push para o fork: `git push origin minha-feature`
5. Abra um Pull Request

Sinta-se à vontade para abrir issues ou PRs com sugestões, melhorias ou correções!

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📬 Contato

- Pedro Pires — [@PedroPiresy](https://github.com/PedroPiresy)
- Dúvidas, sugestões ou bugs? Abra uma issue!

---

## 🛣️ Roadmap

- [ ] Modo Abracadupla (Dueto)
- [ ] Modo Abracatetra (Quarteto)
- [ ] Responsividade para dispositivos móveis

Fique ligado para novidades e melhorias!
