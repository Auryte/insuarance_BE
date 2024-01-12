import 'dotenv/config';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Insurance Business Test Application API',
    version: '1.0.0',
    description: ''
  },
  servers: [
    {
      url: `http://${process.env.URL || `localhost`}:${process.env.PORT}`,
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.yaml']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
