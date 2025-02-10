const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const apiOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API document for BookStore Website",
            version: "1.0.0",
            description: "API project of Web Development in HCMUS"
        },
        servers: [
            {
                url: 'https://localhost:8888',
                description: 'Local server'
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/**/*.js')], // Đường dẫn tới file chứa định nghĩa API
}

const swaggerSpec = swaggerJSDoc(apiOptions);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;