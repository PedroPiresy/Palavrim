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
