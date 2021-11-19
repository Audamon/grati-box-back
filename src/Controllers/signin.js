import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database.js';
import { signInSchema } from '../../Schemas/schemas.js';

async function signin(req, res) {
  const validate = signInSchema.validate(req.body);
  if (validate.error) {
    return res.sendStatus(400);
  }
  const { email, password } = req.body;
  try {
    const user = await connection.query('SELECT * FROM "user" WHERE email = $1;', [email]);
    if (user.rowCount === 0) {
      return res.sendStatus(401);
    }
    const encryptedPassword = user.rows[0].password;
    if (!bcrypt.compareSync(password, encryptedPassword)) {
      return res.sendStatus(401);
    }
    const token = uuid();
    await connection.query('INSERT INTO sessions ("idUser", token) VALUES ($1, $2);', [user.rows[0].id, token]);
    const returnUserTokenAndId = {
      token,
      id: user.rows[0].id,
    };
    return res.status(200).send(returnUserTokenAndId);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export default signin;
