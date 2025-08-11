    const swaggerJsdoc = require('swagger-jsdoc');

    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Task CRUD',
          version: '1.0.0',
          description: 'CRUD API for tasks',
        },
        servers: [
          {
            url: 'http://localhost:3001/api/tasks', 
            description: 'Development server',
          },
        ],
      },
      apis: ['./routes/taskRoutes.js'], 
    };

    const specs = swaggerJsdoc(options);
    module.exports = specs;