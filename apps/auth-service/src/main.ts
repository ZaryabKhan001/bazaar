import express from 'express';
import cors from 'cors';
import { corsConfig } from './config/cors.config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../../../packages/error-handler/error.middleware';
import authRouter from "./routes/auth.route";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

//? Middlewares
app.use(cors(corsConfig()));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

//? Routes
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Auth Service!' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs', (req, res) => {
  res.json(swaggerDocument);
});

app.use('/api', authRouter);

//? Error Middleware
app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Auth Service is listening on Port:${port}`);
  console.log(`Swagger Docs for Auth Service are available at http://localhost:${port}/docs`);
});
server.on('error', (err) => console.log('Server Error:', err));
