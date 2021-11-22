import connection from '../database.js';

async function getdeliverydays(req, res) {
  const { plan } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  try {
    if (!token) return res.sendStatus(401);
    const days = await connection.query('SELECT * FROM delivery JOIN services ON delivery."idServices" = services.id WHERE services.name = $1', [plan]);
    return res.status(200).send(days.rows);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export default getdeliverydays;
