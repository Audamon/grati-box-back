import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database.js';
import { signInSchema } from '../../Schemas/schemas.js';

async function signIn(req, res) {
  const validate = signInSchema.validate(req.body);

  if (validate.error) {
    res.sendStatus(400);
    return;
  }

  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await connection.query('SELECT * FROM "user" WHERE email = $1;', [email]);

    if (user.rowCount === 0) {
      res.sendStatus(401);
      return;
    }

    const encryptedPassword = user.rows[0].password;
    if (!bcrypt.compareSync(password, encryptedPassword)) {
      res.sendStatus(401);
      return;
    }

    const token = uuid();

    await connection.query('INSERT INTO sessions ("idUser", token) VALUES ($1, $2);', [user.rows[0].id, token]);

    res.status(200).send({
      token,
      id: user.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export default signIn;
