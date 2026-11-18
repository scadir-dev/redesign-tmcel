# Redesign TMCEL — Moçambique Telecom

Projeto académico de **redesign do website da TMCEL**, com objectivo de uma presença digital moderna, profissional, responsiva e funcional.

## Tecnologias

| Tecnologia   | Uso                          |
|-------------|------------------------------|
| HTML5       | Estrutura semântica e acessível |
| CSS3        | Layout, design system, responsividade |
| JavaScript  | Interacções (Vanilla JS, sem frameworks) |

**Não** são utilizados React, Vue, Angular nem dependências npm obrigatórias para executar o site.

## Estrutura do repositório

```
Redesign-TMCEL/
├── index.html          # Página principal (entry point)
├── css/
│   └── style.css       # Estilos globais e componentes
├── js/
│   └── script.js       # Comportamentos do cliente
├── assets/
│   └── images/         # Recursos gráficos (logótipo, ícones, fotos)
└── README.md           # Documentação do projecto
```

## Como executar localmente

1. Abra a pasta do projecto no explorador de ficheiros.
2. Faça duplo clique em `index.html`, **ou**
3. Use uma extensão/servidor local simples (por exemplo, “Live Server” no VS Code / Cursor) para evitar limitações de `file://` em alguns browsers.

Não é necessário `npm install` nesta fase.

## Estado actual (fase inicial)

- Layout base: cabeçalho com navegação, hero, secções placeholder (Serviços, Sobre, Contactos) e rodapé.
- Menu mobile básico (toggle).
- Design tokens em CSS (cores, espaçamentos) preparados para evolução da identidade visual TMCEL.

Funcionalidades completas (formulários, páginas internas, integração com conteúdos reais da operadora) serão desenvolvidas em iterações seguintes.

## Objectivos de qualidade

- Código **limpo**, **comentado** e fácil de expandir.
- **Acessibilidade**: landmarks ARIA, skip link, estados de menu com `aria-expanded`.
- **Responsividade**: mobile-first no menu; grelha adaptativa nos cartões.

## Autoria e aviso

Este repositório é um **exercício académico**. Não representa o site oficial da TMCEL nem implica parceria com a operadora.

## Licença

A definir pela equipa académica (sugestão: uso educacional apenas).