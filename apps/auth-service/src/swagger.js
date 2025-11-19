import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Auth Service API',
    description: 'Automatically Generated Swagger Docs',
    version: '1.0.0',
  },
  host: 'localhost:6001',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./routes/auth.route.ts'];

swaggerAutogen()(outputFile, routes, doc);
