# 🧙‍♂️ Palavrim

Palavrim é uma releitura moderna do clássico jogo de adivinhar palavras, inspirado em jogos como Wordle e Termo. Desenvolvido com React, Vite, TypeScript e Tailwind CSS, oferece uma experiência de jogo fluida, responsiva e visualmente agradável.

<p align="center">
  <img src="public/assets/images/Palavrim.png" alt="Logo do Palavrim" width="200" />
</p>

[![Deploy Vercel](https://img.shields.io/badge/deploy-vercel-brightgreen?logo=vercel)](https://palavrim.vercel.app)
[![API Online](https://img.shields.io/badge/api-onrender-blue?logo=dotnet)](https://palavrimapi.onrender.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

---

## 🎮 Demonstração

- 👉 [Jogue agora!](https://palavrim.vercel.app)
- 🌍 [API Online](https://palavrimapi.onrender.com)

---

## ✨ Funcionalidades

- **Modo Clássico**: Adivinhe a palavra do dia em até 6 tentativas
- **Speed Run**: Teste sua velocidade com cronômetro integrado
- **Modos Avançados**:
  - **Dueto (Abracadupla)**: Adivinhe duas palavras simultaneamente
  - **Quarteto (Abracatetra)**: Desafie-se com quatro palavras ao mesmo tempo
- **Estatísticas Locais**: Progresso salvo no navegador com gráficos de distribuição
- **Integração Wiktionary**: Visualize o significado das palavras descobertas
- **Modo Terminal Vim**:
  - `Shift + :` para ativar comandos
  - `q!` para reiniciar o jogo
  - `admin` para revelar a resposta (modo desenvolvedor)
- **Interface Moderna**: Design minimalista com tema escuro e componentes responsivos

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

- [ ] Testes automatizados (Jest + React Testing Library)
- [ ] Melhorias na responsividade mobile
- [ ] Novos modos de jogo
- [ ] Sistema de conquistas
- [ ] Modo multiplayer

---

Divirta-se jogando Palavrim! 🎉
