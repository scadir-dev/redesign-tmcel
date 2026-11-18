# Registo de testes — catálogo académico (fase 1–4)

> **Fonte canonical:** use `docs/registo-testes.md` para o registo completo (fases 1–5).

Data: 2026-11-17

## Automáticos (`?catalogtest=1`)

Executar: `py -m http.server 8765` na raiz do projecto e abrir `http://127.0.0.1:8765/index.html?catalogtest=1` — ver consola do browser.

| ID | Teste | Resultado |
|----|-------|-----------|
| T-AUTO-01 | Pesquisa por nome (`queryItems`) | OK |
| T-AUTO-02 | Filtro por categoria | OK |
| T-AUTO-03 | Ordenação por preço desc | OK |
| T-AUTO-04 | Validação nome curto rejeitada | OK |
| T-AUTO-05 | Item válido com `eDemonstracao: true` | OK |

Resultado agregado: **5 OK, 0 falhas** (execução via consola).

## Manuais (checklist)

| ID | Passos | Resultado esperado |
|----|--------|-------------------|
| T-MAN-01 | Adicionar item com nome ≥2 chars e categoria | Item na lista; contagem actualizada |
| T-MAN-02 | F5 | Item persiste (`tmcel_academico_catalogo_v1`) |
| T-MAN-03 | Pesquisa pelo nome | Lista filtrada |
| T-MAN-04 | Filtro categoria | Só itens da categoria |
| T-MAN-05 | Ordenar Z–A | Ordem invertida |
| T-MAN-06 | Remover com dialog | Item desaparece; live region anuncia |
| T-MAN-07 | Dois separadores; alterar num | Outro actualiza (evento `storage`) |
| T-MAN-08 | Menu mobile / scroll-spy | Comportamento anterior mantido |