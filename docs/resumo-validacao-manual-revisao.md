# Resumo da validação manual — Redesign TMCEL

**Origem:** `docs/roteiro-validacao-manual.md` (19 casos)  
**Sincronizado com:** `docs/registo-testes.md`  
**Última actualização:** 2026-11-17  
**Estado do documento:** **Validação concluída** (confirmação do responsável pelo projecto)

---

## Tabela-resumo (19 casos)

| ID | Objectivo | Resultado esperado (resumo) | Resultado obtido | Estado |
|----|-----------|----------------------------|------------------|--------|
| **CAT-01** | Confirmar que o utilizador consegue criar um item de demonstração e que os dados persistem após recarregar a página. | Item na lista com «Exemplo académico»; contagem correcta; após F5 o item permanece; persistência em `tmcel_academico_catalogo_v1` (se storage disponível). | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-02** | Garantir que entradas inválidas (nome em falta ou demasiado curto) não criam itens e mostram feedback. | Item não adicionado; mensagem de erro no Nome e/ou validação HTML5; contagem inalterada. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-03** | Validar remoção com confirmação acessível e actualização do armazenamento. | Diálogo antes da remoção; após confirmar, item desaparece; feedback em `aria-live` (se perceptível). | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-04** | Confirmar filtro por texto no campo «Pesquisar por nome» (debounce ~200 ms). | Substring filtra a lista e a contagem «A mostrar X de Y»; termo inexistente → 0 resultados / vazio. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-05** | Confirmar que o filtro por categoria restringe a lista (combinável com pesquisa vazia). | Cada categoria mostra só itens respectivos; «Todas» restaura lista (respeitando pesquisa activa). | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-06** | Validar ordenação alfabética descendente no nome. | Ordem Z–A (ex.: Gama, Beta, Alfa). | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-07** | Validar ordenação por preço e comportamento com itens sem preço. | Asc/desc por preço; itens sem preço no fim; opções de preço desactivadas só se nenhum item tiver preço. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-08** | Verificar comportamento quando o guardar falha por quota (cenário avançado). | Sem falha silenciosa; aviso ao utilizador ou `aria-live`; documentar modo memória se aplicável. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-09** | Confirmar degradação controlada quando `localStorage` não está disponível. | Banner «Armazenamento local indisponível»; CRUD na sessão; após F5 dados não mantidos se storage indisponível. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **CAT-10** | Validar sincronização via evento `storage` entre duas tabs. | Alterações num separador reflectem-se no outro sem F5; anúncio opcional de actualização. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **NAV-01** | Verificar atalho de saltar para o conteúdo principal (teclado). | Link recebe foco; ao activar, entrada em `<main>` / `#conteudo-principal`. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **NAV-02** | Validar menu responsivo e atributos ARIA. | Toggle abre/fecha; `aria-expanded` correcto; Escape fecha; link fecha menu no mobile. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **NAV-03** | Confirmar que menu, catálogo e controlos são operáveis sem rato. | Tabulação lógica; foco visível; controlos essenciais alcançáveis. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **NAV-04** | Verificar legibilidade e ausência de overflow horizontal grave com zoom 200%. | Conteúdo utilizável; sem barra horizontal persistente nas secções principais. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **FASE5-01** | Confirmar que o aviso académico está visível e com o texto oficial acordado. | Texto visível: «Demonstração académica — os elementos apresentados neste catálogo não representam necessariamente ofertas comerciais da TMCEL.» | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **FASE5-02** | Verificar existência e estrutura do ficheiro de registo (revisão documental). | `docs/registo-testes.md` existe, estruturado; sem resultados inventados. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **REG-01** | Confirmar que o ano no copyright é actualizado por JavaScript. | «© [ano actual]» coincide com o ano do sistema. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **REG-02** | Garantir que o formulário de contactos continua em modo demonstrativo. | `alert` de demonstração; sem envio nem navegação externa. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |
| **REG-03** | Confirmar que os quatro cartões informativos da secção Serviços foram mantidos. | Quatro cartões (Telemóvel, Internet e fibra, Empresarial, Apoio e facturação) antes do catálogo. | Conforme o esperado. Validação manual no navegador concluída com sucesso (confirmação do responsável pelo projecto). | Aprovado |

---

## Estatística — validação manual

| Estado | Quantidade |
|--------|------------|
| Aprovado | **19** |
| Reprovado | **0** |
| Pendente | **0** |

---

## Testes automáticos (referência, não incluídos nos 19)

Os casos **AUTO-01** a **AUTO-05** permanecem **Parcial** (lógica em consola com `?catalogtest=1`). Ver `docs/registo-testes.md` §3.

| Métrica | Valor |
|---------|-------|
| Total AUTO | 5 |
| Parcial | 5 |

---

## Consistência documental

| Documento | Papél |
|-----------|-------|
| `docs/roteiro-validacao-manual.md` | Procedimentos + Estado **Aprovado** por caso |
| `docs/registo-testes.md` | Registo canonical; manual = **Passou**; AUTO = **Parcial** |
| Este ficheiro | Tabela-resumo para relatório académico |

*Ficheiros funcionais (`index.html`, `css/`, `js/`) não foram alterados nesta actualização.*