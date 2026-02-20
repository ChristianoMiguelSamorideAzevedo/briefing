# 📋 Briefing de Projeto Digital

Formulário dinâmico multi-step para coleta de briefing de clientes.  
Desenvolvido com HTML, CSS e JavaScript puros — sem dependências externas.

## 🚀 Como publicar no GitHub Pages

### Passo 1 — Criar repositório
1. Acesse [github.com/new](https://github.com/new)
2. Nome sugerido: `briefing` ou `meu-briefing`
3. Deixe **Public** e clique em **Create repository**

### Passo 2 — Fazer upload dos arquivos
Faça upload dos 3 arquivos na raiz do repositório:
```
index.html
style.css
script.js
```

### Passo 3 — Ativar GitHub Pages
1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione **Deploy from a branch**
3. Branch: `main` | Pasta: `/ (root)`
4. Clique em **Save**

### Passo 4 — Acessar o link
Após ~1 minuto, seu formulário estará disponível em:
```
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
```

Esse é o link que você envia para os clientes! 🎉

## 📁 Estrutura dos arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Estrutura completa do formulário (7 etapas) |
| `style.css`  | Todo o visual — paleta, animações, responsivo |
| `script.js`  | Lógica — navegação, validação, revisão, download |

## 🎨 Personalização rápida

### Trocar as cores (em `style.css`):
```css
:root {
  --purple-vibrant: #7B3FA0; /* Roxo principal */
  --teal:           #04B3B9; /* Turquesa de destaque */
  --purple-deep:    #1E102B; /* Fundo escuro */
}
```

### Trocar seu nome/marca (em `index.html`):
Busque por `"Briefing de Projeto Digital"` e substitua pelo nome da sua empresa.

### Adicionar envio por e-mail:
Integre com [Formspree](https://formspree.io) ou [EmailJS](https://emailjs.com) no `script.js`, na função `submitForm()`.

## ✅ Funcionalidades incluídas

- 7 etapas de formulário com validação
- Cursor personalizado animado
- Partículas interativas no fundo
- Barra de progresso
- Seleção visual de tipo de projeto
- Grade de funcionalidades (checkboxes)
- Painel de revisão completo
- Download do briefing em .txt
- Responsivo para mobile
- Máscara de telefone automática
- Navegação por teclado (Enter / ←)
- Toast notifications
- Salva os dados no localStorage

---
Criado por **Miguel Samori** — Desenvolvedor Full Stack
