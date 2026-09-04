# API

GET

Wedding Info

POST

RSVP

O RSVP é individual: recebe nome e telefone obrigatórios, com mensagem opcional.

O telefone é exibido com máscara brasileira no formulário, mas enviado ao backend somente com 10 ou 11 dígitos.

O endpoint encaminha os dados para o Web App do Google Sheets por uma requisição `GET` com `action=Create`, `nome`, `telefone` e `mensagem`. A URL pode ser sobrescrita pela variável de ambiente `GOOGLE_SHEETS_WEBHOOK_URL`.

Respostas:

- `201`: confirmação registrada
- `400`: dados inválidos
- `502`: falha no Google Sheets
- `503`: integração ainda não configurada

GET

Guest

POST

Validation

...

Toda API deverá retornar JSON.

Todos endpoints deverão seguir REST.

Nunca retornar HTML.

Mensagens padronizadas.