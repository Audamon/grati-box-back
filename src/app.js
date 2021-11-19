import express from 'express';
import cors from 'cors';
import signup from './Controllers/signup';
import signin from './Controllers/signin';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup', signup);
app.post('/signin', signin);
export default app;