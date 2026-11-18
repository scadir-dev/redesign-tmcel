# Registo de testes funcionais — Redesign TMCEL

**Projecto:** Redesign académico TMCEL — Moçambique Telecom, S.A.  
**Documento de referência:** `docs/planeamento-tecnico.md` (§11)  
**Roteiro manual:** `docs/roteiro-validacao-manual.md`  
**Última actualização:** 2026-11-17  
**Fase:** Validação manual concluída

---

## 1. Revisão da implementação do catálogo (fase 5)

| Área | Estado | Notas |
|------|--------|--------|
| HTML `#catalogo-servicos` | Implementado | Toolbar, lista, formulário, `aria-live`, `<dialog>` de remoção |
| Storage `tmcel_academico_catalogo_v1` | Implementado | `loadCatalog` / `saveCatalog`, migração v1, fallback em memória |
| CRUD e validação | Implementado | `eDemonstracao: true` em todos os itens criados |
| Pesquisa / filtro / ordenação | Implementado | Debounce 200 ms; opções preço/data desactivadas sem dados |
| Sincronização entre separadores | Implementado | Evento `storage` |
| Aviso académico visível | Validado (FASE5-01) | Banner conforme especificação |
| Auto-testes lógicos | Disponível | URL `?catalogtest=1` → `window.__tmcelCatalogSelfTest()` na consola |

### 1.1 Legenda de estados

| Estado (registo) | Equivalente no roteiro | Significado |
|------------------|------------------------|-------------|
| **Passou** | Aprovado | Executado; conforme o esperado |
| **Falhou** | Reprovado | Executado; não conforme |
| **Pendente** | Pendente | Não executado ou sem resultado registado no roteiro |
| **Parcial** | — | Apenas testes **automáticos** de lógica (consola), sem UI |

### 1.2 Sincronização com o roteiro (2026-11-17)

Validação manual dos 19 casos (**CAT**, **NAV**, **FASE5**, **REG**) executada no navegador.  
**Confirmação do responsável pelo projecto:** todos **Aprovados**.  
Resultados sincronizados com `docs/roteiro-validacao-manual.md` e `docs/resumo-validacao-manual-revisao.md`.

---

## 2. Como executar testes

1. Na raiz: `py -m http.server 8765` (em Windows, se `python` falhar, usar `py`).
2. Procedimentos detalhados em `docs/roteiro-validacao-manual.md`.
3. Testes automáticos de lógica: `?catalogtest=1` (não substituem validação manual).

---

## 3. Testes automáticos (lógica — consola)

*Não fazem parte do roteiro manual; execução independente em `?catalogtest=1`.*

**Ambiente da execução registada:** `http://127.0.0.1:8765/index.html?catalogtest=1` — 2026-11-17.

| ID | Descrição | Procedimento | Resultado esperado | Resultado obtido | Estado |
|----|-----------|--------------|-------------------|------------------|--------|
| AUTO-01 | Pesquisa por nome (`queryItems`) | Abrir URL com `catalogtest=1`; inspeccionar consola | `[OK] pesquisa por nome` | Consola: 5 testes OK, 0 falhas (incl. pesquisa) | **Parcial** |
| AUTO-02 | Filtro por categoria | Idem | `[OK] filtro categoria` | Incluído no bloco 5/5 OK | **Parcial** |
| AUTO-03 | Ordenação por preço (desc) | Idem | `[OK] ordenação preço desc` | Incluído no bloco 5/5 OK | **Parcial** |
| AUTO-04 | Validação nome curto | Idem | `[OK] validação nome curto` | Incluído no bloco 5/5 OK | **Parcial** |
| AUTO-05 | Flag `eDemonstracao` | Idem | `[OK] adicionar válido` | Incluído no bloco 5/5 OK | **Parcial** |

> Os casos AUTO-* **não** substituem os testes de interface CAT-*.

---

## 4. Catálogo — matriz CAT (validação manual)

*Fonte dos resultados: `docs/roteiro-validacao-manual.md` (secção CAT).*

| ID | Descrição | Resultado esperado (resumo) | Resultado obtido | Estado |
|----|-----------|---------------------------|------------------|--------|
| CAT-01 | Adicionar item válido | Item na lista; persistência após F5 | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-02 | Nome inválido | Erros; item não criado | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-03 | Remover item | Diálogo; item ausente | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-04 | Pesquisa na UI | Lista e contagem correctas | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-05 | Filtro categoria | Só itens da categoria | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-06 | Ordenação nome Z–A | Ordem invertida | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-07 | Ordenação preço | Preços e itens sem preço | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-08 | Quota `localStorage` | Feedback de erro | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-09 | Sem `localStorage` | Banner; modo memória | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| CAT-10 | Multi-separador | Sincronização entre tabs | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |

---

## 5. Navegação e acessibilidade — matriz NAV (validação manual)

| ID | Descrição | Resultado esperado (resumo) | Resultado obtido | Estado |
|----|-----------|---------------------------|------------------|--------|
| NAV-01 | Skip-link | Foco em `#conteudo-principal` | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| NAV-02 | Menu mobile | `aria-expanded`; Escape fecha | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| NAV-03 | Apenas teclado | Controlos alcançáveis | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| NAV-04 | Zoom 200% | Sem overflow horizontal crítico | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |

---

## 6. Fase 5 — aceitação específica (validação manual / documental)

| ID | Descrição | Resultado esperado (resumo) | Resultado obtido | Estado |
|----|-----------|---------------------------|------------------|--------|
| FASE5-01 | Aviso académico visível | Texto do banner conforme especificação | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| FASE5-02 | Registo de testes | `docs/registo-testes.md` estruturado | Conforme o esperado (revisão documental; confirmação do responsável) | **Passou** |

---

## 7. Regressão — REG (validação manual)

| ID | Descrição | Resultado esperado (resumo) | Resultado obtido | Estado |
|----|-----------|---------------------------|------------------|--------|
| REG-01 | Ano no rodapé | Ano corrente visível | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| REG-02 | Formulário contactos (demo) | `alert` demonstrativo | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |
| REG-03 | Cartões estáticos de serviços | Quatro cartões presentes | Conforme o esperado (validação manual no navegador; confirmação do responsável) | **Passou** |

---

## 8. Resumo estatístico

### 8.1 Testes automáticos (AUTO)

| Métrica | Valor |
|---------|-------|
| Total | 5 |
| Parcial | **5** |
| Passou (UI completa) | 0 |
| Falhou | 0 |
| Pendente | 0 |

### 8.2 Testes manuais (roteiro: CAT + NAV + FASE5 + REG)

| Métrica | Valor |
|---------|-------|
| Total | 19 |
| Passou (Aprovado) | **19** |
| Falhou (Reprovado) | **0** |
| Pendente | **0** |

### 8.3 Global (AUTO + manual)

| Métrica | Valor |
|---------|-------|
| Total de casos | 24 |
| Passou (manual) | 19 |
| Falhou | 0 |
| Parcial (só AUTO) | 5 |
| Pendente | 0 |

### 8.4 Por categoria

| Categoria | Passou | Falhou | Parcial | Pendente |
|-----------|--------|--------|---------|----------|
| AUTO | 0 | 0 | 5 | 0 |
| CAT | 10 | 0 | 0 | 0 |
| NAV | 4 | 0 | 0 | 0 |
| FASE5 | 2 | 0 | 0 | 0 |
| REG | 3 | 0 | 0 | 0 |

### 8.5 Conclusão da validação manual

- **Testes reprovados:** nenhum.
- **Validação manual:** 19 aprovados, 0 reprovados, 0 pendentes (confirmação do responsável pelo projecto).
- **Testes automáticos:** 5 em estado **Parcial** (lógica em consola; não confundir com aprovação manual).
- **Critério de aceitação** (`planeamento-tecnico.md` §11.5) para fluxos de catálogo e navegação no browser: **satisfeito** na validação manual.

---

## 9. Histórico

| Data | Alteração |
|------|-----------|
| 2026-11-17 | Criação do registo (fase 5); auto-testes consola documentados como Parcial |
| 2026-11-17 | Banner académico actualizado em `index.html` |
| 2026-11-17 | Sincronização com roteiro: 19 casos manuais Pendente (pré-execução) |
| 2026-11-17 | Validação manual concluída: 19 Passou; sincronização com roteiro e resumo; AUTO mantidos Parcial |

---

*Fonte canonical de testes. Resumo: `docs/resumo-validacao-manual-revisao.md`.*