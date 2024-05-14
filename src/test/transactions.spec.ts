import {
  afterAll,
  beforeAll,
  test,
  describe,
  expect,
  beforeEach,
} from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../app';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('yarn knex migrate:rollback --all');
    execSync('yarn knex migrate:latest');
  });

  test('should create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201);
  });

  test('should list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      });

    const cookie = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie as string[])
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({ title: 'New transaction', amount: 5000 }),
    ]);
  });

  test('should get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      });

    const cookie = createTransactionResponse.get('Set-Cookie') as string[];

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({ title: 'New transaction', amount: 5000 })
    );
  });

  test('should get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      });

    const cookie = createTransactionResponse.get('Set-Cookie') as string[];

    await request(app.server).post('/transactions').set('Cookie', cookie).send({
      title: 'Debit transaction',
      amount: 5000,
      type: 'debit',
    });

    const sumarryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie as string[])
      .expect(200);

    expect(sumarryResponse.body.summary).toEqual({ amount: 0 });
  });
});
