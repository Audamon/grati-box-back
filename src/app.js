import express from 'express';
import cors from 'cors';
import signup from './Controllers/signup.js';
import signin from './Controllers/signin.js';
import getdeliverydays from './Controllers/getdeliverydays.js';
import endorder from './Controllers/endorder.js';
import userservice from './Controllers/userservice.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', signup);
app.post('/signin', signin);

app.get('/getdeliverydays/:plan', getdeliverydays);
app.post('/endorder', endorder);

app.get('/userservice', userservice);
export default app;