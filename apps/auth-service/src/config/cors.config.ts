import { CorsOptions } from 'cors';

export const corsConfig = (): CorsOptions => {
  const allowedOrigins = ['http://localhost:3000', 'actualDeployment'];
  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin as string)) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by cors'));
    },
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
    exposedHeaders: ['X-Total-Count', 'Content-Range'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    maxAge: 600,
  };
};