name: Feature Request
description: Sugira uma nova funcionalidade ou melhoria.
title: '[Feature]: '
labels: ['kind:enhancement', 'status:triage']

body:
  - type: markdown
    attributes:
      value: |
        Descreva a funcionalidade com clareza. Quanto mais contexto,
        mais rápido conseguimos avaliar.

  - type: textarea
    id: problem
    name: Problema
    description: Que problema ou limitação esta feature resolve?
    validations:
      required: true

  - type: textarea
    id: solution
    name: Solução proposta
    description: Como você imagina que isso deva funcionar?
    validations:
      required: true

  - type: textarea
    id: alternatives
    name: Alternativas consideradas
    description: Quais outras abordagens você pensou? Por que não as usamos?

  - type: textarea
    id: context
    name: Contexto adicional
    description: Mockups, referências, links, exemplos.

  - type: dropdown
    id: priority
    name: Prioridade
    options:
      - Baixa
      - Média
      - Alta
    validations:
      required: true
