# Sistema de Fontes - Palavrim

## Visão Geral

O projeto Palavrim utiliza um sistema de fontes padronizado para garantir consistência visual e melhor experiência do usuário.

## Fontes Principais

### 1. Inter (Fonte Sans-Serif)
- **Uso**: Texto geral, interface, títulos, parágrafos
- **Pesos**: 300, 400, 500, 600, 700, 800
- **Classe Tailwind**: `font-sans` (padrão)
- **Fallbacks**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### 2. JetBrains Mono (Fonte Monospace)
- **Uso**: Código, comandos, teclado, células do jogo, elementos técnicos
- **Pesos**: 400, 500, 600, 700
- **Classe Tailwind**: `font-mono`
- **Fallbacks**: Fira Code, Consolas, Monaco, monospace

## Classes Tailwind Disponíveis

```css
/* Fontes */
.font-sans     /* Inter + fallbacks */
.font-mono     /* JetBrains Mono + fallbacks */
.font-display  /* Inter para elementos de destaque */

/* Pesos */
.font-light    /* 300 */
.font-normal   /* 400 */
.font-medium   /* 500 */
.font-semibold /* 600 */
.font-bold     /* 700 */
.font-extrabold /* 800 */
```

## Diretrizes de Uso

### Quando usar Inter (font-sans):
- Texto geral da interface
- Títulos e subtítulos
- Parágrafos e descrições
- Botões e links
- Modais e popups
- Estatísticas e informações

### Quando usar JetBrains Mono (font-mono):
- Teclas do teclado virtual
- Células da grade do jogo
- Comandos e atalhos
- Código ou elementos técnicos
- Timers e contadores
- Elementos que precisam de alinhamento preciso

## Exemplos de Implementação

```tsx
// Texto geral
<p className="font-sans text-base">Texto normal da interface</p>

// Título
<h1 className="font-sans font-bold text-2xl">Título Principal</h1>

// Tecla do teclado
<button className="font-mono font-semibold">A</button>

// Célula do jogo
<div className="font-mono font-bold text-xl">L</div>

// Timer
<span className="font-mono font-bold text-purple-400">01:30</span>
```

## Performance

- As fontes são pré-carregadas para melhor performance
- Fallbacks garantem que o texto seja exibido mesmo se as fontes principais falharem
- Pesos específicos são carregados conforme necessário

## Responsividade

O sistema de fontes funciona bem em todos os tamanhos de tela:
- **Mobile**: Fontes se ajustam automaticamente
- **Tablet**: Mantém legibilidade
- **Desktop**: Aproveita melhor a qualidade das fontes

## Acessibilidade

- Alto contraste mantido
- Tamanhos de fonte adequados para leitura
- Suporte a redução de movimento
- Fallbacks para diferentes sistemas operacionais 