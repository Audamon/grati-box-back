import dotenv from 'dotenv';

// eslint-disable-next-line no-nested-ternary
const path = process.env.NODE_ENV === 'production' ? '.env' : process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test';

dotenv.config({ path });