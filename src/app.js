import express from 'express';
import cors from 'cors';
import signup from './Controllers/signup';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/signup', signup);
export default app;