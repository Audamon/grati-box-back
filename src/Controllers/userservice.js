import connection from '../database.js';

async function userservice(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  try {
    if (!token) return res.sendStatus(401);
    const user = await connection.query(
      'SELECT * FROM sessions JOIN "user" ON sessions."idUser" = "user".id WHERE sessions.token = $1;',
      [token],
    );
    const info = await connection.query('select "userServices"."signDate" as signdate, services.name as service, "userServices".date as date from "userServices" join services on "userServices"."idServices" = services.id where "userServices"."idUser" = $1;', [user.rows[0].id]);
    const products = await connection.query('select products.name as name from "userServicesProducts" join products on "userServicesProducts"."idProducts" = products.id join "userServices" on "userServicesProducts"."idUserProducts" = "userServices".id');
    const dateS = info.rows[0].signdate.toLocaleDateString().split('/');
    console.log(dateS);
    const aux1 = `${dateS[1]}/${dateS[0]}/${dateS[2]}`;
    console.log(aux1);
    const returnInfo = {
      date: info.rows[0].date,
      service: info.rows[0].service,
      signdate: aux1,
      product: products.rows[0].name,
    };
    return res.status(200).send(returnInfo);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export default userservice;
