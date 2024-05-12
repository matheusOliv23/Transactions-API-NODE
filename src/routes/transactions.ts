import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { kknex } from '../database';
import { checkSessionIdExists } from '../middleware/check-session-id-exists';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const { sessionId } = req.cookies;

    const transactions = await kknex('transactions')
      .where('session_id', sessionId)
      .select();

    return { transactions };
  });

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { sessionId } = req.cookies;

    const { id } = getTransactionParamsSchema.parse(req.params);

    const transaction = await kknex('transactions')
      .where({ session_id: sessionId, id })
      .first();

    return { transaction };
  });

  app.get('/summary', { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies;

    const summary = await kknex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first();

    return { summary };
  });

  app.post('/', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number({ message: 'Valor precisa ser um número' }),
      type: z.enum(['credit', 'debit']),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(req.body);

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await kknex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return res.status(201).send();
  });
}
