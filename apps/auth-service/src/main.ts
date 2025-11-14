/* eslint-disable @nx/enforce-module-boundaries */
import express from 'express';
import cors from 'cors';
import { corsConfig } from './config/cors.config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../../../packages/error-handler/error.middleware';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

//? Middlewares
app.use(cors(corsConfig()));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.get('/auth-health', (req, res) => {
  res.send({ message: 'Welcome to Auth Service!' });
});

//? Error Middleware
app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', (err) => console.log('Server Error:', err));
