# Roteiro de validação manual — Redesign TMCEL

**Referência:** `docs/registo-testes.md`  
**Âmbito:** testes **CAT**, **NAV**, **FASE5** e **REG** (interface no navegador + verificações documentais).  
**Data de preparação:** 2026-11-17  
**Validação concluída:** 2026-11-17 (19/19 Aprovado — confirmação do responsável pelo projecto)

> Após cada teste, copie **Resultado obtido** e **Estado** para `docs/registo-testes.md` e para o relatório académico.  
> **Estado dos 19 casos abaixo:** `Aprovado` — validação manual concluída no navegador (confirmação do responsável pelo projecto, 2026-11-17).

---

## Pré-requisitos gerais

1. Abrir terminal na raiz do projecto (`Redesign-TMCEL`).
2. Iniciar servidor local: `py -m http.server 8765` (no Windows, se `python` não existir, usar `py`).
3. Browser recomendado: Chrome, Edge ou Firefox (versão recente).
4. URL base: `http://127.0.0.1:8765/index.html`
5. Opcional: DevTools (F12) → Application → Local Storage → confirmar chave `tmcel_academico_catalogo_v1`.
6. Para testes CAT, começar com catálogo vazio ou anotar estado inicial; em dúvida, limpar a chave no DevTools antes da série CAT.

**Dados de teste sugeridos (não são ofertas TMCEL):**

| Uso | Nome | Categoria | Preço | Data |
|-----|------|-----------|-------|------|
| Item A | `Laboratório Alfa` | Dados / Internet móvel | 10 | 2026-03-01 |
| Item B | `Laboratório Beta` | Voz móvel | (vazio) | (vazio) |
| Item C | `Laboratório Gama` | Empresarial | 25 | 2026-06-15 |

---

## Secção CAT — Catálogo (interface e persistência)

### CAT-01 — Adicionar item válido

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-01 |
| **Objectivo** | Confirmar que o utilizador consegue criar um item de demonstração e que os dados persistem após recarregar a página. |

**Procedimento (passo a passo)**

1. Abrir `http://127.0.0.1:8765/index.html#servicos`.
2. Deslocar-se ao bloco «Catálogo de serviços (laboratório)».
3. No formulário «Adicionar item de demonstração», preencher Nome: `Laboratório Alfa` (≥2 caracteres).
4. Seleccionar Categoria: `Dados / Internet móvel`.
5. (Opcional) Preço: `10`; Data: `2026-03-01`.
6. Clicar **Adicionar item**.
7. Verificar a lista e a linha «A mostrar X de Y».
8. Premir **F5** (recarregar).
9. Confirmar que o item continua visível.
10. (Opcional) DevTools → Local Storage → valor JSON contém o item.

**Resultado esperado**

- Item aparece na lista com etiqueta «Exemplo académico».
- Contagem incrementada (ex.: «A mostrar 1 de 1»).
- Após F5, o item permanece.
- Dados persistidos em `tmcel_academico_catalogo_v1` (se `localStorage` disponível).

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-02 — Nome inválido

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-02 |
| **Objectivo** | Garantir que entradas inválidas (nome em falta ou demasiado curto) não criam itens e mostram feedback. |

**Procedimento (passo a passo)**

1. Abrir `#servicos` no catálogo (URL com âncora ou scroll).
2. Anotar o número actual de itens (contagem ou tamanho da lista).
3. **Cenário A:** deixar Nome vazio, seleccionar uma categoria, clicar **Adicionar item**.
4. Observar mensagens de erro junto aos campos e a região `aria-live` (se disponível).
5. **Cenário B:** Nome com 1 carácter (ex.: `X`), categoria válida, submeter de novo.
6. Confirmar que a lista não ganhou novos itens.

**Resultado esperado**

- Item não é adicionado.
- Mensagem de erro no campo Nome (ex.: mínimo 2 caracteres) e/ou validação HTML5.
- Contagem de itens inalterada.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-03 — Remover item

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-03 |
| **Objectivo** | Validar remoção com confirmação acessível e actualização do armazenamento. |

**Procedimento (passo a passo)**

1. Garantir que existe pelo menos um item (executar CAT-01 se necessário).
2. Clicar **Remover** no item «Laboratório Alfa» (ou equivalente).
3. Verificar abertura do diálogo «Confirmar remoção».
4. Clicar **Remover** no diálogo (confirmar).
5. Verificar ausência do item na lista e actualização da contagem.
6. (Opcional) DevTools → Local Storage → JSON sem o `id` removido.

**Resultado esperado**

- Diálogo visível antes da remoção; **Cancelar** não remove (teste opcional).
- Após confirmar, item desaparece.
- Feedback na região `aria-live` (se perceptível).

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-04 — Pesquisa na UI

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-04 |
| **Objectivo** | Confirmar filtro por texto no campo «Pesquisar por nome» (debounce ~200 ms). |

**Procedimento (passo a passo)**

1. Criar itens A, B e C (ver tabela de pré-requisitos) se ainda não existirem.
2. Limpar o campo de pesquisa (mostrar todos).
3. Inserir `alfa` no campo **Pesquisar por nome**.
4. Aguardar ~0,5 s.
5. Observar lista e texto «A mostrar X de Y».
6. Limpar pesquisa; inserir termo inexistente (ex.: `zzzzzzz`).
7. Verificar estado vazio / mensagem de nenhum item.

**Resultado esperado**

- Com `alfa`: só item(s) cujo nome contém a substring (ex.: «Laboratório Alfa»); contagem coerente.
- Com termo inexistente: 0 resultados; mensagem de vazio visível se aplicável.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-05 — Filtro por categoria

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-05 |
| **Objectivo** | Confirmar que o filtro por categoria restringe a lista (combinável com pesquisa vazia). |

**Procedimento (passo a passo)**

1. Ter itens em categorias diferentes (A=Dados, B=Voz, C=Empresarial).
2. Limpar pesquisa; em **Filtrar por categoria**, escolher `Dados / Internet móvel`.
3. Verificar lista e contagem.
4. Mudar para `Voz móvel`; repetir.
5. Seleccionar `Todas as categorias`; confirmar que todos voltam a aparecer.

**Resultado esperado**

- Cada filtro mostra apenas itens da categoria escolhida.
- «Todas as categorias» restaura a lista completa (sujeita a pesquisa activa).

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-06 — Ordenação nome Z–A

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-06 |
| **Objectivo** | Validar ordenação alfabética descendente no nome. |

**Procedimento (passo a passo)**

1. Ter pelo menos 3 itens com nomes distintos (Alfa, Beta, Gama).
2. Filtro: Todas; pesquisa vazia.
3. Em **Ordenar por**, seleccionar `Nome (Z–A)`.
4. Ler a ordem dos títulos na lista (de cima para baixo).

**Resultado esperado**

- Ordem Z–A por nome (ex.: Gama, Beta, Alfa).

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-07 — Ordenação por preço

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-07 |
| **Objectivo** | Validar ordenação por preço e comportamento com itens sem preço. |

**Procedimento (passo a passo)**

1. Ter Item A (preço 10), Item C (preço 25), Item B (sem preço).
2. Confirmar que as opções de ordenação por preço estão **activas** (não desactivadas).
3. Seleccionar `Preço (menor → maior)`; anotar ordem.
4. Seleccionar `Preço (maior → menor)`; anotar ordem.
5. Verificar posição dos itens sem preço (regra: no fim da ordenação).

**Resultado esperado**

- Asc: 10, 25, depois sem preço (ou ordem documentada consistente com implementação).
- Desc: 25, 10, depois sem preço.
- Opções de preço desactivadas apenas quando **nenhum** item tem preço.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-08 — Quota localStorage

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-08 |
| **Objectivo** | Verificar comportamento quando o guardar falha por quota (cenário avançado). |

**Procedimento (passo a passo)**

1. Abrir DevTools → Console (e opcionalmente Application).
2. (Método a critério do tester) Tentar simular falha de escrita: p.ex. preencher `localStorage` com dados grandes até falha, ou usar breakpoint/script de teste **sem alterar ficheiros do projecto**.
3. Tentar **Adicionar item** válido após condição de quota forçada.
4. Observar mensagem ao utilizador (`catalogAnnounce` / texto na página) e consola.

**Resultado esperado**

- Aplicação não “quebra” silenciosamente; há aviso de falha ao guardar ou mensagem na `aria-live`.
- Se item aparecer na sessão actual, documentar se entrou em modo memória.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-09 — Sem localStorage

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-09 |
| **Objectivo** | Confirmar degradação controlada quando `localStorage` não está disponível. |

**Procedimento (passo a passo)**

1. Abrir janela **privada/incógnito** (ou browser com cookies/storage bloqueados para o site).
2. Navegar para `http://127.0.0.1:8765/index.html#servicos`.
3. Verificar presença do aviso: «Armazenamento local indisponível…».
4. Adicionar um item de demonstração.
5. Recarregar F5; verificar se o item **não** persiste (modo memória).

**Resultado esperado**

- Banner de storage indisponível visível.
- CRUD possível na sessão; após F5, dados não mantidos se storage indisponível.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### CAT-10 — Multi-separador

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | CAT-10 |
| **Objectivo** | Validar sincronização via evento `storage` entre duas tabs. |

**Procedimento (passo a passo)**

1. Tab 1: abrir `http://127.0.0.1:8765/index.html#servicos`.
2. Tab 2: abrir a **mesma URL** (duplicar tab).
3. Tab 1: adicionar item `Laboratório Sync`.
4. Tab 2: **sem** F5, observar se a lista actualiza (pode demorar instantes).
5. Tab 2: remover um item.
6. Tab 1: verificar se a lista reflecte a remoção.

**Resultado esperado**

- Alterações num separador reflectem-se no outro sem recarregar manualmente (evento `storage`).
- Anúncio opcional «Catálogo actualizado noutro separador».

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

## Secção NAV — Navegação e acessibilidade

### NAV-01 — Skip-link

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | NAV-01 |
| **Objectivo** | Verificar atalho de saltar para o conteúdo principal (teclado). |

**Procedimento (passo a passo)**

1. Abrir página inicial.
2. Clicar na barra de endereço; premir **Tab** uma vez (ou até «Saltar para o conteúdo» ficar visível).
3. Premir **Enter**.
4. Verificar foco/scroll no início de `#conteudo-principal` (hero).

**Resultado esperado**

- Link «Saltar para o conteúdo» recebe foco; ao activar, o utilizador entra no `<main>`.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### NAV-02 — Menu mobile

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | NAV-02 |
| **Objectivo** | Validar menu responsivo e atributos ARIA. |

**Procedimento (passo a passo)**

1. Redimensionar janela para &lt; 48rem de largura (ou DevTools → modo dispositivo).
2. Clicar botão **Menu**; verificar menu aberto.
3. Inspeccionar botão: `aria-expanded="true"`.
4. Premir **Escape**; menu deve fechar; `aria-expanded="false"`.
5. Reabrir menu; clicar numa ligação (ex.: Serviços); menu deve fechar.

**Resultado esperado**

- Toggle abre/fecha navegação; Escape fecha; link fecha menu no mobile.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### NAV-03 — Apenas teclado

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | NAV-03 |
| **Objectivo** | Confirmar que menu, catálogo (pesquisa, filtros, formulário, remover) são operáveis sem rato. |

**Procedimento (passo a passo)**

1. Recarregar página; **não usar rato**.
2. Tab através do cabeçalho e menu.
3. Tab até ao catálogo: pesquisa, filtros, ordenação, botão adicionar, campo do formulário.
4. (Opcional) Activar **Remover** com teclado e confirmar/cancelar diálogo.

**Resultado esperado**

- Ordem de tabulação lógica; foco sempre visível (`:focus-visible`).
- Nenhum controló essencial inacessível por teclado.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### NAV-04 — Zoom 200%

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | NAV-04 |
| **Objectivo** | Verificar legibilidade e ausência de overflow horizontal grave com zoom aumentado. |

**Procedimento (passo a passo)**

1. Abrir página normal.
2. Aumentar zoom do browser para **200%** (Ctrl/Cmd + repetir +).
3. Percorrer: cabeçalho, hero, `#servicos` (cartões + catálogo), rodapé.
4. Verificar scroll horizontal da janela.

**Resultado esperado**

- Conteúdo utilizável; sem barra horizontal persistente em secções principais (pequenos overflows pontuais devem ser descritos se existirem).

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

## Secção FASE5 — Aceitação fase 5

### FASE5-01 — Aviso académico visível

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | FASE5-01 |
| **Objectivo** | Confirmar que o aviso académico está visível e com o texto oficial acordado. |

**Procedimento (passo a passo)**

1. Abrir `http://127.0.0.1:8765/index.html#servicos`.
2. No topo do bloco `#catalogo-servicos`, localizar o banner de destaque.
3. Ler o texto na íntegra (comparação literal com o esperado).

**Resultado esperado**

- Texto visível (sem ocultação por CSS):  
  **«Demonstração académica — os elementos apresentados neste catálogo não representam necessariamente ofertas comerciais da TMCEL.»**  
  (pode incluir ênfase em «Demonstração académica» em negrito.)

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### FASE5-02 — Registo de testes (documental)

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | FASE5-02 |
| **Objectivo** | Verificar existência e estrutura do ficheiro de registo (não é teste de UI no browser). |

**Procedimento (passo a passo)**

1. Abrir `docs/registo-testes.md` no editor.
2. Confirmar secções CAT, NAV, FASE5, REG com colunas de resultado.
3. Confirmar que resultados não executados estão marcados como pendentes / não inventados.

**Resultado esperado**

- Ficheiro existe, alinhado ao planeamento; placeholders honestos para testes não corridos.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

## Secção REG — Regressão

### REG-01 — Ano no rodapé

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | REG-01 |
| **Objectivo** | Confirmar que o ano no copyright é actualizado por JavaScript. |

**Procedimento (passo a passo)**

1. Abrir página inicial.
2. Deslocar ao rodapé.
3. Ler linha de copyright e comparar o ano com o ano civil actual do sistema.

**Resultado esperado**

- Ano em `© [ano actual]` coincide com a data do sistema (ex.: 2026).

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### REG-02 — Formulário de contactos (demo)

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | REG-02 |
| **Objectivo** | Garantir que o formulário de contactos continua em modo demonstrativo. |

**Procedimento (passo a passo)**

1. Navegar para `#contactos` (menu ou scroll).
2. Preencher Nome, E-mail, Mensagem com valores válidos.
3. Clicar **Enviar**.

**Resultado esperado**

- Aparece `alert` indicando que a mensagem não é enviada (demonstração).
- Página não navega para servidor externo; URL mantém-se no site local.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

### REG-03 — Cartões estáticos de serviços

| Campo | Conteúdo |
|-------|----------|
| **Identificador** | REG-03 |
| **Objectivo** | Confirmar que os quatro cartões informativos da secção Serviços foram mantidos antes do catálogo dinâmico. |

**Procedimento (passo a passo)**

1. Abrir `#servicos`.
2. Antes do catálogo, contar cartões na grelha estática.
3. Verificar títulos: Telemóvel; Internet e fibra; Empresarial; Apoio e facturação.

**Resultado esperado**

- Quatro cartões presentes, com conteúdo institucional/genérico; catálogo aparece **abaixo**, sem remover cartões.

**Resultado obtido:** Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto).

**Estado:** Aprovado

---

## Resumo para o relatório académico

| Grupo | Total de casos | Aprovado | Reprovado | Pendente |
|-------|----------------|----------|-----------|----------|
| CAT | 10 | 10 | 0 | 0 |
| NAV | 4 | 4 | 0 | 0 |
| FASE5 | 2 | 2 | 0 | 0 |
| REG | 3 | 3 | 0 | 0 |
| **Total** | **19** | **19** | **0** | **0** |

**Ordem sugerida de execução:** FASE5-01 → REG-03 → REG-01 → CAT-01 → CAT-02 → … → CAT-10 → NAV-01 → … → NAV-04 → REG-02 → FASE5-02 (revisão final do registo).

**Evidências opcionais:** capturas de ecrã por teste; nome do ficheiro `evidencia_CAT-01.png`, etc., pasta a critério da equipa (`docs/evidencias/`).

---

*Documento de roteiro apenas — não altera código da aplicação. Resultados sincronizados com `docs/registo-testes.md` e `docs/resumo-validacao-manual-revisao.md` em 2026-11-17.*