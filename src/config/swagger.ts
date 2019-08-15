import * as swaggerJSDoc from 'swagger-jsdoc';

const swaggerOption: swaggerJSDoc.Options = {
  swaggerDefinition: {
    info: {
        title: 'Hackerton 815',
        version: '0.0.1',
        description: 'Restaurant recommandation web api',
    },
    host: 'localhost:3000',
    basePath: '/'
  },
  apis: ['./dist/src/routes/*.js'],
};

export default swaggerOption;
