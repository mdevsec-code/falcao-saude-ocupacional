name: Bug Report
description: Reporte um problema para ajudar a plataforma a melhorar.
title: '[Bug]: '
labels: ['kind:bug', 'status:triage']
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Obrigado por abrir um bug report! Preencha as informações abaixo
        para que possamos reproduzir e corrigir o problema mais rápido.

  - type: input
    id: environment
    name: Ambiente
    description: Em qual ambiente o bug apareceu?
    placeholder: 'ex.: Chrome 130 / macOS 15 / produção'
    validations:
      required: true

  - type: textarea
    id: steps
    name: Passos para reproduzir
    description: Liste os passos exatos que reproduzem o problema.
    validations:
      required: true

  - type: textarea
    id: expected
    name: Comportamento esperado
    validations:
      required: true

  - type: textarea
    id: actual
    name: Comportamento atual
    validations:
      required: true

  - type: textarea
    id: screenshots
    name: Screenshots / logs
    description: Cole imagens (arraste para o editor) e logs relevantes.

  - type: dropdown
    id: severity
    name: Severidade
    options:
      - Baixa
      - Média
      - Alta
      - Crítica
    validations:
      required: true
