const mongoose = require("mongoose");
const path = require("path");
const app = require("./app")

require("dotenv").config();

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
