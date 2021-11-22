/* eslint-disable quotes */
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import '../src/setup.js';
import { v4 as uuid } from 'uuid';
import app from '../src/app.js';
import connection from '../src/database.js';
import { validBodyFactorySignup } from '../src/Factories/signup.factory.js';

beforeAll(async () => {
  const validBody = validBodyFactorySignup();
  const password1 = bcrypt.hashSync(validBody.password, 10);
  await connection.query(
    'INSERT INTO "user"(name, email, password) VALUES ($1, $2, $3);',
    [validBody.name, validBody.email, password1],
  );
  const userId = await connection.query('select * from "user";');
  const token = uuid();
  await connection.query(
    'insert into sessions("idUser", token) values($1, $2);',
    [userId.rows[0].id, token],
  );
  await connection.query(`insert into services(name) values('mensal');`);
  await connection.query(`insert into services(name) values('semanal');`);
  const idService1 = await connection.query(`select * from services where name = 'mensal';`);
  await connection.query(
    `insert into delivery(date, "idServices") values(20, $1);`,
    [idService1.rows[0].id],
  );
  await connection.query(
    `insert into delivery(date, "idServices") values(10, $1);`,
    [idService1.rows[0].id],
  );
  await connection.query(
    `insert into delivery(date, "idServices") values(1, $1);`,
    [idService1.rows[0].id],
  );
  const idService2 = await connection.query(`select * from services where name = 'semanal';`);
  await connection.query(
    `insert into delivery(date, "idServices") values('Segunda', $1);`,
    [idService2.rows[0].id],
  );
  await connection.query(
    `insert into delivery(date, "idServices") values('Quarta', $1);`,
    [idService2.rows[0].id],
  );
  await connection.query(
    `insert into delivery(date, "idServices") values('Sexta', $1);`,
    [idService2.rows[0].id],
  );
  await connection.query(`insert into products(name) values('Chás');`);
  await connection.query(`insert into products(name) values('Insênsos');`);
  await connection.query(`insert into products(name) values('Produtos Orgânicos');`);
});
afterAll(async () => {
  await connection.query('DELETE FROM sessions;');
  await connection.query('DELETE FROM "userServicesProducts";');
  await connection.query('DELETE FROM "userServices";');
  await connection.query('DELETE FROM "user";');
  await connection.query('DELETE FROM products;');
});
describe('end order', () => {
  test('return 401 for invalid token', async () => {
    const config = {
      headers: {
        Authorization: '',
      },
    };
    const result = await supertest(app)
      .post('/endorder')
      .set(config);
    expect(result.status).toEqual(401);
  });
  test('retorna 201', async () => {
    const body = {
      plan: 'Mensal',
      date: '20',
      name: 'joao',
      adress: 'rua venancio 99999999 ipê/rs',
      product: 'Chás',
    };
    const item = await connection.query('select * from sessions;');
    const result = await supertest(app).post('/endorder').set("Authorization", `Bearer ${item.rows[0].token}`).send(body);
    expect(result.status).toEqual(201);
  });
});
