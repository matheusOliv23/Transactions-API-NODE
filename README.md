# API Transactions Nodejs Fastify

Api simples de transações para fins de estudo (não autenticada).

## 🚀 Tecnologias

- [Fastify](https://fastify.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [Eslint](https://eslint.org/)
- [Knex](https://knexjs.org/)
- [Zod](https://zod.dev/)
- [tsup](https://tsup.egoist.dev/)

## ✋🏻 Pré-requisitos

- [Node.js](https://nodejs.org/en/)
- [Yarn](classic.yarnpkg.com/en/docs/install)

## 🔥 Instalação e execução

1. Faça um clone desse repositório e entre na pasta;
2. Rode `npm install` ou `yarn`
3. Rode `yarn start` ou `npm run start` para rodar a aplicação;

## 🚀 Rotas

1. GET `/transactions` - Lista transações
2. GET `/transactions/:id` - Lista uma transação específica pelo ID
3. GET `/transactions/sumary` - Lista o resumo de transações
3. POST `/transactions` - Cria uma nova transação