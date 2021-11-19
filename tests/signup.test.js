import supertest from 'supertest';
import '../src/setup';
import app from '../src/app';
import connection from '../src/database';
import {
  validBodyFactorySignup,
  invalidBodyFactorySignup,
} from '../src/Factories/signup.factory.js';

afterAll(async () => {
  connection.end();
});
describe('POST /signup', () => {
  const validBody = validBodyFactorySignup();
  const invalidBody = invalidBodyFactorySignup();
  afterAll(async () => {
    await connection.query(`
              DELETE FROM "user";
          `);
  });

  test('returns 400 there is some inconsistent information', async () => {
    const result = await supertest(app).post('/signup').send(invalidBody);

    expect(result.status).toEqual(400);
  });

  test('returns 200 when send valid information', async () => {
    const result = await supertest(app).post('/signup').send(validBody);

    expect(result.status).toEqual(200);
  });
});
