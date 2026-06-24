# BRIEFING — LP Variante "Começar do Zero / Investir em um Novo Negócio"

> Documento de partida para construir a nova landing page. Cole isto no início da sessão do Claude Code aberta **nesta pasta** (`D:\Plataformas - DEV\Carlos\empresarios-que-querem-comecar-do-zero`).

---

## 🎯 Objetivo

Criar uma **segunda landing page** (variante) para o evento do Carlos, voltada a um público **diferente** da LP atual:

- **LP atual** (`remix-of-evento-carlos-02`): fala com **empresários que já têm negócio** e querem escalar.
- **Esta variante**: fala com quem quer **começar / investir em um novo negócio** (iniciante, investidor, quem busca nova fonte de renda).

É um **deploy independente** (repo git próprio + projeto Vercel próprio / rota ou domínio próprio). Não deve compartilhar histórico com a LP atual.

---

## 📅 Dados do evento (idênticos à LP atual)

- **Nome:** Fórum Novo Comércio 2026
- **Data:** 21 de Agosto de 2026 (`EVENT_DATE = new Date("2026-08-21T10:00:00")`)
- **Local:** São Paulo, SP — presencial
- **Horário:** 10h às 18h (1 dia intensivo, ~8h de imersão)
- **Palestrante principal:** Carlos Arantes — CEO da UseVertice e CTA Marketing. +10 anos no mercado digital; foi à China validar fornecedores; ajudou empresários do zero ao 1º milhão. (Instagram: @carlosarantesm)

---

## 🧱 Ponto de partida técnico (REUTILIZAR, não começar do zero)

A LP atual fica em: `D:\Plataformas - DEV\Carlos\LP - 09_04\remix-of-evento-carlos-02`

Stack: **Vite + React 18 + TypeScript + Tailwind + shadcn/ui + framer-motion**.
Já vem pronto: identidade dourada, formulário multi-step com qualificação, countdown, VSL/vídeo, seções animadas, integração de Lead (fbq + envio de dados).

**Plano recomendado:** copiar a estrutura do projeto atual como base e **reescrever apenas a copy/seções** para o novo público. Itens a copiar:
- `package.json`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig*`, `postcss.config.js`, `index.html`
- `src/index.css` (já contém a identidade dourada — ver paleta abaixo)
- `src/components/ui/*` (shadcn — reuso integral)
- `src/pages/Index.tsx` e `Obrigado.tsx` como **molde** de layout/animações (reescrever textos)

> ⚠️ Ao copiar: **não** copiar `.git/`, `node_modules/`, nem os assets/screenshots soltos. Iniciar um `git init` novo e criar repo + projeto Vercel próprios.

---

## 🎨 Identidade visual (dourado #d4af37) — JÁ DEFINIDA

Manter a mesma identidade da LP atual para consistência de marca. Tokens (em `src/index.css`, `:root`):

```css
/* Brand gold #d4af37 = hsl(46 65% 52%) */
--primary: 46 65% 52%;
--primary-foreground: 40 60% 6%;
--accent: 44 78% 58%;
--ring: 46 65% 52%;

/* Rampa metálica: champagne -> ouro -> bronze */
--gold-champagne: 46 82% 75%;
--gold-light:     46 75% 61%;
--gold:           46 65% 52%;
--gold-amber:     43 89% 38%;
--gold-bronze:    43 66% 32%;
```

- **Fundo:** quase-preto (`0 0% 4%`). Preto + ouro = luxo/autoridade.
- **Gradiente de CTA (ouro escovado):** `from-[#b8860b] via-[#d4af37] to-[#f4df8e]` com texto escuro.
- **Glows/orbes:** dourados — `rgba(212,175,55, …)` (NUNCA verde `rgba(0,230,118)` nem azul).
- `text-gradient` = champanhe → ouro; `text-gradient-gold` = cobre/âmbar (segundo tom quente).

---

## 📄 A copy da analista (fonte da verdade para esta variante)

PDF original nesta mesma pasta: `LANDING PAGE - PÚBLICO QUE DESEJA INVESTIR EM UM NOVO NEGÓCIO.pdf`

### Estrutura do funil que ela propôs (usar como esqueleto das seções)

1. **Big Idea / Hero** — "A nova era dos negócios digitais começou." O **mercado oculto/invisível** dos marketplaces que movimenta bilhões e quase ninguém entende.
2. **Mudança de comportamento** — "As pessoas não procuram mais lojas. Elas procuram marketplaces."
3. **Prova com dados (COM FONTES)** — diferencial de credibilidade:
   - ~80% das vendas online do Brasil são em marketplaces
   - 85%+ dos brasileiros que compram online já compraram em marketplaces
   - E-commerce brasileiro ~R$ 450 bilhões em 2025
   - Mercado Livre: dezenas de milhões de usuários ativos
   - **Fontes:** E-Commerce Brasil, BXTData (GMV/marketshare), E-Commerce Update, Exame (ranking), FGV IBRE (indicador de vendas online)
4. **Quebra de objeção** — "Você NÃO precisa:" aparecer nas redes, virar influencer, gravar vídeos todo dia, dominar tráfego pago, investir fortunas em anúncios, depender de seguidores.
5. **Mecanismo único** — Marketplaces já têm **"TRÁFEGO PRONTO"**: o cliente já está lá. Foco é Estratégia, Produto certo, Posicionamento, Escala, Estrutura, Operação inteligente.
6. **Para quem é** — nova fonte de renda / empresários expandindo p/ digital / investidores / quem quer escalar / aprender com operadores reais.
7. **O que vai descobrir** — ecossistema dos marketplaces; achar oportunidades; estruturar operação profissional; vender em escala; crescer sem aparecer; estratégias validadas.
8. **Urgência** — "O momento é agora." Quem entra cedo constrói vantagem. Vagas limitadas.
9. **CTA** — "[QUERO PARTICIPAR DO EVENTO]"

---

## ⭐ 3 elementos de MAIOR impacto a herdar dela (prioridade)

1. **Seção de dados de mercado COM FONTES citadas** — maior ganho de credibilidade; a LP atual tem stats genéricos sem fonte.
2. **Bloco de quebra de objeção** ("Você NÃO precisa…") — destrava o público iniciante; não existe na LP atual.
3. **Mecanismo "Tráfego Pronto"** — ângulo forte e ausente na LP atual.

---

## 🔴 Contradição a RESOLVER

A copy dela vende *"você não precisa de tráfego pago / não precisa investir fortunas em anúncios"*.
A LP atual tem o módulo **"Tráfego Pago & Funis — Meta Ads & Google Ads"**.

➡️ Para este público, **remover ou reposicionar** esse módulo (ex.: tratar como "avançado/opcional", depois que a operação no marketplace estiver de pé). Não deixar o gancho "sem anúncios" brigar com um módulo de anúncios.

---

## ➕ Pontos fortes da LP atual a NÃO perder (a analista omitiu)

A copy dela é forte em narrativa/dados, mas ignora ativos que convertem:
- **História do Carlos** (10 anos, foi à China, do zero ao 1º milhão) → autoridade/prova social.
- Ângulo **importação da China + marca própria com margem 300%**.
- **Palestrantes / quem estará no palco.**

➡️ **Fundir:** estrutura + dados dela **com** prova + autoridade da LP atual.

---

## ✅ Checklist de execução (sugestão para o novo terminal)

- [ ] Copiar base do projeto atual (sem `.git`, `node_modules`, assets soltos)
- [ ] `git init` + novo repositório no GitHub
- [ ] `npm install` e validar `npm run dev`
- [ ] Confirmar identidade dourada herdada (tokens + sem verde residual)
- [ ] Reescrever Hero com a Big Idea "mercado oculto dos marketplaces"
- [ ] Criar seção **Dados de Mercado com fontes**
- [ ] Criar bloco **"Você NÃO precisa…"** (quebra de objeção)
- [ ] Criar seção **"Tráfego Pronto"** (mecanismo)
- [ ] Resolver módulo de tráfego pago (remover/reposicionar)
- [ ] Manter história do Carlos + palestrantes + (decidir) ângulo China
- [ ] Ajustar formulário/qualificação para público iniciante/investidor
- [ ] Atualizar metadados (título, OG, pixel/eventos) p/ a nova LP
- [ ] Deploy independente na Vercel (rota/domínio próprio)

---

## 📌 Notas

- Data já corrigida para **21/08/2026** na LP atual — usar a mesma aqui.
- Identidade dourada (#d4af37) já é a oficial — manter por consistência de marca.
- Esta variante é para **testar dois públicos em paralelo** (empresário x iniciante/investidor), não substitui a LP atual.
