import bcrypt from 'bcrypt';
import connection from '../database';
import { signUpSchema } from '../../Schemas/schemas';

async function signup(req, res) {
  const validation = signUpSchema.validate(req.body);
  if (validation.error) {
    return res.sendStatus(400);
  }
  const { name, email, password } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);
  try {
    await connection.query('INSERT INTO "user"(name, email, password) VALUES($1, $2, $3)', [name, email, encryptedPassword]);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export default signup;
