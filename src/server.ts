import 'dotenv/config';
import mongoose from 'mongoose';

import app from './app';

const PORT: number = (process.env.PORT && Number.parseInt(process.env.PORT, 10)) || 8080;
const MONGODB_URL = `${process.env.MONGODB_URL}`;

async function start() {
  try {
    await mongoose.connect(MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}...\nDB connection succesful!`);
    });
  } catch (error) {
    console.error(error);
  }
}

start();
