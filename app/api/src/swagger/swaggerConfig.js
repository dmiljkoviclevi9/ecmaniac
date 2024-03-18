const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Ecmaniac API',
    version: '1.0.0',
    description: 'This is a REST API application made with Express. It retrieves data from ecmaniac app.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  components: {
      securitySchemes: {
          BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
          },
      },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/swagger/*.js'],
};

export default options;