const express = require("express")
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();

const taskRoutes = require("./routes/taskRoutes");

// Middleware
app.use(cors('*'));
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);


//swagger- link

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

module.exports = app;