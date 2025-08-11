const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(cors('*'));
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

//swagger- link

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Connect to DB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("DB Connection Error:", err));
