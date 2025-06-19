# 🎉 Palavrim

Bem-vindo ao **Palavrim**! Um jogo de adivinhação de palavras em português, inspirado no Wordle, mas com um toque brasileiro, modos extras e muita diversão! 🚀
<p align="center">
  <img src="public/assets/images/Palavrim.png" alt="Logo do Palavrim" width="200" />
</p>

---

## 🌐 Jogue Agora!

- 👉 [Acesse o Palavrim na Web](https://palavrim.vercel.app)

---

## 🔗 API do Palavrim

- 🌍 [API Online](https://palavrimapi.onrender.com)
- 💻 [Repositório da API no GitHub](https://github.com/PedroPiresy/palavrim-api)

---

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [C#](https://docs.microsoft.com/dotnet/csharp/) e [ASP.NET](https://dotnet.microsoft.com/apps/aspnet) (na API)

---

## ✨ O que é o Palavrim?

O Palavrim é um jogo onde você precisa descobrir a palavra secreta em até 6 tentativas. Cada palpite recebe feedback colorido para ajudar na sua próxima jogada. O diferencial? Modos de jogo criativos, interface inspirada no Vim, consulta de significados e uma experiência visual moderna e animada!

---

## 🕹️ Principais Features

- 🔤 **Palavras em português**: Todas as palavras são validadas em um dicionário nacional.
- 📖 **Veja o significado**: Descubra o significado da palavra secreta direto no Wiktionary, sem sair do jogo!
- 🧑‍🤝‍🧑 **Modos de Jogo**:
  - **Normal**: O clássico, descubra a palavra do dia ou uma aleatória.
  - **Abracadupla (Dueto)**: Tente adivinhar duas palavras ao mesmo tempo!
  - **Abracatetra (Quarteto)**: O desafio supremo, quatro palavras simultâneas!
- 🟩 **Feedback visual**: Cores e animações indicam letras corretas, presentes ou ausentes.
- ⌨️ **Teclado virtual**: Digite com o mouse ou teclado físico.
- 🧙‍♂️ **Comandos estilo Vim**: Reinicie, veja respostas ou use atalhos secretos digitando comandos como `:q!`.
- 📱 **Layout responsivo**: Jogue no PC ou no celular, com visual moderno e efeitos de partículas.
- 🔔 **Notificações animadas**: Feedback divertido a cada jogada!
- 🗓️ **Palavra do dia**: Um novo desafio diário para todos os jogadores.

---

## 🚀 Como jogar localmente

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd Palavrim
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:5173` no seu navegador.

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
  │   └─ assets/       # Imagens e recursos
  ├─ index.html
  ├─ package.json
  └─ ...
```

---

## 💡 Exemplos de Interatividade

- **Descubra o significado:**
  Após o jogo, clique em "Ver significado no Wiktionary" para aprender mais sobre a palavra!
- **Use comandos secretos:**
  Digite `:q!` para reiniciar, ou `:admin` para ver a resposta (modo admin).
- **Experimente os modos extras:**
  Clique em "Abracadupla" ou "Abracatetra" no topo para desafios ainda mais insanos!

---

## 🤝 Contribua!
Sinta-se à vontade para abrir issues ou pull requests com sugestões, melhorias ou correções. Toda ajuda é bem-vinda!

---

## 📄 Licença
Este projeto está sob a licença MIT.
