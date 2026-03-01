import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './env.ts'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TeamPoint API',
      version: '1.0.0',
      description: 'TeamPoint Backend API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.ts'], // VERY IMPORTANT
}

export const swaggerSpec = swaggerJsdoc(options)
