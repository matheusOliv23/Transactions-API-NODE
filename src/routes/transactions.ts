import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import knex from 'knex';
import { z } from 'zod';

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number({ message: 'Valor precisa ser um número' }),
      type: z.enum(['credit', 'debit']),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(req.body);

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    });

    return res.status(201).send();
  });
}
