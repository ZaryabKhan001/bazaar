import express from 'express';
import cors from 'cors';
import { corsConfig } from './config/cors.config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimiter } from './middlewares/rateLimiter.middleware';
import proxy from 'express-http-proxy';

const app = express();
const port = process.env.PORT || 8080;

//? Middlewares
app.use(cors(corsConfig()));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.set('trust proxy', 1);

app.use(rateLimiter(100, 1000, 15 * 60 * 1000));

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

//? Proxy
app.use('/auth', proxy('http://localhost:6001'));

const server = app.listen(port, () => {
  console.log(`Api Gateway is Listening on Port:${port}`);
});
server.on('error', (err) => console.log('Server Error:', err));
