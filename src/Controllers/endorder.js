import connection from '../database.js';

async function endorder(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  const {
    product, address, name, date, plan,
  } = req.body;
  try {
    if (!token) return res.sendStatus(401);
    const user = await connection.query(
      'SELECT * FROM sessions JOIN "user" ON sessions."idUser" = "user".id WHERE sessions.token = $1;',
      [token],
    );
    const plan1 = plan.toLowerCase();
    const service = await connection.query(
      'SELECT * FROM services WHERE services.name = $1',
      [plan1],
    );
    await connection.query(
      'INSERT INTO "userServices"("idUser", "idServices", "signDate", date, name, adress) VALUES($1, $2, now(), $3, $4, $5)',
      [user.rows[0].idUser, service.rows[0].id, date, name, address],
    );
    const productId = await connection.query(
      'SELECT * FROM products WHERE products.name = $1;',
      [product],
    );
    const serviceId = await connection.query(
      'SELECT * FROM "userServices" WHERE "userServices"."idUser" = $1;',
      [user.rows[0].idUser],
    );
    await connection.query(
      'INSERT INTO "userServicesProducts"("idProducts", "idUserProducts") VALUES ($1, $2);',
      [productId.rows[0].id, serviceId.rows[0].id],
    );
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}
export default endorder;
