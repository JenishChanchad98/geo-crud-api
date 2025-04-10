const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const connectDB = require("./db");
const usersRoutes = require("./routes/users.routes");
const userDetailsRoutes = require("./routes/user-details.routes");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

if (!process.env.PORT) {
  console.log("PORT is not defined in environment variables");
  process.exit(1);
}

connectDB()
  .then(() => {
    app.use(express.json());
    app.use(bodyParser.json());

    app.use("/api/users", usersRoutes);
    app.use("/api/user-details", userDetailsRoutes);

    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
    process.exit(1);
  });
