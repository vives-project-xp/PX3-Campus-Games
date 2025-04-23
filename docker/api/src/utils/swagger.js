 import swaggerUi from 'swagger-ui';
 import swaggerJsDoc from 'swagger-jsdoc';
//  import log from './logger';
 
 const options = {
     definition: {
         openapi: "3.0.0",
         info: {
             title: "API Documentation",
         },
            servers: [
                {
                    url: "http://localhost:4000",
                },
            ],
     },
     apis: [
         "./src/routes/apiRoutes.js",
         "./src/schema/*.js",
     ],
 };
 
 const swaggerSpec = swaggerJsDoc(options);
 
 function swaggerDocs(app, port){
     // swagger page
     app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
     // docs in json format
     app.get('/docs.json', (req, res) => {
         res.setHeader('Content-Type', 'application/json');
         res.send(swaggerSpec);
     });
 
     log.info (`Docs available at http://localhost:${port}/docs`);
     log.info (`Docs in json format available at http://localhost:${port}/docs.json`);
 }
 
 export default swaggerDocs;