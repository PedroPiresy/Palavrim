# 🧙‍♂️ Palavrim

Palavrim é uma releitura moderna do clássico jogo de adivinhar palavras, inspirado em jogos como Wordle e Termo. Desenvolvido com React, Vite, TypeScript e Tailwind CSS, oferece uma experiência de jogo fluida, responsiva e visualmente agradável, agora com total suporte para dispositivos móveis.

<p align="center">
  <img src="public/assets/images/Palavrim.png" alt="Logo do Palavrim" width="200" />
</p>

[![Deploy Vercel](https://img.shields.io/badge/deploy-vercel-brightgreen?logo=vercel)](https://palavrim.vercel.app)
[![API Online](https://img.shields.io/badge/api-onrender-blue?logo=dotnet)](https://palavrimapi.onrender.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

---

## 📸 Visão Geral

<p align="center">
   <img src="https://github.com/user-attachments/assets/65ca7050-1a38-4f99-b19c-8e62bf31d355" alt="Screenshot do Palavrim no Desktop" width="90%">
  <br>
  <em>Versão para Desktop</em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/00057919-b6f2-472b-a3aa-d651062e489f" alt="Screenshot do Palavrim no Mobile" width="35%">
 <br>
  <em>Versão para Mobile</em>
</p>

---

## 🎮 Como Jogar

- 👉 [Jogue agora!](https://palavrim.vercel.app)
- 🌍 [API Online](https://palavrimapi.onrender.com)

---

## ✨ Funcionalidades

- **🔮 Modos de Jogo Variados**:
  - **Clássico**: Adivinhe a palavra do dia em até 6 tentativas.
  - **Speed Run**: Teste sua velocidade com um cronômetro.
  - **Dueto (Abracadupla)**: Adivinhe duas palavras simultaneamente.
  - **Quarteto (Abracatetra)**: Desafie-se com quatro palavras ao mesmo tempo.
- **📊 Estatísticas Detalhadas**: Acompanhe seu progresso com gráficos e dados salvos localmente.
- **🪄 Livro de Feitiços (Power-Ups)**: Use feitiços como "Revelar Letra" para te ajudar nos desafios.
- **🧙 Mascote Interativo**: Receba dicas e mensagens do nosso mago mascote.
- **📚 Integração com Wiktionary**: Descubra o significado das palavras que você acertar.
- **⌨️ Modo Terminal Vim**: Para os entusiastas de terminal, com comandos como `q!` e `admin`.
- **📱 Design Responsivo**: Interface moderna e fluida que se adapta perfeitamente a desktops e dispositivos móveis.

---

## 🚀 Tecnologias

**Frontend:**
- [React](https://reactjs.org/) - Biblioteca JavaScript para interfaces
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado do JavaScript
- [Vite](https://vitejs.dev/) - Build tool moderna e rápida
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Lucide React](https://lucide.dev/) - Biblioteca de ícones

**Backend:**
- [C#](https://docs.microsoft.com/dotnet/csharp/) e [ASP.NET](https://dotnet.microsoft.com/apps/aspnet) - API

**Deploy:**
- [Vercel](https://vercel.com/) - Frontend
- [Render](https://render.com/) - API

---

## ⚙️ Ambiente

**Pré-requisitos:**
- Node.js >= 18.x
- npm >= 9.x

**Variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Desenvolvimento
VITE_API_BASE_URL=http://localhost:5134

# Produção
VITE_API_BASE_URL=https://palavrimapi.onrender.com
```

---

## 🖥️ Como Executar Localmente

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
   Crie o arquivo `.env.local` conforme descrito acima

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse o jogo:**
   Abra `http://localhost:5173` no seu navegador

---

## 🗂️ Estrutura do Projeto

```
Palavrim/
├── public/
│   └── assets/images/
├── src/
│   ├── components/          # Componentes React
│   │   ├── GameHeader.tsx   # Cabeçalho com navegação
│   │   ├── GameGrid.tsx     # Grade de palavras
│   │   ├── Keyboard.tsx     # Teclado virtual
│   │   ├── StatsModal.tsx   # Modal de estatísticas
│   │   └── HelpModal.tsx    # Modal de ajuda
│   ├── hooks/
│   │   └── useGame.ts       # Lógica principal do jogo
│   ├── types/
│   │   └── game.ts          # Definições TypeScript
│   └── utils/
│       ├── api.ts           # Comunicação com API
│       └── stats.ts         # Gerenciamento de estatísticas
├── .env.local              # Variáveis de ambiente
├── package.json
└── README.md
```

---

## ☁️ Deploy

O deploy é automatizado via Vercel. Para deploy manual:

```bash
npm run build
# Upload da pasta dist/ para seu serviço de hospedagem
```

---

## 🛣️ Roadmap

- [x] Melhorias na responsividade mobile
- [ ] Testes automatizados (Jest + React Testing Library)
- [ ] Novos modos de jogo
- [ ] Sistema de conquistas
- [ ] Modo multiplayer

---

Divirta-se jogando Palavrim! 🎉
